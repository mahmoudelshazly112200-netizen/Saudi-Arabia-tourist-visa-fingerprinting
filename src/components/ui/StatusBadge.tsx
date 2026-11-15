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
      colorClass: 'text-[#161A8D] bg-[#EEF7FF] border-[#C5E5FF]',
      Icon: Clock,
    },
    [ApplicationRecordStatus.DOCUMENTS_UNDER_REVIEW]: {
      colorClass: 'text-amber-800 bg-amber-50 border-amber-200',
      Icon: FileSearch,
    },
    [ApplicationRecordStatus.ADDITIONAL_INFO_NEEDED]: {
      colorClass: 'text-orange-800 bg-orange-50 border-orange-200',
      Icon: AlertCircle,
    },
    [ApplicationRecordStatus.READY_FOR_PROCESSING]: {
      colorClass: 'text-indigo-800 bg-indigo-50 border-indigo-200',
      Icon: Send,
    },
    [ApplicationRecordStatus.VISA_ISSUED]: {
      colorClass: 'text-emerald-800 bg-emerald-50 border-emerald-200',
      Icon: CheckCircle2,
    },
    [ApplicationRecordStatus.REJECTED]: {
      colorClass: 'text-red-800 bg-red-50 border-red-200',
      Icon: XCircle,
    },
  };

  const { colorClass, Icon } = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-semibold whitespace-nowrap ${colorClass}`}
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
      colorClass: 'text-slate-700 bg-slate-100 border-slate-200',
      Icon: Clock,
    },
    [DocumentVerificationStatus.APPROVED]: {
      colorClass: 'text-emerald-800 bg-emerald-50 border-emerald-200',
      Icon: CheckCircle2,
    },
    [DocumentVerificationStatus.REPLACEMENT_REQUIRED]: {
      colorClass: 'text-red-800 bg-red-50 border-red-200',
      Icon: AlertCircle,
    },
  };

  const { colorClass, Icon } = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-semibold whitespace-nowrap ${colorClass}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>{getDocumentStatusLabel(status)}</span>
    </span>
  );
}
