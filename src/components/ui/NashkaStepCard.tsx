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
 * White background, 1px Sky Blue border (#C5E5FF), centered 60/68/76px badge,
 * editorial stage label, Royal Blue heading, and concise description.
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
      className={`group h-full bg-[var(--color-white)] rounded-2xl border border-[var(--color-secondary)] shadow-[var(--shadow-card)] p-4 min-[375px]:p-5 sm:p-6 lg:p-7 text-center flex flex-col items-center justify-start transition-[transform,box-shadow,border-color] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[var(--shadow-card-hover)] hover:border-[#9FD3FF] active:scale-[0.99] motion-reduce:transition-none motion-reduce:active:scale-100 ${className}`}
    >
      <NashkaIconBadge icon={icon} className="mb-3.5 sm:mb-4" />

      <p className="text-xs sm:text-[13px] font-bold text-[var(--color-gold-accessible)] tracking-wide mb-1 tabular-nums">
        المرحلة {stepNumber}
      </p>

      <h3 className="text-[15.5px] min-[375px]:text-[16.5px] sm:text-lg font-bold text-[var(--color-primary)] leading-[1.45] [text-wrap:balance]">
        {title}
      </h3>

      <p className="mt-2 text-[13px] min-[375px]:text-[13.5px] sm:text-[14.5px] text-[#5A657D] leading-[1.75] sm:leading-[1.8] [text-wrap:balance]">
        {description}
      </p>
    </article>
  );
}
