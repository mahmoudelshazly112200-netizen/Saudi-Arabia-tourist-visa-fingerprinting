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
 * Pure White (#FFFFFF) surface, Soft Gray border (#E8EDF4), centered circular icon badge,
 * Deep Black heading (#0B0B0D), readable 16px description (#475569),
 * and optional equal-height footer timing label.
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
  className = '',
}: NashkaFeatureCardProps) {
  return (
    <article
      className={`group h-full bg-white rounded-2xl border border-[#E8EDF4] shadow-[var(--shadow-card)] p-4 sm:p-5 lg:p-6 text-center flex flex-col items-center justify-start transition-[transform,box-shadow,border-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[var(--shadow-card-hover)] hover:border-[#C5E5FF] active:scale-[0.99] motion-reduce:transition-none motion-reduce:active:scale-100 ${className}`}
    >
      <NashkaIconBadge
        icon={icon}
        iconSize={iconScale}
        className="mb-3"
      />

      <h3 className="text-[17px] sm:text-[18px] font-bold text-[#0B0B0D] leading-[1.35] [text-wrap:balance]">
        {title}
      </h3>

      {metaLabel && (
        <p
          className={`mt-1 text-[13px] font-bold leading-[1.45] ${
            metaTone === 'gold'
              ? 'text-[#8B6918]'
              : 'text-[#475569]'
          }`}
        >
          {metaLabel}
        </p>
      )}

      <p className="mt-2 text-[14px] sm:text-[14.5px] text-[#475569] leading-[1.6] w-full [text-wrap:balance] tabular-nums">
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
            className={`inline-flex items-center justify-center rounded-lg px-3 py-1 text-[12px] sm:text-[13px] font-bold leading-snug whitespace-nowrap border ${
              footerBadgeTone === 'gold'
                ? 'bg-[#FFF5E5] text-[#8B6918] border-[#D6AD55]/60'
                : 'bg-[#EAF4FF] text-[#004AAD] border-[#C5E5FF]'
            }`}
          >
            {footerBadge}
          </span>
        </div>
      )}
    </article>
  );
}
