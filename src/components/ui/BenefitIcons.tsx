import React from 'react';

export interface BenefitIconProps {
  className?: string;
  strokeWidth?: number | string;
  'aria-hidden'?: boolean | 'true' | 'false';
}

/**
 * 1. أداء العمرة — 3D Al-Kaaba with Gold Kiswa belt, twin minarets, and Haram arches
 */
export function UmrahKaabaIcon({
  className = 'w-12 h-12',
  ...props
}: BenefitIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={props['aria-hidden'] ?? true}
    >
      {/* Left Haram Colonnade & Arches */}
      <path d="M3.5 39.5 Q11 36.8 18 35.8" strokeWidth="2.2" />
      <path d="M3.5 49 H15.5" strokeWidth="2.2" />
      <path
        d="M5.5 48.8 V44.2 A2.6 2.6 0 0 1 10.7 44.2 V48.8 Z"
        fill="currentColor"
        stroke="none"
      />
      <path
        d="M12.6 48.8 V43.5 A2.2 2.2 0 0 1 17 43.5 V48.8 Z"
        fill="currentColor"
        stroke="none"
      />

      {/* Right Haram Colonnade & Arches */}
      <path d="M46 35.8 Q53 36.8 60.5 39.5" strokeWidth="2.2" />
      <path d="M48.5 49 H60.5" strokeWidth="2.2" />
      <path
        d="M47 48.8 V43.5 A2.2 2.2 0 0 1 51.4 43.5 V48.8 Z"
        fill="currentColor"
        stroke="none"
      />
      <path
        d="M53.3 48.8 V44.2 A2.6 2.6 0 0 1 58.5 44.2 V48.8 Z"
        fill="currentColor"
        stroke="none"
      />

      {/* Left Minaret */}
      <line x1="16.5" y1="8.5" x2="16.5" y2="12.2" strokeWidth="2" />
      <circle cx="16.5" cy="9.2" r="1.2" fill="currentColor" stroke="none" />
      <path
        d="M14.2 17.5 V15 A2.3 2.3 0 0 1 18.8 15 V17.5 Z"
        fill="var(--color-soft-bg, #F4F8FC)"
        strokeWidth="2.1"
      />
      <line x1="13" y1="17.8" x2="20" y2="17.8" strokeWidth="2.1" />
      <path d="M14.3 18 V24.5 H18.7 V18" strokeWidth="2.1" />
      <line x1="16.5" y1="20.2" x2="16.5" y2="22.6" strokeWidth="1.8" />
      <line x1="12.8" y1="24.8" x2="20.2" y2="24.8" strokeWidth="2.1" />
      <path d="M13.9 25 V36.8 M19.1 25 V33.5" strokeWidth="2.1" />

      {/* Right Minaret */}
      <line x1="47.5" y1="8.5" x2="47.5" y2="12.2" strokeWidth="2" />
      <circle cx="47.5" cy="9.2" r="1.2" fill="currentColor" stroke="none" />
      <path
        d="M45.2 17.5 V15 A2.3 2.3 0 0 1 49.8 15 V17.5 Z"
        fill="var(--color-soft-bg, #F4F8FC)"
        strokeWidth="2.1"
      />
      <line x1="44" y1="17.8" x2="51" y2="17.8" strokeWidth="2.1" />
      <path d="M45.3 18 V24.5 H49.7 V18" strokeWidth="2.1" />
      <line x1="47.5" y1="20.2" x2="47.5" y2="22.6" strokeWidth="1.8" />
      <line x1="43.8" y1="24.8" x2="51.2" y2="24.8" strokeWidth="2.1" />
      <path d="M44.9 25 V33.5 M50.1 25 V36.8" strokeWidth="2.1" />

      {/* 3D Kaaba Protective Halo & Sanctuary Body */}
      <path
        d="M19 30.8 L32 26.8 L45 30.8 V52.5 L29.5 55 L19 52.5 Z"
        fill="var(--color-soft-bg, #F4F8FC)"
        stroke="var(--color-soft-bg, #F4F8FC)"
        strokeWidth="2.8"
      />
      <path
        d="M19.5 31 L32 27.3 L44.5 31 V52 L29.5 54.4 L19.5 52 Z"
        fill="currentColor"
        stroke="none"
      />
      {/* Crisp 3D edge highlights */}
      <path
        d="M19.5 31 L29.5 34.2 L44.5 31 M29.5 34.2 V54.4"
        stroke="var(--color-soft-bg, #F4F8FC)"
        strokeWidth="1.15"
      />
      {/* Gold Kiswa Belt (Hizam) & Calligraphic Panels */}
      <path
        d="M19.5 34.5 L29.5 37.6 L44.5 34.5 V37.6 L29.5 40.7 L19.5 37.6 Z"
        fill="var(--color-gold, #D6AD55)"
        stroke="none"
      />
      <path
        d="M20.8 39.6 L24.2 40.6 V42.6 L20.8 41.6 Z"
        fill="var(--color-gold, #D6AD55)"
        stroke="none"
      />
      <path
        d="M25.3 41 L28.4 41.9 V43.9 L25.3 43 Z"
        fill="var(--color-gold, #D6AD55)"
        stroke="none"
      />
      <path
        d="M31.2 42 L36.6 40.9 V42.9 L31.2 44 Z"
        fill="var(--color-gold, #D6AD55)"
        stroke="none"
      />
      <path
        d="M38.2 40.5 L43.2 39.4 V41.4 L38.2 42.5 Z"
        fill="var(--color-gold, #D6AD55)"
        stroke="none"
      />
    </svg>
  );
}

