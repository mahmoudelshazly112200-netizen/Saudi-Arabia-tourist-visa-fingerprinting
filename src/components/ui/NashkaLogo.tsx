import React from 'react';

export type NashkaLogoVariant = 'light' | 'dark' | 'mark';
export type NashkaLogoSize = 'sm' | 'md' | 'lg';

interface NashkaLogoProps {
  variant?: NashkaLogoVariant;
  size?: NashkaLogoSize;
  className?: string;
}

const HORIZONTAL_SIZE_CLASSES: Record<NashkaLogoSize, string> = {
  sm: 'h-8 sm:h-9',
  md: 'h-8 min-[375px]:h-9 sm:h-11',
  lg: 'h-12 sm:h-14',
};

const MARK_SIZE_CLASSES: Record<NashkaLogoSize, string> = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
};

/**
 * Official Nashka Tourism brand logo component using the approved uploaded brand assets.
 * - `light`: White-surface horizontal lockup (PROFILE_PICTURE-25) for Navbar / light headers.
 * - `dark`: Royal-Blue horizontal lockup (PROFILE_PICTURE-20) for Footer / Admin Sidebar / Auth Gate.
 * - `mark`: Square standalone 'N' emblem (PROFILE_PICTURE-19).
 */
export function NashkaLogo({
  variant = 'light',
  size = 'md',
  className = '',
}: NashkaLogoProps) {
  if (variant === 'mark') {
    return (
      <span
        dir="ltr"
        className={[
          'inline-flex items-center justify-center rounded-xl overflow-hidden bg-[#171C91] shrink-0 select-none',
          MARK_SIZE_CLASSES[size],
          className,
        ].join(' ')}
      >
        <img
          src="/assets/aistudio/PROFILE_PICTURE-19_980081a6.jpg"
          alt="شعار نشكا للسياحة — Nashka Tourism"
          className="w-full h-full object-cover"
          decoding="async"
        />
      </span>
    );
  }

  if (variant === 'dark') {
    return (
      <span
        dir="ltr"
        className={[
          'inline-flex items-center rounded-xl bg-[#171C91] border border-white/15 px-2.5 py-1 shadow-sm shrink-0 select-none',
          className,
        ].join(' ')}
      >
        <span
          className={[
            'relative aspect-[3.45/1] overflow-hidden block',
            HORIZONTAL_SIZE_CLASSES[size],
          ].join(' ')}
        >
          <img
            src="/assets/aistudio/PROFILE_PICTURE-20_1998a444.jpg"
            alt="نشكا للسياحة — Nashka Tourism"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[138%] max-w-none h-auto pointer-events-none"
            decoding="async"
          />
        </span>
      </span>
    );
  }

  return (
    <span
      dir="ltr"
      className={[
        'relative aspect-[3.45/1] overflow-hidden inline-block shrink-0 select-none',
        HORIZONTAL_SIZE_CLASSES[size],
        className,
      ].join(' ')}
    >
      <img
        src="/assets/aistudio/PROFILE_PICTURE-25_1cbd6cbb.jpg"
        alt="نشكا للسياحة — Nashka Tourism"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[138%] max-w-none h-auto mix-blend-multiply pointer-events-none"
        decoding="async"
      />
    </span>
  );
}
