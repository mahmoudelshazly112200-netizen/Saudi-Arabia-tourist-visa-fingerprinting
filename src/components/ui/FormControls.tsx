import React, { useId, useRef } from 'react';
import {
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Minus,
  Plus,
  RefreshCw,
  Trash2,
  Upload,
} from 'lucide-react';
import { UploadedDocumentMeta } from '../../types/visa';
import { formatApplicantsLabel, formatFileSize } from '../../utils/formatters';
import { VISA_SERVICE_CONFIG } from '../../constants/brand';

interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  hint?: string;
  error?: string;
  requiredMark?: boolean;
  inputDir?: 'rtl' | 'ltr';
}

export function TextField({
  label,
  hint,
  error,
  requiredMark = false,
  inputDir,
  className = '',
  ...rest
}: TextFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm sm:text-base font-bold text-[#17213B] mb-2">
        {label}
        {requiredMark && <span className="text-[#DC3545] mr-1" aria-hidden="true">*</span>}
      </label>
      <input
        id={id}
        dir={inputDir}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={[
          'w-full min-h-[48px] px-4 py-3 rounded-xl border bg-white text-base text-[#17213B] placeholder:text-[#68758A]/70',
          'transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#171C91]/20 focus:border-[#171C91]',
          error ? 'border-[#DC3545] bg-[#FDECEE]/45' : 'border-[#E6ECF4] hover:border-[#5B8EE6]',
          inputDir === 'ltr' ? 'text-right font-en' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      />
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs sm:text-sm text-[#68758A]">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-[#DC3545]">
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

interface TextAreaFieldProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label: string;
  hint?: string;
  error?: string;
  requiredMark?: boolean;
}

export function TextAreaField({
  label,
  hint,
  error,
  requiredMark = false,
  className = '',
  rows = 4,
  ...rest
}: TextAreaFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm sm:text-base font-bold text-[#17213B] mb-2">
        {label}
        {requiredMark && <span className="text-[#DC3545] mr-1" aria-hidden="true">*</span>}
      </label>
      <textarea
        id={id}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={[
          'w-full px-4 py-3 rounded-xl border bg-white text-base text-[#17213B] placeholder:text-[#68758A]/70',
          'transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#171C91]/20 focus:border-[#171C91]',
          error ? 'border-[#DC3545] bg-[#FDECEE]/45' : 'border-[#E6ECF4] hover:border-[#5B8EE6]',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      />
      {hint && !error && <p className="mt-1.5 text-xs sm:text-sm text-[#68758A]">{hint}</p>}
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-[#DC3545]">
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

interface ApplicantCounterProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  error?: string;
}

export function ApplicantCounter({
  value,
  onIncrement,
  onDecrement,
  error,
}: ApplicantCounterProps) {
  const canDecrement = value > VISA_SERVICE_CONFIG.minApplicants;
  const canIncrement = value < VISA_SERVICE_CONFIG.maxApplicantsPerSubmission;

  return (
    <div className="w-full">
      <span className="block text-sm sm:text-base font-bold text-[#17213B] mb-2">
        عدد المتقدمين
        <span className="text-[#DC3545] mr-1" aria-hidden="true">*</span>
      </span>
      <div className="flex items-center justify-between gap-3 p-1.5 rounded-xl border border-[#E6ECF4] bg-white min-h-[52px]">
        <button
          type="button"
          onClick={onIncrement}
          disabled={!canIncrement}
          aria-label="زيادة عدد المتقدمين"
          className="w-12 h-12 rounded-lg bg-[#EFF4FF] text-[#171C91] hover:bg-[#C5E5FF] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="flex flex-col items-center justify-center text-center px-2">
          <span
            data-testid="applicants-count-value"
            className="text-lg font-extrabold text-[#171C91] tabular-nums leading-tight"
          >
            {value}
          </span>
          <span className="text-xs text-[#68758A]">{formatApplicantsLabel(value)}</span>
        </div>

        <button
          type="button"
          onClick={onDecrement}
          disabled={!canDecrement}
          aria-label="تقليل عدد المتقدمين"
          className="w-12 h-12 rounded-lg bg-[#F3F7FC] text-[#17213B] hover:bg-[#E6ECF4] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer shrink-0"
        >
          <Minus className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-[#DC3545]">
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

interface FileUploadFieldProps {
  label: string;
  description: string;
  accept: string;
  name?: string;
  document: UploadedDocumentMeta | null;
  error?: string;
  onSelectFile: (file: File | null) => void;
}

export function FileUploadField({
  label,
  description,
  accept,
  name,
  document,
  error,
  onSelectFile,
}: FileUploadFieldProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    if (selected) {
      onSelectFile(selected);
    }
    e.target.value = '';
  };

  const triggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full h-full flex flex-col rounded-2xl border border-[#E6ECF4] bg-[#F3F7FC] p-4 sm:p-5">
      <label htmlFor={inputId} className="block text-sm sm:text-base font-bold text-[#17213B] mb-1">
        {label}
        <span className="text-[#DC3545] mr-1" aria-hidden="true">*</span>
      </label>
      <p className="text-xs sm:text-sm text-[#68758A] leading-relaxed mb-3.5">{description}</p>

      <input
        ref={fileInputRef}
        id={inputId}
        name={name}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="sr-only"
      />

      {!document ? (
        <button
          type="button"
          onClick={triggerFilePicker}
          className={[
            'w-full flex-1 min-h-[124px] p-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center transition-colors cursor-pointer bg-white',
            error
              ? 'border-[#DC3545] bg-[#FDECEE]/50 hover:bg-[#FDECEE]/80'
              : 'border-[#004AAD]/25 hover:border-[#171C91] hover:bg-[#EFF4FF]',
          ].join(' ')}
        >
          <div className="w-11 h-11 rounded-full bg-[#EAF4FF] border border-[#C5E5FF] flex items-center justify-center text-[#004AAD] mb-2">
            <Upload className="w-5 h-5" aria-hidden="true" />
          </div>
          <span className="text-sm sm:text-base font-bold text-[#004AAD]">
            اضغط لاختيار الملف من الجهاز
          </span>
        </button>
      ) : (
        <div className="flex-1 p-3.5 sm:p-4 rounded-xl border border-[#C5E5FF] bg-white flex flex-col justify-between gap-3.5">
          <div className="flex items-center gap-3 min-w-0 w-full">
            {document.previewUrl ? (
              <img
                src={document.previewUrl}
                alt={`معاينة ${label}`}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover border border-[#E6ECF4] shrink-0 bg-white"
              />
            ) : (
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-[#EAF4FF] border border-[#C5E5FF] flex items-center justify-center text-[#171C91] shrink-0">
                {document.mimeType === 'application/pdf' ? (
                  <FileText className="w-6 h-6" aria-hidden="true" />
                ) : (
                  <ImageIcon className="w-6 h-6" aria-hidden="true" />
                )}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[#17213B] truncate font-en text-right" dir="ltr">
                {document.fileName}
              </p>
              <p className="text-xs text-[#16A36A] font-semibold mt-0.5 tabular-nums">
                {formatFileSize(document.fileSize)} · جاهز للإرسال
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full">
            <button
              type="button"
              onClick={triggerFilePicker}
              aria-label={`استبدال ${label}`}
              className="flex-1 min-h-[48px] px-3 py-2 rounded-lg bg-[#EAF4FF] border border-[#C5E5FF] text-xs sm:text-sm font-bold text-[#004AAD] hover:bg-[#C5E5FF]/50 inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>استبدال</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectFile(null)}
              aria-label={`حذف ${label}`}
              className="flex-1 min-h-[48px] px-3 py-2 rounded-lg bg-[#FDECEE] border border-[#DC3545]/25 text-xs sm:text-sm font-bold text-[#DC3545] hover:bg-[#DC3545]/10 inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>حذف</span>
            </button>
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-2.5 flex items-center gap-1.5 text-sm font-medium text-[#DC3545]">
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