/**
 * 2. بدون كفيل — Saudi man in Ghutra & Agal with a Gold-crossed sponsor ID card
 */
export function NoSponsorIcon({
  className = 'w-12 h-12',
  ...props
}: BenefitIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={props['aria-hidden'] ?? true}
    >
      {/* Ghutra & Agal */}
      <path
        d="M22.5 14.5 C18.5 18 15.2 26.5 14 35.5"
        strokeWidth="2.6"
      />
      <path
        d="M39.5 14.5 C43.2 17.5 45.8 23.5 47 30"
        strokeWidth="2.6"
      />
      <path
        d="M23 16.5 C21.2 21.5 21.5 26.5 24 29.8"
        strokeWidth="2.3"
      />
      <path
        d="M39 16.5 C40.8 21.5 40.5 26.5 38 29.8"
        strokeWidth="2.3"
      />
      <rect
        x="22"
        y="12"
        width="18"
        height="4.4"
        rx="2.2"
        fill="var(--color-soft-bg, #F4F8FC)"
        strokeWidth="2.6"
      />
      {/* Face & Neckline */}
      <path
        d="M24.2 20 C24.2 27 27.2 31.2 31 31.2 C34.8 31.2 37.8 27 37.8 20"
        strokeWidth="2.4"
      />
      <path
        d="M24.5 20.2 C27 18.2 35 18.2 37.5 20.2"
        strokeWidth="2.2"
      />
      {/* Shoulders */}
      <path
        d="M23.8 31.8 C17 34.4 11.8 39.5 11.2 46.8 H27"
        strokeWidth="2.6"
      />

      {/* Sponsor ID Card */}
      <rect
        x="26.5"
        y="34"
        width="25"
        height="17"
        rx="3.2"
        fill="var(--color-soft-bg, #F4F8FC)"
        strokeWidth="2.5"
      />
      <circle cx="33.2" cy="40.2" r="2.2" strokeWidth="2.2" />
      <path d="M29.8 46.6 C30.4 44.2 36 44.2 36.6 46.6" strokeWidth="2.2" />
      <line x1="40.5" y1="39.5" x2="47.8" y2="39.5" strokeWidth="2.3" />
      <line x1="40.5" y1="44.2" x2="46.2" y2="44.2" strokeWidth="2.3" />

      {/* Gold Prohibition Circle & Diagonal Slash */}
      <circle
        cx="44.5"
        cy="42.5"
        r="10.2"
        stroke="var(--color-soft-bg, #F4F8FC)"
        strokeWidth="4.6"
      />
      <line
        x1="37.8"
        y1="49.2"
        x2="51.2"
        y2="35.8"
        stroke="var(--color-soft-bg, #F4F8FC)"
        strokeWidth="4.6"
      />
      <circle
        cx="44.5"
        cy="42.5"
        r="10.2"
        stroke="var(--color-gold, #D6AD55)"
        strokeWidth="2.8"
      />
      <line
        x1="37.8"
        y1="49.2"
        x2="51.2"
        y2="35.8"
        stroke="var(--color-gold, #D6AD55)"
        strokeWidth="2.8"
      />
    </svg>
  );
}

