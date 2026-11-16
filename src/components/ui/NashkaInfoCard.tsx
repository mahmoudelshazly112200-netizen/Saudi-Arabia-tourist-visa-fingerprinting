import React from 'react';
import { NashkaIconComponent } from './NashkaIcon';
import { NashkaIconBadge } from './NashkaIconBadge';

interface NashkaInfoCardProps {
  icon: NashkaIconComponent;
  label: string;
  value: string;
  className?: string;
}

/**
 * NashkaInfoCard
 * Standardized metric/specification card:
 * Pure White (#FFFFFF), Soft Gray border (#E8EDF4), circular badge,
 * clear 16px label (#334155), prominent Royal Blue value (#161A8D), and Premium Gold #D6AD55 accent line.
 */
export function NashkaInfoCard({ icon, label, value, className = '' }: NashkaInfoCardProps) {
  return (
    <article
      className={`group h-full bg-white rounded-2xl border border-[#E8EDF4] shadow-[var(--shadow-card)] p-4 sm:p-5 lg:p-6 text-center flex flex-col items-center justify-between transition-[transform,box-shadow,border-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[var(--shadow-card-hover)] hover:border-[#C5E5FF] active:scale-[0.99] motion-reduce:transition-none motion-reduce:active:scale-100 ${className}`}
    >
      <div className="flex flex-col items-center w-full">
        <NashkaIconBadge icon={icon} className="mb-3" />

        <h3 className="text-[14px] sm:text-[15px] font-bold text-[#475569] leading-[1.45]">
          {label}
        </h3>

        <p className="mt-1.5 text-[20px] sm:text-[22px] lg:text-[24px] font-extrabold text-[#161A8D] leading-[1.3] tabular-nums">
          {value}
        </p>
      </div>

      <span
        className="w-7 h-0.5 bg-[#D6AD55] rounded-full mt-3.5"
        aria-hidden="true"
      />
    </article>
  );
}
