import React from 'react';
import { NashkaIconComponent } from './NashkaIcon';

type IconProps = React.ComponentProps<NashkaIconComponent>;

/**
 * Unified NASHKA TOURISM Architectural Icon Family
 * Single coordinate space (24x24), uniform stroke weight (1.8),
 * uniting Royal Blue (currentColor / #171C91) with refined Gold (#D5A43B) focal accents.
 */

/* --- 1. Why Nashka Feature Icons --- */

export function FileAuditGlyph({ className = 'w-6 h-6', strokeWidth = 1.8, ...props }: IconProps) {
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
      <path d="M14 2.75H7a2 2 0 0 0-2 2v14.5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7.75L14 2.75Z" />
      <path d="M14 2.75v5h5" />
      <path d="M9 14.25l2 2 4.25-4.5" stroke="var(--color-gold, #D5A43B)" />
      <line x1="9" y1="10" x2="11.5" y2="10" />
    </svg>
  );
}

export function RouteCompassGlyph({ className = 'w-6 h-6', strokeWidth = 1.8, ...props }: IconProps) {
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
      <circle cx="12" cy="12" r="9.25" />
      <polygon
        points="15.5 8.5 13.75 13.75 8.5 15.5 10.25 10.25 15.5 8.5"
        stroke="var(--color-gold, #D5A43B)"
      />
      <circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TimelinePulseGlyph({ className = 'w-6 h-6', strokeWidth = 1.8, ...props }: IconProps) {
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
      <rect x="3" y="4.5" width="18" height="15" rx="3" />
      <path d="M6.5 13h2.75l1.75-4 2.25 6 1.75-2h2.5" stroke="var(--color-gold, #D5A43B)" />
    </svg>
  );
}

export function ConciergeSupportGlyph({ className = 'w-6 h-6', strokeWidth = 1.8, ...props }: IconProps) {
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
      <path d="M4.5 14v-2a7.5 7.5 0 0 1 15 0v2" />
      <rect x="3" y="13" width="3.5" height="5.5" rx="1.5" />
      <rect x="17.5" y="13" width="3.5" height="5.5" rx="1.5" />
      <path d="M19.5 18.5a3 3 0 0 1-3 3H12.5" stroke="var(--color-gold, #D5A43B)" />
    </svg>
  );
}

/* --- 2. Visa Specification Icons --- */

export function ValidityCalendarGlyph({ className = 'w-6 h-6', strokeWidth = 1.8, ...props }: IconProps) {
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
      <rect x="3.5" y="4.75" width="17" height="16" rx="2.75" />
      <line x1="8" y1="2.75" x2="8" y2="6.25" />
      <line x1="16" y1="2.75" x2="16" y2="6.25" />
      <line x1="3.5" y1="9.75" x2="20.5" y2="9.75" />
      <path d="M9.25 14.75l2 2 3.75-3.75" stroke="var(--color-gold, #D5A43B)" />
    </svg>
  );
}

export function StayDurationGlyph({ className = 'w-6 h-6', strokeWidth = 1.8, ...props }: IconProps) {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" stroke="var(--color-gold, #D5A43B)" />
    </svg>
  );
}

export function MultiEntryGlyph({ className = 'w-6 h-6', strokeWidth = 1.8, ...props }: IconProps) {
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
      <path d="M14.5 4h3.75A2.25 2.25 0 0 1 20.5 6.25v11.5A2.25 2.25 0 0 1 18.25 20H14.5" />
      <path d="M10.5 8l4 4-4 4" stroke="var(--color-gold, #D5A43B)" />
      <line x1="3.5" y1="12" x2="14.5" y2="12" stroke="var(--color-gold, #D5A43B)" />
    </svg>
  );
}

export function IssuanceSpeedGlyph({ className = 'w-6 h-6', strokeWidth = 1.8, ...props }: IconProps) {
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
      <line x1="9.5" y1="2.75" x2="14.5" y2="2.75" />
      <circle cx="12" cy="13.5" r="7.75" />
      <path d="M12 13.5l3.25-3.25" stroke="var(--color-gold, #D5A43B)" />
      <path d="M17.5 6.75l1.5-1.5" />
    </svg>
  );
}

/* --- 3. Application Process Stage Icons --- */

export function SubmitRequestGlyph({ className = 'w-6 h-6', strokeWidth = 1.8, ...props }: IconProps) {
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
      <path d="M21 3.75 10.5 14.25" stroke="var(--color-gold, #D5A43B)" />
      <path d="M21 3.75 14.5 20.5l-3.75-6.25L4.5 10.5 21 3.75Z" />
    </svg>
  );
}

export function ReviewProcessGlyph({ className = 'w-6 h-6', strokeWidth = 1.8, ...props }: IconProps) {
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
      <rect x="8.5" y="2.75" width="7" height="3.25" rx="1.25" stroke="var(--color-gold, #D5A43B)" />
      <path d="M8.5 4.25H6.5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-13a2 2 0 0 0-2-2h-2" />
      <path d="M9.25 13.75l2 2 3.75-4" stroke="var(--color-gold, #D5A43B)" />
    </svg>
  );
}

export function BiometricGateGlyph({ className = 'w-6 h-6', strokeWidth = 1.8, ...props }: IconProps) {
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
      <path d="M12 10.25a2.25 2.25 0 0 0-2.25 2.25c0 1.8-.35 3.6-1 5.25" />
      <path d="M15.25 12.5c0 2.15-.45 4.35-1.25 6.25" stroke="var(--color-gold, #D5A43B)" />
      <path d="M6.5 16.5A6.5 6.5 0 0 1 18.25 11" />
      <path d="M4.25 12.25A8.25 8.25 0 0 1 19.75 9" stroke="var(--color-gold, #D5A43B)" />
      <path d="M12 13.75v3.75" />
    </svg>
  );
}

export function VisaIssuedGlyph({ className = 'w-6 h-6', strokeWidth = 1.8, ...props }: IconProps) {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M8.75 12.25l2.25 2.25 4.5-4.75" stroke="var(--color-gold, #D5A43B)" />
    </svg>
  );
}

/* --- 4. Trust & Notice Icons --- */

export function TrustShieldGlyph({ className = 'w-6 h-6', strokeWidth = 1.8, ...props }: IconProps) {
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
      <path d="M12 2.75 4.75 6v5.75c0 4.85 3.05 9 7.25 10.25 4.2-1.25 7.25-5.4 7.25-10.25V6L12 2.75Z" />
      <path d="M9.25 12.25l2 2 3.75-4" stroke="var(--color-gold, #D5A43B)" />
    </svg>
  );
}

export function DocumentNoteGlyph({ className = 'w-6 h-6', strokeWidth = 1.8, ...props }: IconProps) {
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
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="11.25" x2="12" y2="16.25" />
      <circle cx="12" cy="8.25" r="0.9" fill="var(--color-gold, #D5A43B)" stroke="none" />
    </svg>
  );
}
