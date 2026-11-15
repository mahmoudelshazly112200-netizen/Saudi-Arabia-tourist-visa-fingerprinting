import { VISA_SERVICE_CONFIG } from '../constants/brand';
import { BankStatementStatus } from '../types/visa';
import { ApplicationRecordStatus, DocumentVerificationStatus } from '../types/admin';

export function formatEgpAmount(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateTotalVisaPrice(applicantsCount: number): number {
  const safeCount = Math.max(
    VISA_SERVICE_CONFIG.minApplicants,
    Math.min(VISA_SERVICE_CONFIG.maxApplicantsPerSubmission, Math.floor(applicantsCount || 1))
  );
  return safeCount * VISA_SERVICE_CONFIG.pricePerPersonEgp;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`;
  }
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

export function formatApplicantsLabel(count: number): string {
  if (count === 1) return 'فرد واحد';
  if (count === 2) return 'فردان (2)';
  if (count >= 3 && count <= 10) return `${count} أفراد`;
  return `${count} فرداً`;
}

export function getBankStatementStatusLabel(status: BankStatementStatus | ''): string {
  switch (status) {
    case BankStatementStatus.AVAILABLE_IF_REQUESTED:
      return 'متوفر لتقديمه في موعد البصمة';
    case BankStatementStatus.NOT_AVAILABLE_CURRENTLY:
      return 'جاري تجهيزه قبل موعد البصمة';
    case BankStatementStatus.NEED_CONSULTATION:
      return 'بحاجة إلى استشارة فريق نشكا';
    default:
      return 'غير محدد';
  }
}

export function getApplicationStatusLabel(status: ApplicationRecordStatus | string): string {
  switch (status) {
    case ApplicationRecordStatus.NEW_SUBMISSION:
      return 'طلب جديد';
    case ApplicationRecordStatus.DOCUMENTS_UNDER_REVIEW:
      return 'قيد مراجعة المستندات';
    case ApplicationRecordStatus.ADDITIONAL_INFO_NEEDED:
      return 'مطلوب استكمال بيانات';
    case ApplicationRecordStatus.READY_FOR_PROCESSING:
      return 'جاهز للتنفيذ';
    case ApplicationRecordStatus.VISA_ISSUED:
      return 'صدرت التأشيرة';
    case ApplicationRecordStatus.REJECTED:
      return 'مرفوض / مغلق';
    default:
      return 'قيد المعالجة';
  }
}

export function getDocumentStatusLabel(status: DocumentVerificationStatus | string): string {
  switch (status) {
    case DocumentVerificationStatus.PENDING:
      return 'بانتظار الفحص';
    case DocumentVerificationStatus.APPROVED:
      return 'مقبول';
    case DocumentVerificationStatus.REPLACEMENT_REQUIRED:
      return 'يلزم استبدال الملف';
    default:
      return 'بانتظار الفحص';
  }
}