/**
 * 3. زيارة الأقارب — Gold home roof with 4-pane window sheltering an Arab family
 */
export function VisitRelativesIcon({
  className = 'w-12 h-12',
  ...props
}: BenefitIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={props['aria-hidden'] ?? true}
    >
      {/* Gold Home Roof & 4-Pane Window */}
      <path
        d="M12.5 24 L32 9.5 L51.5 24"
        stroke="var(--color-gold, #D6AD55)"
        strokeWidth="3.2"
      />
      <rect
        x="28.3"
        y="17.2"
        width="3.1"
        height="3.1"
        rx="0.5"
        fill="var(--color-gold, #D6AD55)"
        stroke="none"
      />
      <rect
        x="32.6"
        y="17.2"
        width="3.1"
        height="3.1"
        rx="0.5"
        fill="var(--color-gold, #D6AD55)"
        stroke="none"
      />
      <rect
        x="28.3"
        y="21.5"
        width="3.1"
        height="3.1"
        rx="0.5"
        fill="var(--color-gold, #D6AD55)"
        stroke="none"
      />
      <rect
        x="32.6"
        y="21.5"
        width="3.1"
        height="3.1"
        rx="0.5"
        fill="var(--color-gold, #D6AD55)"
        stroke="none"
      />

      {/* Father (Ghutra & Agal) on Left */}
      <path d="M15.8 29 C13.5 32 11.8 36.8 11.2 41.2" strokeWidth="2.3" />
      <path d="M26.2 29 C28 31.4 29 35 29.4 38.8" strokeWidth="2.3" />
      <rect
        x="15.2"
        y="26.2"
        width="11.6"
        height="3"
        rx="1.5"
        fill="var(--color-soft-bg, #F4F8FC)"
        strokeWidth="2.3"
      />
      <circle cx="21" cy="34.2" r="3.8" strokeWidth="2.2" />
      <path d="M18.2 35 C19 37.8 23 37.8 23.8 35" strokeWidth="2" />
      <path
        d="M11 50 C11.6 43.8 15.6 40.8 21 40.8 C23.4 40.8 25.4 41.5 27 42.8"
        strokeWidth="2.3"
      />

      {/* Mother (Hijab) on Right */}
      <path
        d="M35.5 43.5 C35 35.2 38 29 43.5 29 C49 29 52 35.2 51.5 43.5"
        strokeWidth="2.3"
      />
      <ellipse cx="43.5" cy="36" rx="4.1" ry="4.9" strokeWidth="2.2" />
      <path
        d="M38.2 43 C40.5 42.3 46.5 42.3 48.8 44.2 C51.2 46 52.5 48.2 52.8 50.8"
        strokeWidth="2.3"
      />

      {/* Child in Center Foreground */}
      <circle
        cx="32.5"
        cy="40.5"
        r="4"
        fill="var(--color-soft-bg, #F4F8FC)"
        strokeWidth="2.3"
      />
      <path
        d="M25 53.5 C25.5 47.8 28.5 45.2 32.5 45.2 C36.5 45.2 39.5 47.8 40 53.5"
        fill="var(--color-soft-bg, #F4F8FC)"
        strokeWidth="2.3"
      />
    </svg>
  );
}

/**
 * 4. إضافة الأسرة — Arab family trio with a Gold-bordered Plus (+) badge
 */
