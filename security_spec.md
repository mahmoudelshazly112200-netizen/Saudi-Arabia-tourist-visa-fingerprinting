# Nashka Saudi Tourist Visa Platform — Firestore Security Specification (Phase 0 & Phase 5 Audit)

## 1. Master Source of Truth & Data Invariants

1. **Global Default Deny:** All paths outside `/applications/{applicationId}`, `/applicationTracking/{trackingKey}`, and `/admins/{adminUid}` are unconditionally denied (`allow read, write: if false;`).
2. **Bootstrapped Super Admin Invariant:** Administrative read/list/update privileges require a signed-in Google account with `request.auth.token.email_verified == true` AND (`request.auth.token.email == 'nashkatourism@gmail.com'` OR an existing `/admins/$(request.auth.uid)` record). Unverified emails matching `nashkatourism@gmail.com` are strictly rejected.
3. **PII Isolation (Split Collection Pattern):**
   - `/applications/{applicationId}` stores PII (`fullName`, `phoneNumber`, `nationality`, `currentProfession`, `explanatoryNotes`, `passportDoc`, `photoDoc`). **No non-admin user (`get` or `list`) can ever read `/applications/{applicationId}`.**
   - `/applicationTracking/{trackingKey}` stores **zero** phone numbers, emails, addresses, notes, or file storage names. It is keyed by `trk_<64-char-hex-sha256>` (`SHA-256(UPPER(referenceId) + ":" + phoneLast9)`) and forbids `list` (`allow list: if false;`), allowing only single-document `get` when the exact hash is known.
4. **Atomic Dual-Write Invariant (`existsAfter` / `getAfter`):**
   - Creating `/applications/{applicationId}` requires `existsAfter(/databases/$(database)/documents/applicationTracking/$(incoming().trackingKey))` in the same atomic batch, and vice versa (`existsAfter(/databases/$(database)/documents/applications/$(incoming().applicationId))`).
   - Initial status MUST be `'new_submission'` and both `passportDoc.verificationStatus` and `photoDoc.verificationStatus` MUST be `'pending'`.
   - `totalAmountEgp` MUST mathematically equal `applicantsCount * 9500` (`1 <= applicantsCount <= 20`).
5. **Temporal & Immutability Invariant:**
   - `createdAt == request.time` and `updatedAt == request.time` on `create`.
   - `updatedAt == request.time` and `createdAt == existing().createdAt` on `update`.
   - `id`, `referenceId`, `trackingKey`, `customerId`, `adminOwnerEmail`, and `createdAt` are strictly immutable across all updates.
6. **Query-Enforced Cost-Safe Listing:**
   - `/applications/{applicationId}` `allow list` forbids `get()`/`exists()` calls and requires `isBootstrappedAdmin() && resource.data.adminOwnerEmail == request.auth.token.email`.
   - `/applicationTracking` and `/admins` forbid `list` (`allow list: if false;`).

---

## 2. The "Dirty Dozen" Adversarial Payloads

1. **Payload 1 — Shadow Field Injection on Application Create:** Valid `VisaApplication` payload plus unauthorized ghost field `"isApprovedOverride": true`. -> `PERMISSION_DENIED` (`hasOnly` check).
2. **Payload 2 — Email Spoofing on Admin Read:** Authenticated user with `email: "nashkatourism@gmail.com"` but `email_verified: false` attempting `get` or `list` on `/applications/{id}`. -> `PERMISSION_DENIED`.
3. **Payload 3 — Non-Admin PII Read:** Verified authenticated regular user (`attacker@gmail.com`, `email_verified: true`) attempting `get` on `/applications/app_valid_001`. -> `PERMISSION_DENIED`.
4. **Payload 4 — Tracking Collection Scraping (`list`):** Unauthenticated or authenticated user attempting `getDocs(collection(db, 'applicationTracking'))`. -> `PERMISSION_DENIED` (`allow list: if false`).
5. **Payload 5 — Orphaned Application Create (Atomicity Bypass):** Creating `/applications/app_orphan_001` without simultaneously writing `/applicationTracking/{trackingKey}` in the same batch. -> `PERMISSION_DENIED` (`existsAfter` gate).
6. **Payload 6 — Initial Status Shortcutting:** Creating `/applications/app_shortcut_001` with `status: "visa_issued"` instead of `"new_submission"`. -> `PERMISSION_DENIED`.
7. **Payload 7 — Commercial Price Tampering:** Creating `/applications/app_tamper_001` with `applicantsCount: 3` and `totalAmountEgp: 9500` (bypassing `3 * 9500 = 28500`). -> `PERMISSION_DENIED`.
8. **Payload 8 — Denial-of-Wallet ID Poisoning:** Creating `/applications/{200-char-junk-id}` or `/applicationTracking/invalid_key`. -> `PERMISSION_DENIED` (`isValidId` / `isValidTrackingKey`).
9. **Payload 9 — Client Timestamp Forgery:** Creating `/applications/app_time_001` with a past/future `Timestamp` instead of `serverTimestamp()` (`request.time`). -> `PERMISSION_DENIED`.
10. **Payload 10 — Self-Assigned Admin Privilege Escalation:** Verified user `attacker@gmail.com` attempting `setDoc(doc(db, 'admins', attackerUid), { role: 'super_admin', ... })`. -> `PERMISSION_DENIED`.
11. **Payload 11 — Immutable Field Mutation on Update:** Verified admin attempting `updateDoc` on `/applications/{id}` that alters `referenceId` or `adminOwnerEmail`. -> `PERMISSION_DENIED`.
12. **Payload 12 — Value Poisoning on Whitelisted Update Key:** Verified admin attempting `updateDoc` on `/applications/{id}` setting `status` to `"hacked_status"` or a `10KB` string. -> `PERMISSION_DENIED` (`isValidApplication(incoming())` wraps entire update).

---

## 3. Phase 5 Red Team Conflict Report

| Collection | Identity Spoofing | State Shortcutting | Resource / Value Poisoning | PII Blanket Leak | Query Trust (`list`) | Verdict |
|---|---|---|---|---|---|---|
| `/applications/{applicationId}` | Blocked (`email_verified == true` + `nashkatourism@gmail.com` / `/admins/{uid}`) | Blocked (`status == 'new_submission'` on create; action-gated updates) | Blocked (`isValidId`, `isValidApplication` wraps create & update, nested `passportDoc`/`photoDoc` strict maps) | Blocked (`get`/`list` restricted strictly to verified Admin) | Blocked (`resource.data.adminOwnerEmail == request.auth.token.email`, zero `get()`/`exists()`) | **PASS** |
| `/applicationTracking/{trackingKey}` | Blocked (updates require verified Admin) | Blocked (`status == 'new_submission'` on create + `existsAfter` parent check) | Blocked (`isValidTrackingKey` 68-char SHA-256 regex + `isValidTracking` strict lengths) | Blocked (contains zero phone/email/file paths) | Blocked (`allow list: if false`) | **PASS** |
| `/admins/{adminUid}` | Blocked (only `isBootstrappedAdmin()` can create/update/delete) | N/A (role enum strictly validated) | Blocked (`isValidId` + `isValidAdminStaff` wraps create & update) | Blocked (`get` restricted to self `uid` or `isBootstrappedAdmin()`) | Blocked (`allow list: if false`) | **PASS** |
