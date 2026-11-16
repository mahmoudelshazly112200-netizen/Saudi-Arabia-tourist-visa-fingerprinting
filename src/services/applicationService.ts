import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Unsubscribe,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import {
  BOOTSTRAPPED_SUPER_ADMIN_EMAIL,
  db,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import {
  AdminApplicationRecord,
  AdminCustomerSummary,
  AdminDocumentItem,
  ApplicationRecordStatus,
  AssignableStaffRole,
  DocumentVerificationStatus,
  StaffDirectoryEntry,
} from '../types/admin';
import {
  BankStatementStatus,
  SubmissionOutcome,
  SubmissionOutcomeStatus,
  TrackingResultData,
  VisaApplicationFormData,
} from '../types/visa';
import { calculateTotalVisaPrice } from '../utils/formatters';
import { computeStaffKey, computeTrackingKey } from '../utils/trackingHash';

// Blueprint-synchronized volumetric & regex constraints (firebase-blueprint.json)
export const BLUEPRINT_LIMITS = {
  fullNameMin: 5,
  fullNameMax: 150,
  phoneMin: 9,
  phoneMax: 20,
  phonePattern: /^\+?[0-9\s\-()]{9,20}$/,
  nationalityMin: 2,
  nationalityMax: 80,
  professionMin: 2,
  professionMax: 120,
  notesMax: 2000,
  referencePattern: /^NSK-[0-9]{4}-[0-9]{6}$/,
} as const;

interface FirestoreDocumentMap {
  id: string;
  type: 'passport' | 'personal_photo';
  labelAr: string;
  fileName: string;
  storedFileName: string;
  fileSizeBytes: number;
  mimeType: string;
  verificationStatus: DocumentVerificationStatus;
}

interface FirestoreApplicationDoc {
  id: string;
  referenceId: string;
  trackingKey: string;
  customerId: string;
  adminOwnerEmail: string;
  fullName: string;
  phoneNumber: string;
  nationality: string;
  currentProfession: string;
  expectedTravelDate: string;
  applicantsCount: number;
  totalAmountEgp: number;
  bankStatementStatus: BankStatementStatus;
  explanatoryNotes: string;
  dataUsageConsent: boolean;
  status: ApplicationRecordStatus;
  passportDoc: FirestoreDocumentMap;
  photoDoc: FirestoreDocumentMap;
  createdAtIso: string;
}

function mapFirestoreDocToAdminRecord(raw: FirestoreApplicationDoc): AdminApplicationRecord {
  const docs: AdminDocumentItem[] = [raw.passportDoc, raw.photoDoc].filter(Boolean);
  return {
    id: raw.id,
    referenceId: raw.referenceId,
    trackingKey: raw.trackingKey,
    customerId: raw.customerId,
    fullName: raw.fullName,
    phoneNumber: raw.phoneNumber,
    nationality: raw.nationality,
    currentProfession: raw.currentProfession,
    expectedTravelDate: raw.expectedTravelDate,
    applicantsCount: raw.applicantsCount,
    totalAmountEgp: raw.totalAmountEgp,
    bankStatementStatus: raw.bankStatementStatus,
    explanatoryNotes: raw.explanatoryNotes || '',
    status: raw.status,
    documents: docs,
    createdAt: raw.createdAtIso,
    source: 'cloud_firestore',
  };
}

const MAX_CLOUD_DATA_URL_LENGTH = 820000;
const MAX_RAW_PDF_CLOUD_BYTES = 580000;

interface CloudAttachmentPayload {
  mimeType: 'image/jpeg' | 'application/pdf';
  dataUrl: string;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Unexpected FileReader output'));
      }
    };
    reader.onerror = () => reject(reader.error || new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

function compressImageToDataUrl(
  file: File,
  maxDimension: number,
  quality: number
): Promise<string | null> {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const scale = Math.min(1, maxDimension / Math.max(img.width || 1, img.height || 1));
        const targetWidth = Math.max(1, Math.round(img.width * scale));
        const targetHeight = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          resolve(null);
          return;
        }
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        const encoded = canvas.toDataURL('image/jpeg', quality);
        URL.revokeObjectURL(objectUrl);
        resolve(encoded);
      } catch {
        URL.revokeObjectURL(objectUrl);
        resolve(null);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(null);
    };
    img.src = objectUrl;
  });
}

