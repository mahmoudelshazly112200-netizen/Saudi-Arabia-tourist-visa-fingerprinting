export enum BankStatementStatus {
  AVAILABLE_IF_REQUESTED = 'available_if_requested',
  NOT_AVAILABLE_CURRENTLY = 'not_available_currently',
  NEED_CONSULTATION = 'need_consultation',
}

export interface UploadedDocumentMeta {
  file: File;
  fileName: string;
  fileSize: number;
  mimeType: string;
  previewUrl: string | null;
}

export interface VisaApplicationFormData {
  fullName: string;
  phoneNumber: string;
  nationality: string;
  currentProfession: string;
  expectedTravelDate: string;
  applicantsCount: number;
  passportDocument: UploadedDocumentMeta | null;
  personalPhoto: UploadedDocumentMeta | null;
  bankStatementStatus: BankStatementStatus | '';
  explanatoryNotes: string;
  dataUsageConsent: boolean;
}

export type FormValidationErrors = Partial<Record<keyof VisaApplicationFormData, string>>;

export enum SubmissionOutcomeStatus {
  IDLE = 'idle',
  SUBMITTING = 'submitting',
  SUBMITTED_CONFIRMED = 'submitted_confirmed',
  ERROR = 'error',
}

export interface SubmissionOutcome {
  status: SubmissionOutcomeStatus;
  message: string;
  timestamp?: string;
  confirmedReferenceId?: string;
  calculatedTotalEgp?: number;
}

export interface VisaBenefitCardItem {
  id: string;
  numberLabel: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  featured?: boolean;
  imagePosition?: 'top' | 'center';
}

export interface JourneyDestinationCardItem {
  id: string;
  city: string;
  landmark: string;
  imageUrl: string;
}

export type FaqCategory =
  | 'all'
  | 'cost_fees'
  | 'documents_biometrics'
  | 'processing_rules'
  | 'application_tracking';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: Exclude<FaqCategory, 'all'>;
}

export interface StepItem {
  stepNumber: string;
  title: string;
  description: string;
}

export interface TrackingResultData {
  referenceId: string;
  fullName: string;
  applicantsCount: number;
  totalAmountEgp: number;
  expectedTravelDate: string;
  status: string;
  createdAt: string;
  documents: {
    type: 'passport' | 'personal_photo';
    labelAr: string;
    verificationStatus: string;
  }[];
}
