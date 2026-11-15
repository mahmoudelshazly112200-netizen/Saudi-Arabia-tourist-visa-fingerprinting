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
 * White background, 1px Sky Blue border (#C5E5FF), centered 60/68/76px badge,
 * label below icon, prominent Royal Blue value, and gold hairline accent.
 */
export function NashkaInfoCard({ icon, label, value, className = '' }: NashkaInfoCardProps) {
  return (
    <article
      className={`group h-full bg-[var(--color-white)] rounded-2xl border border-[var(--color-secondary)] shadow-[var(--shadow-card)] p-4 sm:p-6 lg:p-7 text-center flex flex-col items-center justify-between transition-[transform,box-shadow,border-color] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[var(--shadow-card-hover)] hover:border-[#9FD3FF] active:scale-[0.99] motion-reduce:transition-none motion-reduce:active:scale-100 ${className}`}
    >
      <div className="flex flex-col items-center w-full">
        <NashkaIconBadge icon={icon} className="mb-3.5 sm:mb-4" />

        <h3 className="text-[12.5px] min-[375px]:text-[13px] sm:text-sm font-bold text-[#5A657D] leading-[1.5]">
          {label}
        </h3>

        <p className="mt-1.5 sm:mt-2 text-[19px] min-[375px]:text-[21px] sm:text-[24px] lg:text-[26px] font-extrabold text-[var(--color-primary)] leading-[1.3] tabular-nums">
          {value}
        </p>
      </div>

      <span
        className="w-8 h-0.5 bg-[var(--color-gold)] rounded-full mt-3.5 sm:mt-4"
        aria-hidden="true"
      />
    </article>
  );
}