async function buildCloudAttachmentCopy(file: File | undefined): Promise<CloudAttachmentPayload | null> {
  if (!file || typeof document === 'undefined') return null;

  try {
    if (file.type === 'application/pdf') {
      if (file.size > MAX_RAW_PDF_CLOUD_BYTES) {
        return null;
      }
      const dataUrl = await readFileAsDataUrl(file);
      if (
        dataUrl.length >= 20 &&
        dataUrl.length <= MAX_CLOUD_DATA_URL_LENGTH &&
        dataUrl.startsWith('data:application/pdf;base64,')
      ) {
        return { mimeType: 'application/pdf', dataUrl };
      }
      return null;
    }

    if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp') {
      const firstPass = await compressImageToDataUrl(file, 1280, 0.78);
      if (
        firstPass &&
        firstPass.length >= 20 &&
        firstPass.length <= MAX_CLOUD_DATA_URL_LENGTH &&
        firstPass.startsWith('data:image/jpeg;base64,')
      ) {
        return { mimeType: 'image/jpeg', dataUrl: firstPass };
      }

      const secondPass = await compressImageToDataUrl(file, 960, 0.6);
      if (
        secondPass &&
        secondPass.length >= 20 &&
        secondPass.length <= MAX_CLOUD_DATA_URL_LENGTH &&
        secondPass.startsWith('data:image/jpeg;base64,')
      ) {
        return { mimeType: 'image/jpeg', dataUrl: secondPass };
      }
    }
  } catch {
    return null;
  }

  return null;
}

function dataUrlToBlobUrl(dataUrl: string, fallbackMime: string): { blobUrl: string; mimeType: string } {
  const commaIndex = dataUrl.indexOf(',');
  if (commaIndex === -1) {
    throw new Error('بيانات المستند السحابي غير مكتملة.');
  }
  const header = dataUrl.slice(0, commaIndex);
  const base64Body = dataUrl.slice(commaIndex + 1);
  const mimeMatch = /^data:([^;]+);base64$/i.exec(header);
  const mimeType = mimeMatch?.[1] || fallbackMime || 'application/octet-stream';

  const binary = atob(base64Body);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: mimeType });
  return {
    blobUrl: URL.createObjectURL(blob),
    mimeType,
  };
}

function sanitizeDocumentMap(
  docItem: AdminDocumentItem,
  expectedType: 'passport' | 'personal_photo'
): FirestoreDocumentMap {
  return {
    id: docItem.id.slice(0, 128),
    type: expectedType,
    labelAr: (expectedType === 'passport' ? 'صورة جواز السفر' : 'صورة شخصية').slice(0, 60),
    fileName: (docItem.fileName || 'document.jpg').slice(0, 160),
    storedFileName: (docItem.storedFileName || '0-00000000.bin').slice(0, 120),
    fileSizeBytes: Math.max(1, Math.min(10485760, Math.floor(docItem.fileSizeBytes || 1))),
    mimeType: (docItem.mimeType || 'image/jpeg').slice(0, 40),
    verificationStatus: docItem.verificationStatus || DocumentVerificationStatus.PENDING,
  };
}