export function AddFamilyIcon({
  className = 'w-12 h-12',
  ...props
}: BenefitIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={props['aria-hidden'] ?? true}
    >
      {/* Father (Ghutra & Agal) on Left */}
      <path d="M16.2 18.8 C13.5 22.5 11.8 28.5 11.2 34.5" strokeWidth="2.4" />
      <path d="M27.8 18.8 C29.8 21.8 30.8 26 31.2 30.5" strokeWidth="2.4" />
      <rect
        x="15.4"
        y="15.8"
        width="13.2"
        height="3.4"
        rx="1.7"
        fill="var(--color-soft-bg, #F4F8FC)"
        strokeWidth="2.4"
      />
      <circle cx="22" cy="24.8" r="4.2" strokeWidth="2.3" />
      <path d="M19 25.8 C19.8 28.6 24.2 28.6 25 25.8" strokeWidth="2" />
      <path
        d="M11 45 C11.6 38 15.8 34.2 22 34.2 C24.6 34.2 26.8 35 28.5 36.4"
        strokeWidth="2.4"
      />

      {/* Mother (Hijab) on Right */}
      <path
        d="M36 36 C35.5 27 38.5 20.5 44 20.5 C49.5 20.5 52.5 27 52 36"
        strokeWidth="2.4"
      />
      <ellipse cx="44" cy="28" rx="4.2" ry="5" strokeWidth="2.3" />
      <path
        d="M38.5 35.5 C41 34.8 47 34.8 49.5 36.8 C51.8 38.6 53 41 53.2 43.5"
        strokeWidth="2.4"
      />

      {/* Child in Center Foreground */}
      <circle
        cx="31.5"
        cy="34.2"
        r="4.2"
        fill="var(--color-soft-bg, #F4F8FC)"
        strokeWidth="2.4"
      />
      <path
        d="M23.8 48.8 C24.4 42.6 27.5 39.8 31.5 39.8 C35.5 39.8 38.6 42.6 39.2 48.8"
        fill="var(--color-soft-bg, #F4F8FC)"
        strokeWidth="2.4"
      />

      {/* Gold-Ringed Addition Badge (+) */}
      <circle
        cx="46.2"
        cy="46.2"
        r="9.4"
        fill="var(--color-soft-bg, #F4F8FC)"
        stroke="var(--color-gold, #D6AD55)"
        strokeWidth="2.8"
      />
      <line x1="46.2" y1="42" x2="46.2" y2="50.4" strokeWidth="2.7" />
      <line x1="42" y1="46.2" x2="50.4" y2="46.2" strokeWidth="2.7" />
    </svg>
  );
}

/**
 * 5. مرونة المطارات — Airport control tower, terminal facade, plane, and Gold bidirectional arrows
 */
export function AirportFlexibilityIcon({
  className = 'w-12 h-12',
  ...props
}: BenefitIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={props['aria-hidden'] ?? true}
    >
      {/* Airport Control Tower */}
      <line x1="16.5" y1="10.5" x2="16.5" y2="15.5" strokeWidth="2.2" />
      <path
        d="M10.2 15.5 H22.8 L20.6 23.2 H12.4 Z"
        fill="var(--color-soft-bg, #F4F8FC)"
        strokeWidth="2.3"
      />
      <rect
        x="12.6"
        y="17.5"
        width="7.8"
        height="3.4"
        rx="0.6"
        fill="var(--color-secondary, #C5E5FF)"
        stroke="none"
      />
      <path d="M13.5 23.2 L12.8 39 M19.5 23.2 L20.2 37" strokeWidth="2.3" />

      {/* Ascending Airliner + Speed Trails */}
      <line
        x1="31"
        y1="26"
        x2="37"
        y2="24"
        stroke="var(--color-secondary, #C5E5FF)"
        strokeWidth="2"
      />
      <line
        x1="33"
        y1="29"
        x2="38"
        y2="27.3"
        stroke="var(--color-secondary, #C5E5FF)"
        strokeWidth="2"
      />
      <path
        d="M52 13.8 C52.8 14.5 52.3 15.9 51.1 16.7 L46.6 19.6 L47.2 26.8 L45.3 28 L42.4 22.3 L38.6 24.8 L39 27.3 L37.5 28.3 L35.8 25.8 L33.2 24.4 L34.6 23.5 L37.1 23.9 L40.9 21.4 L36.1 17 L38 15.8 L44.3 17.8 L48.8 14.9 C50 14.1 51.2 13.2 52 13.8 Z"
        fill="currentColor"
        stroke="none"
      />

      {/* Curved Terminal Roof & Sky-Blue Glass Windows */}
      <path
        d="M10 38.5 C23 36.2 36 29.8 54.5 34.8 V44.5 H10 Z"
        fill="var(--color-secondary, #C5E5FF)"
        stroke="none"
      />
      <path d="M9.5 38.2 C22.5 35.8 36 29.5 55 34.6" strokeWidth="2.8" />
      <line x1="14" y1="38" x2="14" y2="44.5" strokeWidth="2" />
      <line x1="20" y1="36.6" x2="20" y2="44.5" strokeWidth="2" />
      <line x1="26" y1="34.8" x2="26" y2="44.5" strokeWidth="2" />
      <line x1="32" y1="33.4" x2="32" y2="44.5" strokeWidth="2" />
      <line x1="9" y1="45" x2="33.5" y2="45" strokeWidth="2.3" />

      {/* Bidirectional Entry/Exit Square Badge with Gold Arrows */}
      <rect
        x="32"
        y="34.8"
        width="20.5"
        height="18.2"
        rx="4"
        fill="var(--color-soft-bg, #F4F8FC)"
        strokeWidth="2.5"
      />
      {/* Top arrow right */}
      <path
        d="M36.5 41.2 H47.5 M44.4 38.5 L47.6 41.2 L44.4 43.9"
        stroke="var(--color-gold, #D6AD55)"
        strokeWidth="2.5"
      />
      {/* Bottom arrow left */}
      <path
        d="M47.8 47 H36.8 M39.9 44.3 L36.7 47 L39.9 49.7"
        stroke="var(--color-gold, #D6AD55)"
        strokeWidth="2.5"
      />
    </svg>
  );
}

