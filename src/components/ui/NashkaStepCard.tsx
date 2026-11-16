import React from 'react';
import { NashkaIconComponent } from './NashkaIcon';
import { NashkaIconBadge } from './NashkaIconBadge';

interface NashkaStepCardProps {
  icon: NashkaIconComponent;
  stepNumber: string;
  title: string;
  description: string;
  className?: string;
}

/**
 * NashkaStepCard
 * Standardized application stage card:
 * Pure White (#FFFFFF), Soft Gray border (#E8EDF4), circular icon badge,
 * accessible Gold stage label (#8B6918), Deep Black heading (#0B0B0D), and 16px description (#334155).
 */
export function NashkaStepCard({
  icon,
  stepNumber,
  title,
  description,
  className = '',
}: NashkaStepCardProps) {
  return (
    <article
      className={`group h-full bg-white rounded-2xl border border-[#E8EDF4] shadow-[var(--shadow-card)] p-4 sm:p-5 lg:p-6 text-center flex flex-col items-center justify-start transition-[transform,box-shadow,border-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[var(--shadow-card-hover)] hover:border-[#C5E5FF] active:scale-[0.99] motion-reduce:transition-none motion-reduce:active:scale-100 ${className}`}
    >
      <NashkaIconBadge icon={icon} className="mb-3" />

      <p className="text-[12.5px] sm:text-[13px] font-bold leading-[1.45] text-[#8B6918] tracking-wide mb-1 tabular-nums">
        المرحلة {stepNumber}
      </p>

      <h3 className="text-[17px] sm:text-[18px] font-bold text-[#0B0B0D] leading-[1.35] [text-wrap:balance]">
        {title}
      </h3>

      <p className="mt-2 text-[14px] sm:text-[14.5px] text-[#475569] leading-[1.6] w-full [text-wrap:balance]">
        {description}
      </p>
    </article>
  );
}
