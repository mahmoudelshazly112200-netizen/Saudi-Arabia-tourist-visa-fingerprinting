import { VISA_SERVICE_CONFIG } from '../constants/brand';
import { FormValidationErrors, VisaApplicationFormData } from '../types/visa';

export interface FileValidationResult {
  valid: boolean;
  errorMessage?: string;
}

export function getLocalTodayIso(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function validatePhoneOrWhatsapp(phone: string): boolean {
  const trimmed = phone.trim();
  if (trimmed.length < 9 || trimmed.length > 20 || !/^\+?[0-9\s\-()]{9,20}$/.test(trimmed)) {
    return false;
  }
  const cleaned = trimmed.replace(/[\s\-()]/g, '');
  // Supports Egyptian mobile (01XXXXXXXXX or +201XXXXXXXXX) and general international numbers (9 to 15 digits)
  return /^\+?\d{9,15}$/.test(cleaned);
}

export function validateFutureOrTodayDate(dateStr: string, referenceTodayIso?: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr || '');
  if (!match) {
    return false;
  }

  const year = Number.parseInt(match[1], 10);
  const month = Number.parseInt(match[2], 10);
  const day = Number.parseInt(match[3], 10);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return false;
  }

  const todayStr = referenceTodayIso || getLocalTodayIso();
  return dateStr >= todayStr;
}

export function validateUploadedFile(
  file: { name: string; size: number; type: string } | null,
  documentType: 'passport' | 'personal_photo'
): FileValidationResult {
  if (!file) {
    return {
      valid: false,
      errorMessage:
        documentType === 'passport'
          ? 'يرجى إرفاق صورة أو ملف جواز السفر الساري.'
          : 'يرجى إرفاق الصورة الشخصية الحديثة.',
    };
  }

  if (file.size <= 0) {
    return {
      valid: false,
      errorMessage: 'الملف المحدد فارغ أو غير صالح، يرجى اختيار ملف آخر.',
    };
  }

  if (file.size > VISA_SERVICE_CONFIG.maxFileSizeBytes) {
    return {
      valid: false,
      errorMessage: 'حجم الملف يتجاوز الحد الأقصى المسموح به (10 ميجابايت).',
    };
  }

  const allowedTypes: readonly string[] =
    documentType === 'passport'
      ? VISA_SERVICE_CONFIG.acceptedPassportTypes
      : VISA_SERVICE_CONFIG.acceptedPhotoTypes;

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      errorMessage:
        documentType === 'passport'
          ? 'صيغة الملف غير مدعومة. يرجى رفع صورة (JPG, PNG, WEBP) أو ملف PDF لجواز السفر.'
          : 'صيغة الصورة غير مدعومة. يرجى رفع صورة شخصية بصيغة JPG أو PNG أو WEBP.',
    };
  }

  return { valid: true };
}

export function clampApplicantsCount(value: number): number {
  if (!Number.isFinite(value)) return VISA_SERVICE_CONFIG.minApplicants;
  return Math.max(
    VISA_SERVICE_CONFIG.minApplicants,
    Math.min(VISA_SERVICE_CONFIG.maxApplicantsPerSubmission, Math.floor(value))
  );
}

export function validateVisaApplicationForm(
  data: VisaApplicationFormData,
  referenceTodayIso?: string
): FormValidationErrors {
  const errors: FormValidationErrors = {};

  const trimmedName = data.fullName.trim();
  if (!trimmedName) {
    errors.fullName = 'يرجى إدخال الاسم الكامل كما هو مدون في جواز السفر.';
  } else if (trimmedName.length < 5 || trimmedName.split(/\s+/).length < 2) {
    errors.fullName = 'يرجى كتابة الاسم ثنائياً أو ثلاثياً على الأقل بشكل صحيح.';
  } else if (trimmedName.length > 150) {
    errors.fullName = 'الاسم المدخل طويل جداً، يرجى كتابة الاسم كما في جواز السفر (حد أقصى 150 حرفاً).';
  }

  if (!data.phoneNumber.trim()) {
    errors.phoneNumber = 'يرجى إدخال رقم الهاتف أو واتساب للتواصل.';
  } else if (!validatePhoneOrWhatsapp(data.phoneNumber)) {
    errors.phoneNumber = 'يرجى إدخال رقم هاتف صحيح مكون من أرقام صالحة (مثال: 010XXXXXXXX أو +2010XXXXXXXX).';
  }

  const trimmedNationality = data.nationality.trim();
  if (!trimmedNationality) {
    errors.nationality = 'يرجى تحديد الجنسية.';
  } else if (trimmedNationality.length > 80) {
    errors.nationality = 'يرجى كتابة الجنسية بشكل مختصر وصحيح.';
  }

  const trimmedProfession = data.currentProfession.trim();
  if (!trimmedProfession) {
    errors.currentProfession = 'يرجى إدخال المهنة الحالية أو المسمى الوظيفي.';
  } else if (trimmedProfession.length < 2 || trimmedProfession.length > 120) {
    errors.currentProfession = 'يرجى إدخال المهنة الحالية بشكل واضح.';
  }

  if (!data.expectedTravelDate) {
    errors.expectedTravelDate = 'يرجى اختيار تاريخ السفر المتوقع.';
  } else if (!validateFutureOrTodayDate(data.expectedTravelDate, referenceTodayIso)) {
    errors.expectedTravelDate = 'يجب أن يكون تاريخ السفر المتوقع تاريخاً صحيحاً وألا يكون في الماضي.';
  }

  if (
    !Number.isInteger(data.applicantsCount) ||
    data.applicantsCount < VISA_SERVICE_CONFIG.minApplicants ||
    data.applicantsCount > VISA_SERVICE_CONFIG.maxApplicantsPerSubmission
  ) {
    errors.applicantsCount = `يجب أن يتراوح عدد المتقدمين بين ${VISA_SERVICE_CONFIG.minApplicants} و ${VISA_SERVICE_CONFIG.maxApplicantsPerSubmission}.`;
  }

  const passportCheck = validateUploadedFile(
    data.passportDocument
      ? {
          name: data.passportDocument.fileName,
          size: data.passportDocument.fileSize,
          type: data.passportDocument.mimeType,
        }
      : null,
    'passport'
  );
  if (!passportCheck.valid) {
    errors.passportDocument = passportCheck.errorMessage;
  }

  const photoCheck = validateUploadedFile(
    data.personalPhoto
      ? {
          name: data.personalPhoto.fileName,
          size: data.personalPhoto.fileSize,
          type: data.personalPhoto.mimeType,
        }
      : null,
    'personal_photo'
  );
  if (!photoCheck.valid) {
    errors.personalPhoto = photoCheck.errorMessage;
  }

  if (!data.bankStatementStatus) {
    errors.bankStatementStatus = 'يرجى اختيار الحالة التوضيحية لكشف الحساب البنكي (لا يلزم إرفاق ملف).';
  }

  if (data.explanatoryNotes.trim().length > 2000) {
    errors.explanatoryNotes = 'الملاحظات التوضيحية لا يجب أن تتجاوز 2000 حرف.';
  }

  if (!data.dataUsageConsent) {
    errors.dataUsageConsent = 'يجب الموافقة على استخدام البيانات لغرض مراجعة وتجهيز طلب التأشيرة.';
  }

  return errors;
}