/**
 * 6. بدون كشف طبي — Medical clipboard, stethoscope, and Gold exemption slash circle
 */
export function NoMedicalCheckIcon({
  className = 'w-12 h-12',
  ...props
}: BenefitIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={props['aria-hidden'] ?? true}
    >
      {/* Medical Clipboard Body */}
      <rect
        x="19.5"
        y="14.5"
        width="29"
        height="37"
        rx="4"
        fill="var(--color-soft-bg, #F4F8FC)"
        strokeWidth="2.5"
      />
      {/* Clipboard Top Clip */}
      <path
        d="M26.5 14.5 V12.8 A2 2 0 0 1 28.5 10.8 H30.8 A3.2 3.2 0 0 1 37.2 10.8 H39.5 A2 2 0 0 1 41.5 12.8 V14.5 Z"
        fill="var(--color-soft-bg, #F4F8FC)"
        strokeWidth="2.4"
      />
      <circle cx="34" cy="10.8" r="1.2" fill="currentColor" stroke="none" />

      {/* Solid Royal Blue Medical Cross */}
      <path
        d="M32 19 H36 V22 H39 V26 H36 V29 H32 V26 H29 V22 H32 Z"
        fill="currentColor"
        stroke="none"
      />

      {/* Clipboard Horizontal Lines */}
      <line x1="27" y1="33.5" x2="43" y2="33.5" strokeWidth="2.4" />
      <line x1="27" y1="38.5" x2="37.5" y2="38.5" strokeWidth="2.4" />

      {/* Stethoscope Earpieces & Tube */}
      <path
        d="M12.5 27.5 C9.8 29 9.5 36.2 14 39.8 C18.5 36.2 18.2 29 15.5 27.5"
        fill="var(--color-soft-bg, #F4F8FC)"
        strokeWidth="2.4"
      />
      <circle cx="12.5" cy="27.2" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="27.2" r="1.3" fill="currentColor" stroke="none" />
      <path
        d="M14 40 V46.2 C14 51.8 23.5 52.2 25.5 46.8"
        strokeWidth="2.4"
      />
      <circle
        cx="26.5"
        cy="44"
        r="3.2"
        fill="var(--color-soft-bg, #F4F8FC)"
        strokeWidth="2.4"
      />
      <circle cx="26.5" cy="44" r="1.1" fill="currentColor" stroke="none" />

      {/* Gold Exemption Ring & Slash */}
      <circle
        cx="46"
        cy="44.2"
        r="9.6"
        fill="var(--color-soft-bg, #F4F8FC)"
        stroke="var(--color-gold, #D6AD55)"
        strokeWidth="2.9"
      />
      <line
        x1="40"
        y1="50.2"
        x2="52"
        y2="38.2"
        stroke="var(--color-gold, #D6AD55)"
        strokeWidth="2.9"
      />
    </svg>
  );
}