export async function submitVisaApplication(
  formData: VisaApplicationFormData
): Promise<SubmissionOutcome> {
  const totalEgp = calculateTotalVisaPrice(formData.applicantsCount);

  try {
    const safeFullName = formData.fullName.trim().slice(0, BLUEPRINT_LIMITS.fullNameMax);
    const safePhone = formData.phoneNumber.trim().slice(0, BLUEPRINT_LIMITS.phoneMax);
    const safeNationality = formData.nationality.trim().slice(0, BLUEPRINT_LIMITS.nationalityMax);
    const safeProfession = formData.currentProfession
      .trim()
      .slice(0, BLUEPRINT_LIMITS.professionMax);
    const safeNotes = formData.explanatoryNotes.trim().slice(0, BLUEPRINT_LIMITS.notesMax);

    const payload = new FormData();
    payload.append('fullName', safeFullName);
    payload.append('phoneNumber', safePhone);
    payload.append('nationality', safeNationality);
    payload.append('currentProfession', safeProfession);
    payload.append('expectedTravelDate', formData.expectedTravelDate);
    payload.append('applicantsCount', String(formData.applicantsCount));
    payload.append('bankStatementStatus', formData.bankStatementStatus);
    payload.append('explanatoryNotes', safeNotes);
    payload.append('dataUsageConsent', String(formData.dataUsageConsent));

    if (formData.passportDocument) {
      payload.append('passportDocument', formData.passportDocument.file);
    }
    if (formData.personalPhoto) {
      payload.append('personalPhoto', formData.personalPhoto.file);
    }

    const response = await fetch('/api/applications', {
      method: 'POST',
      body: payload,
    });

    const result = (await response.json()) as {
      ok?: boolean;
      referenceId?: string;
      createdAt?: string;
      totalAmountEgp?: number;
      application?: AdminApplicationRecord;
      error?: string;
    };

    if (!response.ok || !result.ok || !result.referenceId || !result.application) {
      return {
        status: SubmissionOutcomeStatus.ERROR,
        calculatedTotalEgp: totalEgp,
        timestamp: new Date().toISOString(),
        message:
          result.error ||
          'تعذر إتمام حفظ الطلب على الخادم. تم الاحتفاظ ببياناتك المدخلة للمحاولة مرة أخرى.',
      };
    }

    const serverApp = result.application;
    const trackingKey = computeTrackingKey(serverApp.referenceId, serverApp.phoneNumber);
    const passportSource =
      serverApp.documents.find((d) => d.type === 'passport') || serverApp.documents[0];
    const photoSource =
      serverApp.documents.find((d) => d.type === 'personal_photo') || serverApp.documents[1];

    const passportDoc = sanitizeDocumentMap(passportSource, 'passport');
    const photoDoc = sanitizeDocumentMap(photoSource, 'personal_photo');
    const createdAtIso = (serverApp.createdAt || new Date().toISOString()).slice(0, 35);

    const [passportCopy, photoCopy] = await Promise.all([
      buildCloudAttachmentCopy(formData.passportDocument?.file),
      buildCloudAttachmentCopy(formData.personalPhoto?.file),
    ]);

    const appDocPath = `applications/${serverApp.id}`;
    try {
      const batch = writeBatch(db);
      batch.set(doc(db, 'applications', serverApp.id), {
        id: serverApp.id,
        referenceId: serverApp.referenceId,
        trackingKey,
        customerId: serverApp.customerId,
        adminOwnerEmail: BOOTSTRAPPED_SUPER_ADMIN_EMAIL,
        fullName: safeFullName,
        phoneNumber: safePhone,
        nationality: safeNationality,
        currentProfession: safeProfession,
        expectedTravelDate: serverApp.expectedTravelDate,
        applicantsCount: serverApp.applicantsCount,
        totalAmountEgp: serverApp.totalAmountEgp,
        bankStatementStatus: serverApp.bankStatementStatus,
        explanatoryNotes: safeNotes,
        dataUsageConsent: true,
        status: ApplicationRecordStatus.NEW_SUBMISSION,
        passportDoc,
        photoDoc,
        createdAtIso,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      batch.set(doc(db, 'applicationTracking', trackingKey), {
        trackingKey,
        applicationId: serverApp.id,
        referenceId: serverApp.referenceId,
        applicantDisplayName: safeFullName,
        applicantsCount: serverApp.applicantsCount,
        totalAmountEgp: serverApp.totalAmountEgp,
        expectedTravelDate: serverApp.expectedTravelDate,
        status: ApplicationRecordStatus.NEW_SUBMISSION,
        passportVerificationStatus: DocumentVerificationStatus.PENDING,
        photoVerificationStatus: DocumentVerificationStatus.PENDING,
        createdAtIso,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      if (passportCopy) {
        batch.set(doc(db, 'applications', serverApp.id, 'attachments', 'passport'), {
          applicationId: serverApp.id,
          docType: 'passport',
          fileName: passportDoc.fileName,
          mimeType: passportCopy.mimeType,
          dataUrl: passportCopy.dataUrl,
          createdAt: serverTimestamp(),
        });
      }

      if (photoCopy) {
        batch.set(doc(db, 'applications', serverApp.id, 'attachments', 'personal_photo'), {
          applicationId: serverApp.id,
          docType: 'personal_photo',
          fileName: photoDoc.fileName,
          mimeType: photoCopy.mimeType,
          dataUrl: photoCopy.dataUrl,
          createdAt: serverTimestamp(),
        });
      }

      await batch.commit();
    } catch (firestoreErr) {
      handleFirestoreError(firestoreErr, OperationType.CREATE, appDocPath);
    }

    return {
      status: SubmissionOutcomeStatus.SUBMITTED_CONFIRMED,
      confirmedReferenceId: serverApp.referenceId,
      calculatedTotalEgp: serverApp.totalAmountEgp ?? totalEgp,
      timestamp: createdAtIso,
      message:
        'تم استلام طلب التأشيرة السياحية ورفع المستندات وحفظها بنجاح في قاعدة البيانات السحابية للمنصة. احتفظ برقم الطلب المرجعي التالي لمتابعة حالة طلبك.',
    };
  } catch {
    return {
      status: SubmissionOutcomeStatus.ERROR,
      calculatedTotalEgp: totalEgp,
      timestamp: new Date().toISOString(),
      message:
        'تعذر الاتصال بخادم استلام الطلبات. تم الحفاظ على كافة البيانات التي أدخلتها لتتمكن من المحاولة مرة أخرى دون فقدانها.',
    };
  }
}

export async function queryApplicationTracking(
  referenceId: string,
  phoneNumber: string
): Promise<{ ok: true; tracking: TrackingResultData } | { ok: false; error: string }> {
  const cleanRef = referenceId.trim().toUpperCase();
  const cleanPhoneDigits = phoneNumber.replace(/[^\d]/g, '');

  if (!cleanRef || cleanRef.length > 32 || cleanPhoneDigits.length < 8 || cleanPhoneDigits.length > 16) {
    return {
      ok: false,
      error: 'يرجى إدخال رقم الطلب المرجعي ورقم الهاتف بشكل صحيح.',
    };
  }

  const trackingKey = computeTrackingKey(cleanRef, phoneNumber);
  const trackingPath = `applicationTracking/${trackingKey}`;

  try {
    const snap = await getDoc(doc(db, 'applicationTracking', trackingKey));
    if (snap.exists()) {
      const data = snap.data() as {
        referenceId: string;
        applicantDisplayName: string;
        applicantsCount: number;
        totalAmountEgp: number;
        expectedTravelDate: string;
        status: string;
        passportVerificationStatus: string;
        photoVerificationStatus: string;
        createdAtIso: string;
      };

      return {
        ok: true,
        tracking: {
          referenceId: data.referenceId,
          fullName: data.applicantDisplayName,
          applicantsCount: data.applicantsCount,
          totalAmountEgp: data.totalAmountEgp,
          expectedTravelDate: data.expectedTravelDate,
          status: data.status,
          createdAt: data.createdAtIso,
          documents: [
            {
              type: 'passport',
              labelAr: 'صورة جواز السفر',
              verificationStatus: data.passportVerificationStatus,
            },
            {
              type: 'personal_photo',
              labelAr: 'صورة شخصية',
              verificationStatus: data.photoVerificationStatus,
            },
          ],
        },
      };
    }
  } catch (err) {
    try {
      handleFirestoreError(err, OperationType.GET, trackingPath);
    } catch {
      // Logged in structured FirestoreErrorInfo format; fall back to API lookup
    }
  }

  try {
    const params = new URLSearchParams({
      referenceId: cleanRef,
      phone: phoneNumber.trim(),
    });
    const response = await fetch(`/api/applications/track?${params.toString()}`);
    const data = (await response.json()) as {
      ok?: boolean;
      tracking?: TrackingResultData;
      error?: string;
    };

    if (!response.ok || !data.ok || !data.tracking) {
      return {
        ok: false,
        error: data.error || 'لم يتم العثور على طلب مطابق لرقم المرجع ورقم الهاتف المدخلين.',
      };
    }

    return { ok: true, tracking: data.tracking };
  } catch {
    return {
      ok: false,
      error: 'تعذر الاتصال بخدمة متابعة الطلبات حالياً، يرجى المحاولة مرة أخرى.',
    };
  }
}

export function subscribeToAdminApplications(
  onRecords: (records: AdminApplicationRecord[]) => void,
  onError: (messageAr: string) => void
): Unsubscribe {
  const appsQuery = query(
    collection(db, 'applications'),
    where('adminOwnerEmail', '==', BOOTSTRAPPED_SUPER_ADMIN_EMAIL)
  );

  return onSnapshot(
    appsQuery,
    (snapshot) => {
      const mapped = snapshot.docs
        .map((docSnap) => mapFirestoreDocToAdminRecord(docSnap.data() as FirestoreApplicationDoc))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      onRecords(mapped);
    },
    (error) => {
      onError('تعذر مزامنة الطلبات من قاعدة البيانات السحابية.');
      handleFirestoreError(error, OperationType.LIST, 'applications');
    }
  );
}

export function deriveAdminCustomers(records: AdminApplicationRecord[]): AdminCustomerSummary[] {
  const byPhone = new Map<string, AdminCustomerSummary>();

  for (const rec of records) {
    const key = rec.phoneNumber.replace(/[^\d]/g, '') || rec.customerId;
    const existing = byPhone.get(key);
    if (!existing) {
      byPhone.set(key, {
        id: rec.customerId,
        fullName: rec.fullName,
        phoneNumber: rec.phoneNumber,
        nationality: rec.nationality,
        currentProfession: rec.currentProfession,
        applicationsCount: 1,
        lastActivityAt: rec.createdAt,
      });
    } else {
      existing.applicationsCount += 1;
      if (rec.createdAt > existing.lastActivityAt) {
        existing.lastActivityAt = rec.createdAt;
      }
    }
  }

  return Array.from(byPhone.values());
}

export async function updateCloudApplicationStatus(
  record: AdminApplicationRecord,
  status: ApplicationRecordStatus,
  idToken: string | null
): Promise<void> {
  const trackingKey =
    record.trackingKey || computeTrackingKey(record.referenceId, record.phoneNumber);
  const appPath = `applications/${record.id}`;

  try {
    const batch = writeBatch(db);
    batch.update(doc(db, 'applications', record.id), {
      status,
      updatedAt: serverTimestamp(),
    });
    batch.update(doc(db, 'applicationTracking', trackingKey), {
      status,
      updatedAt: serverTimestamp(),
    });
    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, appPath);
  }

  if (idToken) {
    try {
      await fetch(`/api/admin/applications/${encodeURIComponent(record.id)}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ status }),
      });
    } catch {
      // Non-fatal mirror to local server storage
    }
  }
}

export async function updateCloudDocumentStatus(
  record: AdminApplicationRecord,
  documentId: string,
  verificationStatus: DocumentVerificationStatus,
  idToken: string | null
): Promise<void> {
  const targetDoc = record.documents.find((d) => d.id === documentId);
  if (!targetDoc) {
    throw new Error('المستند المطلوب تحديثه غير موجود.');
  }

  const trackingKey =
    record.trackingKey || computeTrackingKey(record.referenceId, record.phoneNumber);
  const appPath = `applications/${record.id}`;
  const updatedDocMap = sanitizeDocumentMap(
    { ...targetDoc, verificationStatus },
    targetDoc.type
  );

  try {
    const batch = writeBatch(db);
    if (targetDoc.type === 'passport') {
      batch.update(doc(db, 'applications', record.id), {
        passportDoc: updatedDocMap,
        updatedAt: serverTimestamp(),
      });
      batch.update(doc(db, 'applicationTracking', trackingKey), {
        passportVerificationStatus: verificationStatus,
        updatedAt: serverTimestamp(),
      });
    } else {
      batch.update(doc(db, 'applications', record.id), {
        photoDoc: updatedDocMap,
        updatedAt: serverTimestamp(),
      });
      batch.update(doc(db, 'applicationTracking', trackingKey), {
        photoVerificationStatus: verificationStatus,
        updatedAt: serverTimestamp(),
      });
    }
    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, appPath);
  }

  if (idToken) {
    try {
      await fetch(
        `/api/admin/applications/${encodeURIComponent(record.id)}/documents/${encodeURIComponent(documentId)}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ verificationStatus }),
        }
      );
    } catch {
      // Non-fatal mirror to local server storage
    }
  }
}

