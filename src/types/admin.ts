import { BankStatementStatus } from './visa';

export enum ApplicationRecordStatus {
  NEW_SUBMISSION = 'new_submission',
  DOCUMENTS_UNDER_REVIEW = 'documents_under_review',
  ADDITIONAL_INFO_NEEDED = 'additional_info_needed',
  READY_FOR_PROCESSING = 'ready_for_processing',
  VISA_ISSUED = 'visa_issued',
  REJECTED = 'rejected',
}

export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  VISA_OPERATIONS_MANAGER = 'visa_operations_manager',
  DOCUMENT_REVIEWER = 'document_reviewer',
  CUSTOMER_SUPPORT = 'customer_support',
}

export enum DocumentVerificationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REPLACEMENT_REQUIRED = 'replacement_required',
}

export interface AdminDocumentItem {
  id: string;
  type: 'passport' | 'personal_photo';
  labelAr: string;
  fileName: string;
  storedFileName?: string;
  fileSizeBytes: number;
  mimeType: string;
  verificationStatus: DocumentVerificationStatus;
}

export interface AdminApplicationRecord {
  id: string;
  referenceId: string;
  trackingKey?: string;
  customerId: string;
  fullName: string;
  phoneNumber: string;
  nationality: string;
  currentProfession: string;
  expectedTravelDate: string;
  applicantsCount: number;
  totalAmountEgp: number;
  bankStatementStatus: BankStatementStatus;
  explanatoryNotes: string;
  status: ApplicationRecordStatus;
  documents: AdminDocumentItem[];
  createdAt: string;
  source: 'backend_persisted' | 'cloud_firestore';
}

export interface AdminCustomerSummary {
  id: string;
  fullName: string;
  phoneNumber: string;
  nationality: string;
  currentProfession: string;
  applicationsCount: number;
  lastActivityAt: string;
}

export interface RolePermissionMatrix {
  role: AdminRole;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  permissions: {
    viewApplications: boolean;
    updateApplicationStatus: boolean;
    reviewDocuments: boolean;
    manageCustomers: boolean;
    managePayments: boolean;
    manageUsersAndRoles: boolean;
  };
}
