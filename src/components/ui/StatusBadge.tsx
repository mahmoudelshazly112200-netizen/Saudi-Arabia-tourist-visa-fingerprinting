import React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileSearch,
  Send,
  XCircle,
} from 'lucide-react';
import { ApplicationRecordStatus, DocumentVerificationStatus } from '../../types/admin';
import { getApplicationStatusLabel, getDocumentStatusLabel } from '../../utils/formatters';

interface ApplicationStatusBadgeProps {
  status: ApplicationRecordStatus;
}

export function ApplicationStatusBadge({ status }: ApplicationStatusBadgeProps) {
  const config: Record<
    ApplicationRecordStatus,
    { colorClass: string; Icon: React.ComponentType<{ className?: string }> }
  > = {
    [ApplicationRecordStatus.NEW_SUBMISSION]: {
      colorClass: 'text-[#2878C7] bg-[#EAF4FF] border-[#2878C7]/30',
      Icon: Clock,
    },
    [ApplicationRecordStatus.DOCUMENTS_UNDER_REVIEW]: {
      colorClass: 'text-[#E99A28] bg-[#FFF5E5] border-[#E99A28]/35',
      Icon: FileSearch,
    },
    [ApplicationRecordStatus.ADDITIONAL_INFO_NEEDED]: {
      colorClass: 'text-[#E99A28] bg-[#FFF5E5] border-[#E99A28]/45',
      Icon: AlertCircle,
    },
    [ApplicationRecordStatus.READY_FOR_PROCESSING]: {
      colorClass: 'text-[#161A8D] bg-[#EFF4FF] border-[#C5E5FF]',
      Icon: Send,
    },
    [ApplicationRecordStatus.VISA_ISSUED]: {
      colorClass: 'text-[#16A36A] bg-[#E9F8F0] border-[#16A36A]/35',
      Icon: CheckCircle2,
    },
    [ApplicationRecordStatus.REJECTED]: {
      colorClass: 'text-[#DC3545] bg-[#FDECEE] border-[#DC3545]/35',
      Icon: XCircle,
    },
  };

  const { colorClass, Icon } = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-bold whitespace-nowrap ${colorClass}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>{getApplicationStatusLabel(status)}</span>
    </span>
  );
}

interface DocumentStatusBadgeProps {
  status: DocumentVerificationStatus;
}

export function DocumentStatusBadge({ status }: DocumentStatusBadgeProps) {
  const config: Record<
    DocumentVerificationStatus,
    { colorClass: string; Icon: React.ComponentType<{ className?: string }> }
  > = {
    [DocumentVerificationStatus.PENDING]: {
      colorClass: 'text-[#2878C7] bg-[#EAF4FF] border-[#2878C7]/30',
      Icon: Clock,
    },
    [DocumentVerificationStatus.APPROVED]: {
      colorClass: 'text-[#16A36A] bg-[#E9F8F0] border-[#16A36A]/35',
      Icon: CheckCircle2,
    },
    [DocumentVerificationStatus.REPLACEMENT_REQUIRED]: {
      colorClass: 'text-[#DC3545] bg-[#FDECEE] border-[#DC3545]/35',
      Icon: AlertCircle,
    },
  };

  const { colorClass, Icon } = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-bold whitespace-nowrap ${colorClass}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>{getDocumentStatusLabel(status)}</span>
    </span>
  );
}
