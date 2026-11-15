import fs from 'node:fs';
import path from 'node:path';
import {
  assertFails,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';

const PROJECT_ID = 'demo-nashka-security-test';
const VALID_TRACKING_KEY = `trk_${'a'.repeat(64)}`;
const VALID_APP_ID = 'app_valid_0001';

function buildValidApplicationPayload(overrides: Record<string, unknown> = {}) {
  return {
    id: VALID_APP_ID,
    referenceId: 'NSK-2026-123456',
    trackingKey: VALID_TRACKING_KEY,
    customerId: 'CUST-NSK-2026-123456',
    adminOwnerEmail: 'nashkatourism@gmail.com',
    fullName: 'أحمد محمد علي',
    phoneNumber: '01040009577',
    nationality: 'مصري',
    currentProfession: 'مهندس برمجيات',
    expectedTravelDate: '2027-03-15',
    applicantsCount: 2,
    totalAmountEgp: 19000,
    bankStatementStatus: 'available_if_requested',
    explanatoryNotes: 'رحلة عائلية سياحية',
    dataUsageConsent: true,
    status: 'new_submission',
    passportDoc: {
      id: 'DOC-PASS-0001',
      type: 'passport',
      labelAr: 'صورة جواز السفر',
      fileName: 'passport.jpg',
      storedFileName: '1700000000-00000000.jpg',
      fileSizeBytes: 204800,
      mimeType: 'image/jpeg',
      verificationStatus: 'pending',
    },
    photoDoc: {
      id: 'DOC-PHOTO-0001',
      type: 'personal_photo',
      labelAr: 'صورة شخصية',
      fileName: 'photo.jpg',
      storedFileName: '1700000001-00000000.jpg',
      fileSizeBytes: 102400,
      mimeType: 'image/jpeg',
      verificationStatus: 'pending',
    },
    createdAtIso: '2026-11-14T20:00:00.000Z',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    ...overrides,
  };
}

function buildValidTrackingPayload(overrides: Record<string, unknown> = {}) {
  return {
    trackingKey: VALID_TRACKING_KEY,
    applicationId: VALID_APP_ID,
    referenceId: 'NSK-2026-123456',
    applicantDisplayName: 'أحمد محمد علي',
    applicantsCount: 2,
    totalAmountEgp: 19000,
    expectedTravelDate: '2027-03-15',
    status: 'new_submission',
    passportVerificationStatus: 'pending',
    photoVerificationStatus: 'pending',
    createdAtIso: '2026-11-14T20:00:00.000Z',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    ...overrides,
  };
}

export async function runDirtyDozenSecuritySuite(): Promise<void> {
  const rulesPath = path.resolve(process.cwd(), 'firestore.rules');
  const rules = fs.readFileSync(rulesPath, 'utf8');

  const testEnv: RulesTestEnvironment = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: { rules },
  });

  try {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      const adminDb = ctx.firestore();
      await setDoc(
        doc(adminDb, 'applications', VALID_APP_ID),
        buildValidApplicationPayload({
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        })
      );
      await setDoc(
        doc(adminDb, 'applicationTracking', VALID_TRACKING_KEY),
        buildValidTrackingPayload({
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        })
      );
    });

    const unauthedDb = testEnv.unauthenticatedContext().firestore();
    const spoofedAdminDb = testEnv
      .authenticatedContext('spoof_uid', {
        email: 'nashkatourism@gmail.com',
        email_verified: false,
      })
      .firestore();
    const attackerDb = testEnv
      .authenticatedContext('attacker_uid', {
        email: 'attacker@gmail.com',
        email_verified: true,
      })
      .firestore();
    const superAdminDb = testEnv
      .authenticatedContext('nashka_admin_uid', {
        email: 'nashkatourism@gmail.com',
        email_verified: true,
      })
      .firestore();

    // 1. Shadow field injection on create
    const batch1 = writeBatch(unauthedDb);
    batch1.set(
      doc(unauthedDb, 'applications', 'app_shadow_01'),
      buildValidApplicationPayload({
        id: 'app_shadow_01',
        isApprovedOverride: true,
      })
    );
    batch1.set(
      doc(unauthedDb, 'applicationTracking', VALID_TRACKING_KEY),
      buildValidTrackingPayload({ applicationId: 'app_shadow_01' })
    );
    await assertFails(batch1.commit());

    // 2. Unverified admin email spoofing
    await assertFails(getDoc(doc(spoofedAdminDb, 'applications', VALID_APP_ID)));

    // 3. Non-admin PII read
    await assertFails(getDoc(doc(attackerDb, 'applications', VALID_APP_ID)));

    // 4. Tracking collection scraping (list)
    await assertFails(getDocs(collection(unauthedDb, 'applicationTracking')));

    // 5. Orphaned application create without tracking projection
    await assertFails(
      setDoc(
        doc(unauthedDb, 'applications', 'app_orphan_01'),
        buildValidApplicationPayload({
          id: 'app_orphan_01',
          trackingKey: `trk_${'b'.repeat(64)}`,
        })
      )
    );

    // 6. Initial status shortcutting
    const batch6 = writeBatch(unauthedDb);
    const key6 = `trk_${'c'.repeat(64)}`;
    batch6.set(
      doc(unauthedDb, 'applications', 'app_shortcut_01'),
      buildValidApplicationPayload({
        id: 'app_shortcut_01',
        trackingKey: key6,
        status: 'visa_issued',
      })
    );
    batch6.set(
      doc(unauthedDb, 'applicationTracking', key6),
      buildValidTrackingPayload({
        trackingKey: key6,
        applicationId: 'app_shortcut_01',
        status: 'visa_issued',
      })
    );
    await assertFails(batch6.commit());

    // 7. Commercial price tampering
    const batch7 = writeBatch(unauthedDb);
    const key7 = `trk_${'d'.repeat(64)}`;
    batch7.set(
      doc(unauthedDb, 'applications', 'app_price_01'),
      buildValidApplicationPayload({
        id: 'app_price_01',
        trackingKey: key7,
        applicantsCount: 3,
        totalAmountEgp: 9500,
      })
    );
    batch7.set(
      doc(unauthedDb, 'applicationTracking', key7),
      buildValidTrackingPayload({
        trackingKey: key7,
        applicationId: 'app_price_01',
        applicantsCount: 3,
        totalAmountEgp: 9500,
      })
    );
    await assertFails(batch7.commit());

    // 8. ID poisoning (oversized ID)
    await assertFails(
      setDoc(
        doc(unauthedDb, 'applications', 'x'.repeat(200)),
        buildValidApplicationPayload({ id: 'x'.repeat(200) })
      )
    );

    // 9. Client timestamp forgery
    const batch9 = writeBatch(unauthedDb);
    const key9 = `trk_${'e'.repeat(64)}`;
    batch9.set(
      doc(unauthedDb, 'applications', 'app_forged_time'),
      buildValidApplicationPayload({
        id: 'app_forged_time',
        trackingKey: key9,
        createdAt: Timestamp.fromMillis(1700000000000),
      })
    );
    batch9.set(
      doc(unauthedDb, 'applicationTracking', key9),
      buildValidTrackingPayload({
        trackingKey: key9,
        applicationId: 'app_forged_time',
      })
    );
    await assertFails(batch9.commit());

    // 10. Self-assigned admin privilege escalation
    await assertFails(
      setDoc(doc(attackerDb, 'admins', 'attacker_uid'), {
        uid: 'attacker_uid',
        email: 'attacker@gmail.com',
        displayName: 'Attacker',
        role: 'super_admin',
        addedByUid: 'attacker_uid',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    );

    // 11. Immutable field mutation on update
    await assertFails(
      updateDoc(doc(superAdminDb, 'applications', VALID_APP_ID), {
        referenceId: 'NSK-2026-999999',
        updatedAt: serverTimestamp(),
      })
    );

    // 12. Value poisoning on whitelisted status field
    await assertFails(
      updateDoc(doc(superAdminDb, 'applications', VALID_APP_ID), {
        status: 'invalid_poisoned_status',
        updatedAt: serverTimestamp(),
      })
    );
  } finally {
    await testEnv.cleanup();
  }
}
