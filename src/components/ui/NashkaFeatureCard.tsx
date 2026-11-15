import React from 'react';
import { NashkaIconComponent } from './NashkaIcon';
import { NashkaIconBadge } from './NashkaIconBadge';

interface NashkaFeatureCardProps {
  icon: NashkaIconComponent;
  iconScale?: 'standard' | 'detailed';
  title: string;
  description: string;
  mobileDescription?: string;
  metaLabel?: string;
  metaTone?: 'muted' | 'gold';
  footerBadge?: string;
  footerBadgeTone?: 'primary' | 'gold';
  singleLineDescription?: boolean;
  className?: string;
}

/**
 * NashkaFeatureCard
 * Standardized feature/benefit/document card:
 * White background, 1px Sky Blue border (#C5E5FF), centered 60/68/76px badge,
 * Royal Blue heading below icon, concise condition/description, and optional bottom timing badge.
 */
export function NashkaFeatureCard({
  icon,
  iconScale = 'standard',
  title,
  description,
  mobileDescription,
  metaLabel,
  metaTone = 'muted',
  footerBadge,
  footerBadgeTone = 'primary',
  singleLineDescription = false,
  className = '',
}: NashkaFeatureCardProps) {
  return (
    <article
      className={`group h-full bg-[var(--color-white)] rounded-2xl border border-[var(--color-secondary)] shadow-[var(--shadow-card)] p-4 min-[375px]:p-5 sm:p-5 lg:px-4 lg:py-6 text-center flex flex-col items-center justify-start transition-[transform,box-shadow,border-color] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[var(--shadow-card-hover)] hover:border-[#9FD3FF] active:scale-[0.99] motion-reduce:transition-none motion-reduce:active:scale-100 ${className}`}
    >
      <NashkaIconBadge
        icon={icon}
        iconSize={iconScale}
        className="mb-3.5 sm:mb-4 lg:mb-5"
      />

      <h3 className="text-[16px] sm:text-[17px] lg:text-[18px] font-bold text-[var(--color-primary)] leading-[1.4] [text-wrap:balance]">
        {title}
      </h3>

      {metaLabel && (
        <p
          className={`mt-1 text-[12px] sm:text-[12.5px] font-bold leading-relaxed ${
            metaTone === 'gold'
              ? 'text-[var(--color-gold-accessible)]'
              : 'text-[#5A657D]'
          }`}
        >
          {metaLabel}
        </p>
      )}

      <p
        className={`mt-2 text-[#5A657D] tabular-nums ${
          singleLineDescription
            ? 'text-[12.5px] min-[360px]:text-[13.5px] md:text-[12.5px] lg:text-[13px] xl:text-[13.5px] leading-[1.65] whitespace-nowrap'
            : 'text-[13px] min-[375px]:text-[13.5px] sm:text-[14.5px] lg:text-[15px] leading-[1.75] sm:leading-[1.8] max-w-xs [text-wrap:balance]'
        }`}
      >
        {mobileDescription ? (
          <>
            <span className="sm:hidden">{mobileDescription}</span>
            <span className="hidden sm:inline">{description}</span>
          </>
        ) : (
          description
        )}
      </p>

      {footerBadge && (
        <div className="mt-auto pt-3.5">
          <span
            className={`inline-flex items-center justify-center rounded-lg px-3 py-1 text-[12px] font-bold leading-snug whitespace-nowrap border ${
              footerBadgeTone === 'gold'
                ? 'bg-[#FBF7EE] text-[#8B6918] border-[#D6AD55]/60'
                : 'bg-[#F4F8FC] text-[#161A8D] border-[#C5E5FF]'
            }`}
          >
            {footerBadge}
          </span>
        </div>
      )}
    </article>
  );
}
