import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clampApplicantsCount,
  getLocalTodayIso,
  validateFutureOrTodayDate,
  validatePhoneOrWhatsapp,
  validateUploadedFile,
  validateVisaApplicationForm,
} from './validation';
import { calculateTotalVisaPrice } from './formatters';
import { computeStaffKey, computeTrackingKey, sha256Hex } from './trackingHash';
import { buildCustomerWhatsappHref, normalizeWhatsappDigits } from '../constants/brand';
import { buildUtf8Csv } from './csvExport';
import { BankStatementStatus, VisaApplicationFormData } from '../types/visa';

test('calculateTotalVisaPrice multiplies approved EGP 9,500 per person accurately', () => {
  assert.equal(calculateTotalVisaPrice(1), 9500);
  assert.equal(calculateTotalVisaPrice(3), 28500);
  assert.equal(calculateTotalVisaPrice(0), 9500);
});

test('sha256Hex matches official NIST RFC 6234 test vector and computeTrackingKey normalizes phone formats', () => {
  assert.equal(
    sha256Hex('abc'),
    'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
  );
  const keyLocal = computeTrackingKey('nsk-2026-123456', '01040009577');
  const keyIntl = computeTrackingKey('NSK-2026-123456', '+20 104 000 9577');
  assert.equal(keyLocal, keyIntl);
  assert.match(keyLocal, /^trk_[a-f0-9]{64}$/);
});

test('computeStaffKey normalizes case and whitespace into deterministic 68-char stf_ hash', () => {
  const k1 = computeStaffKey('  Staff.Member@Gmail.com ');
  const k2 = computeStaffKey('staff.member@gmail.com');
  assert.equal(k1, k2);
  assert.match(k1, /^stf_[a-f0-9]{64}$/);
});

test('normalizeWhatsappDigits and buildCustomerWhatsappHref handle local Egyptian and intl formats', () => {
  assert.equal(normalizeWhatsappDigits('01040009577'), '201040009577');
  assert.equal(normalizeWhatsappDigits('+20 106 007 0093'), '201060070093');
  assert.equal(normalizeWhatsappDigits('00966501234567'), '966501234567');
  const href = buildCustomerWhatsappHref('01040009577', 'مرحباً عميلنا الكريم');
  assert.ok(href.startsWith('https://wa.me/201040009577?text='));
});

test('buildUtf8Csv prepends UTF-8 BOM, quotes cells, and neutralizes formula injection prefixes', () => {
  const csv = buildUtf8Csv(
    ['المرجع', 'الملاحظات'],
    [['NSK-2026-111111', '=HYPERLINK("http://evil.test")']]
  );
  assert.ok(csv.startsWith('\uFEFF'));
  assert.ok(csv.includes('"\'=HYPERLINK(""http://evil.test"")"'));
});

test('clampApplicantsCount enforces minimum 1 and maximum 20', () => {
  assert.equal(clampApplicantsCount(0), 1);
  assert.equal(clampApplicantsCount(-4), 1);
  assert.equal(clampApplicantsCount(4), 4);
  assert.equal(clampApplicantsCount(30), 20);
});

test('getLocalTodayIso formats local year, month, and day accurately', () => {
  const sample = new Date(2026, 0, 5, 1, 30, 0);
  assert.equal(getLocalTodayIso(sample), '2026-01-05');
});

test('validatePhoneOrWhatsapp accepts Egyptian and international phone numbers', () => {
  assert.equal(validatePhoneOrWhatsapp('01012345678'), true);
  assert.equal(validatePhoneOrWhatsapp('+20 101 234 5678'), true);
  assert.equal(validatePhoneOrWhatsapp('+966501234567'), true);
  assert.equal(validatePhoneOrWhatsapp('12345'), false);
  assert.equal(validatePhoneOrWhatsapp('abc12345678'), false);
});

test('validateFutureOrTodayDate rejects past/impossible calendar dates and accepts today/future dates', () => {
  assert.equal(validateFutureOrTodayDate('2026-12-01', '2026-11-14'), true);
  assert.equal(validateFutureOrTodayDate('2026-11-14', '2026-11-14'), true);
  assert.equal(validateFutureOrTodayDate('2026-11-13', '2026-11-14'), false);
  assert.equal(validateFutureOrTodayDate('2026-02-31', '2026-01-01'), false);
  assert.equal(validateFutureOrTodayDate('2026-13-10', '2026-01-01'), false);
});

test('validateUploadedFile enforces passport (image/PDF) vs personal photo (image only) and max size', () => {
  assert.equal(
    validateUploadedFile({ name: 'passport.pdf', size: 1024 * 500, type: 'application/pdf' }, 'passport').valid,
    true
  );
  assert.equal(
    validateUploadedFile({ name: 'photo.pdf', size: 1024 * 500, type: 'application/pdf' }, 'personal_photo').valid,
    false
  );
  assert.equal(
    validateUploadedFile({ name: 'photo.jpg', size: 1024 * 500, type: 'image/jpeg' }, 'personal_photo').valid,
    true
  );
  assert.equal(
    validateUploadedFile({ name: 'huge.jpg', size: 12 * 1024 * 1024, type: 'image/jpeg' }, 'passport').valid,
    false
  );
});

test('validateVisaApplicationForm requires passport and personal photo without requiring bank statement file upload', () => {
  const dummyFile = {} as File;
  const validForm: VisaApplicationFormData = {
    fullName: 'أحمد محمد محمود',
    phoneNumber: '01098765432',
    nationality: 'مصري',
    currentProfession: 'مهندس معماري',
    expectedTravelDate: '2026-12-20',
    applicantsCount: 2,
    passportDocument: {
      file: dummyFile,
      fileName: 'passport.jpg',
      fileSize: 420000,
      mimeType: 'image/jpeg',
      previewUrl: null,
    },
    personalPhoto: {
      file: dummyFile,
      fileName: 'personal_photo.png',
      fileSize: 280000,
      mimeType: 'image/png',
      previewUrl: null,
    },
    bankStatementStatus: BankStatementStatus.NOT_AVAILABLE_CURRENTLY,
    explanatoryNotes: '',
    dataUsageConsent: true,
  };

  const errors = validateVisaApplicationForm(validForm, '2026-11-14');
  assert.equal(Object.keys(errors).length, 0);

  const missingConsentAndName = validateVisaApplicationForm(
    { ...validForm, fullName: 'أحمد', dataUsageConsent: false },
    '2026-11-14'
  );
  assert.ok(missingConsentAndName.fullName);
  assert.ok(missingConsentAndName.dataUsageConsent);
});
