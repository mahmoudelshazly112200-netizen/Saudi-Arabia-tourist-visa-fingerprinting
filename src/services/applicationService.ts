import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  Unsubscribe,
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
  DocumentVerificationStatus,
} from '../types/admin';
import {
  BankStatementStatus,
  SubmissionOutcome,
  SubmissionOutcomeStatus,
  TrackingResultData,
  VisaApplicationFormData,
} from '../types/visa';
import { calculateTotalVisaPrice } from '../utils/formatters';
import { computeTrackingKey } from '../utils/trackingHash';

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
  storedFileName: string,
  idToken: string | null
): Promise<{ blobUrl: string; mimeType: string }> {
  if (!idToken) {
    throw new Error('يرجى تسجيل الدخول بحساب الإدارة المعتمد لعرض المستند.');
  }

  const response = await fetch(`/api/admin/documents/${encodeURIComponent(storedFileName)}`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('تعذر تحميل ملف المستند من الخادم أو انتهت صلاحية الجلسة.');
  }

  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);
  return {
    blobUrl,
    mimeType: blob.type || 'application/octet-stream',
  };
}
