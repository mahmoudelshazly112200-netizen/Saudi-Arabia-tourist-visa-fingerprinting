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
      <label htmlFor={id} className="block text-sm sm:text-base font-bold text-slate-900 mb-2">
        {label}
        {requiredMark && <span className="text-red-600 mr-1" aria-hidden="true">*</span>}
      </label>
      <input
        id={id}
        dir={inputDir}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={[
          'w-full min-h-[48px] px-4 py-3 rounded-xl border bg-white text-base text-slate-900 placeholder:text-slate-400',
          'transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#161A8D]/20 focus:border-[#161A8D]',
          error ? 'border-red-500 bg-red-50/30' : 'border-slate-300 hover:border-slate-400',
          inputDir === 'ltr' ? 'text-right font-en' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      />
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs sm:text-sm text-slate-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-red-700">
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
      <label htmlFor={id} className="block text-sm sm:text-base font-bold text-slate-900 mb-2">
        {label}
        {requiredMark && <span className="text-red-600 mr-1" aria-hidden="true">*</span>}
      </label>
      <textarea
        id={id}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={[
          'w-full px-4 py-3 rounded-xl border bg-white text-base text-slate-900 placeholder:text-slate-400',
          'transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#161A8D]/20 focus:border-[#161A8D]',
          error ? 'border-red-500 bg-red-50/30' : 'border-slate-300 hover:border-slate-400',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      />
      {hint && !error && <p className="mt-1.5 text-xs sm:text-sm text-slate-500">{hint}</p>}
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-red-700">
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
      <span className="block text-sm sm:text-base font-bold text-slate-900 mb-2">
        عدد المتقدمين
        <span className="text-red-600 mr-1" aria-hidden="true">*</span>
      </span>
      <div className="flex items-center justify-between gap-3 p-2 rounded-xl border border-slate-300 bg-white min-h-[52px]">
        <button
          type="button"
          onClick={onIncrement}
          disabled={!canIncrement}
          aria-label="زيادة عدد المتقدمين"
          className="w-11 h-11 rounded-lg bg-[#EEF7FF] text-[#161A8D] hover:bg-[#C5E5FF] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="flex flex-col items-center justify-center text-center px-2">
          <span
            data-testid="applicants-count-value"
            className="text-lg font-extrabold text-[#161A8D] tabular-nums leading-tight"
          >
            {value}
          </span>
          <span className="text-xs text-slate-500">{formatApplicantsLabel(value)}</span>
        </div>

        <button
          type="button"
          onClick={onDecrement}
          disabled={!canDecrement}
          aria-label="تقليل عدد المتقدمين"
          className="w-11 h-11 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer shrink-0"
        >
          <Minus className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-red-700">
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
  document: UploadedDocumentMeta | null;
  error?: string;
  onSelectFile: (file: File | null) => void;
}

export function FileUploadField({
  label,
  description,
  accept,
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
    // Reset input value so selecting the same file after removal still triggers onChange
    e.target.value = '';
  };

  const triggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <label htmlFor={inputId} className="block text-sm sm:text-base font-bold text-slate-900 mb-1.5">
        {label}
        <span className="text-red-600 mr-1" aria-hidden="true">*</span>
      </label>
      <p className="text-xs sm:text-sm text-slate-600 mb-2.5">{description}</p>

      <input
        ref={fileInputRef}
        id={inputId}
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
            'w-full min-h-[116px] p-5 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center transition-colors cursor-pointer',
            error
              ? 'border-red-400 bg-red-50/40 hover:bg-red-50/70'
              : 'border-[#161A8D]/25 bg-[#F7F9FC] hover:border-[#161A8D] hover:bg-[#EEF7FF]/60',
          ].join(' ')}
        >
          <div className="w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[#161A8D] mb-2.5">
            <Upload className="w-5 h-5" aria-hidden="true" />
          </div>
          <span className="text-sm sm:text-base font-bold text-[#161A8D]">
            اضغط لاختيار الملف من جهازك أو الهاتف
          </span>
          <span className="text-xs text-slate-500 mt-1">
            الحد الأقصى لحجم الملف: 10 ميجابايت
          </span>
        </button>
      ) : (
        <div className="p-4 rounded-xl border border-[#C5E5FF] bg-[#EEF7FF]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0 w-full sm:w-auto">
            {document.previewUrl ? (
              <img
                src={document.previewUrl}
                alt={`معاينة ${label}`}
                className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0 bg-white"
              />
            ) : (
              <div className="w-14 h-14 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#161A8D] shrink-0">
                {document.mimeType === 'application/pdf' ? (
                  <FileText className="w-6 h-6" aria-hidden="true" />
                ) : (
                  <ImageIcon className="w-6 h-6" aria-hidden="true" />
                )}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-900 truncate font-en text-right" dir="ltr">
                {document.fileName}
              </p>
              <p className="text-xs text-slate-600 mt-0.5 tabular-nums">
                {formatFileSize(document.fileSize)} · تم اختيار الملف بنجاح
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={triggerFilePicker}
              aria-label={`استبدال ${label}`}
              className="flex-1 sm:flex-initial min-h-[44px] px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-xs sm:text-sm font-semibold text-slate-800 hover:border-[#161A8D] hover:text-[#161A8D] inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>استبدال</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectFile(null)}
              aria-label={`حذف ${label}`}
              className="flex-1 sm:flex-initial min-h-[44px] px-3.5 py-2 rounded-lg bg-white border border-red-200 text-xs sm:text-sm font-semibold text-red-700 hover:bg-red-50 inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>حذف</span>
            </button>
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-2 flex items-center gap-1.5 text-sm font-medium text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
