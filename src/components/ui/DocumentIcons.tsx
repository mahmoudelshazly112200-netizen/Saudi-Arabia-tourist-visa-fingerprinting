import React from 'react';

export interface DocumentIconProps {
  className?: string;
  strokeWidth?: number | string;
  'aria-hidden'?: boolean | 'true' | 'false';
}

/**
 * Bespoke single-stroke Passport booklet icon
 * Depicts an official passport cover with spine seam, globe emblem, and bottom ID lines.
 */
export function PassportDocumentIcon({
  className = 'w-6 h-6',
  strokeWidth = 1.85,
  ...props
}: DocumentIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={props['aria-hidden'] ?? true}
    >
      {/* Passport cover & vertical spine */}
      <rect x="4.5" y="2.75" width="15" height="18.5" rx="2.25" />
      <line x1="8" y1="2.75" x2="8" y2="21.25" />
      {/* Official globe emblem on cover */}
      <circle cx="13.75" cy="9.75" r="3" />
      <ellipse cx="13.75" cy="9.75" rx="1.35" ry="3" />
      <line x1="10.85" y1="9.75" x2="16.65" y2="9.75" />
      {/* Cover title & biometric chip lines */}
      <line x1="11.25" y1="15.75" x2="16.25" y2="15.75" />
      <line x1="12.25" y1="18" x2="15.25" y2="18" />
    </svg>
  );
}

/**
 * Bespoke single-stroke Biometric Personal Photo icon
 * Depicts an official portrait card with viewfinder framing corners and centered portrait silhouette.
 */
export function PersonalPhotoIcon({
  className = 'w-6 h-6',
  strokeWidth = 1.85,
  ...props
}: DocumentIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={props['aria-hidden'] ?? true}
    >
      {/* Official 4x6 portrait border */}
      <rect x="4.25" y="2.75" width="15.5" height="18.5" rx="2.25" />
      {/* Top corner biometric framing guides */}
      <path d="M7.25 7.25V5.75h1.5" />
      <path d="M16.75 7.25V5.75h-1.5" />
      {/* Centered official portrait head & shoulders */}
      <circle cx="12" cy="10.25" r="2.65" />
      <path d="M7.5 18.25c.65-2.3 2.4-3.55 4.5-3.55s3.85 1.25 4.5 3.55" />
    </svg>
  );
}

/**
 * Bespoke single-stroke Bank Statement document icon
 * Depicts a financial statement page with folded corner, institutional header, and tabular ledger rows.
 */
export function BankStatementIcon({
  className = 'w-6 h-6',
  strokeWidth = 1.85,
  ...props
}: DocumentIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={props['aria-hidden'] ?? true}
    >
      {/* Document page with folded top corner */}
      <path d="M6 2.75h8.75L19 7v12.75a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5V4.25A1.5 1.5 0 0 1 6 2.75Z" />
      <path d="M14.75 2.75V7H19" />
      {/* Statement header mark */}
      <path d="M7.75 7.25h4" />
      {/* Structured financial ledger rows */}
      <line x1="7.75" y1="11.25" x2="12" y2="11.25" />
      <line x1="14.25" y1="11.25" x2="16" y2="11.25" />
      <line x1="7.75" y1="14.5" x2="11.25" y2="14.5" />
      <line x1="14.25" y1="14.5" x2="16" y2="14.5" />
      {/* Total balance summary line */}
      <line x1="7.75" y1="17.75" x2="16" y2="17.75" />
    </svg>
  );
}