export async function fetchProtectedAdminDocumentBlob(
  appId: string,
  docType: 'passport' | 'personal_photo',
  storedFileName: string | undefined,
  idToken: string | null
): Promise<{ blobUrl: string; mimeType: string }> {
  if (!idToken) {
    throw new Error('يرجى تسجيل الدخول بحساب الإدارة المعتمد لعرض المستند.');
  }

  if (storedFileName) {
    try {
      const response = await fetch(`/api/admin/documents/${encodeURIComponent(storedFileName)}`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (response.ok) {
        const blob = await response.blob();
        return {
          blobUrl: URL.createObjectURL(blob),
          mimeType: blob.type || 'application/octet-stream',
        };
      }
    } catch {
      // Fall back to persisted cloud attachment copy in Firestore
    }
  }

  const attachmentPath = `applications/${appId}/attachments/${docType}`;
  try {
    const snap = await getDoc(doc(db, 'applications', appId, 'attachments', docType));
    if (snap.exists()) {
      const data = snap.data() as { dataUrl?: string; mimeType?: string };
      if (data.dataUrl) {
        return dataUrlToBlobUrl(data.dataUrl, data.mimeType || 'image/jpeg');
      }
    }
  } catch (err) {
    try {
      handleFirestoreError(err, OperationType.GET, attachmentPath);
    } catch {
      // Error logged cleanly in structured FirestoreErrorInfo format
    }
  }

  throw new Error(
    'تعذر العثور على نسخة المستند على الخادم أو في النسخة السحابية (الملفات PDF الكبيرة تتوفر عبر الجلسة النشطة للخادم فقط).'
  );
}

export function subscribeToStaffDirectory(
  onStaff: (entries: StaffDirectoryEntry[]) => void,
  onError: (messageAr: string) => void
): Unsubscribe {
  const staffQuery = query(
    collection(db, 'staffDirectory'),
    where('ownerAdminEmail', '==', BOOTSTRAPPED_SUPER_ADMIN_EMAIL)
  );

  return onSnapshot(
    staffQuery,
    (snapshot) => {
      const mapped: StaffDirectoryEntry[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as {
          staffKey: string;
          email: string;
          displayName: string;
          role: AssignableStaffRole;
          ownerAdminEmail: string;
          addedByUid: string;
          createdAt?: { toDate?: () => Date };
        };
        return {
          staffKey: data.staffKey,
          email: data.email,
          displayName: data.displayName,
          role: data.role,
          ownerAdminEmail: data.ownerAdminEmail,
          addedByUid: data.addedByUid,
          createdAtIso: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : undefined,
        };
      });
      onStaff(mapped);
    },
    (error) => {
      onError('تعذر مزامنة قائمة فريق العمل من قاعدة البيانات السحابية.');
      handleFirestoreError(error, OperationType.LIST, 'staffDirectory');
    }
  );
}

export async function saveStaffDirectoryEntry(params: {
  email: string;
  displayName: string;
  role: AssignableStaffRole;
  addedByUid: string;
}): Promise<void> {
  const normalizedEmail = params.email.trim().toLowerCase();
  const safeDisplayName = params.displayName.trim().slice(0, 120);
  const staffKey = computeStaffKey(normalizedEmail);
  const staffRef = doc(db, 'staffDirectory', staffKey);
  const path = `staffDirectory/${staffKey}`;

  try {
    const existingSnap = await getDoc(staffRef);
    if (existingSnap.exists()) {
      await updateDoc(staffRef, {
        displayName: safeDisplayName,
        role: params.role,
        updatedAt: serverTimestamp(),
      });
      return;
    }

    await setDoc(staffRef, {
      staffKey,
      email: normalizedEmail,
      displayName: safeDisplayName,
      role: params.role,
      ownerAdminEmail: BOOTSTRAPPED_SUPER_ADMIN_EMAIL,
      addedByUid: params.addedByUid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteStaffDirectoryEntry(staffKey: string): Promise<void> {
  const path = `staffDirectory/${staffKey}`;
  try {
    await deleteDoc(doc(db, 'staffDirectory', staffKey));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}
