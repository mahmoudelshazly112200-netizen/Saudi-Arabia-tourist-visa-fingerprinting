import React from 'react';
import { NashkaIcon, NashkaIconComponent, NashkaIconSize } from './NashkaIcon';

export type BadgeIconComponent = NashkaIconComponent;

interface NashkaIconBadgeProps {
  icon: NashkaIconComponent;
  size?: NashkaIconSize;
  iconSize?: NashkaIconSize;
  className?: string;
}

const BADGE_SIZE_CLASSES: Record<NashkaIconSize, string> = {
  // Mobile: 60px | Tablet: 68px | Desktop: 76px
  standard: 'w-[60px] h-[60px] sm:w-[68px] sm:h-[68px] lg:w-[76px] lg:h-[76px]',
  compact: 'w-11 h-11 sm:w-12 sm:h-12',
  detailed: 'w-[60px] h-[60px] sm:w-[68px] sm:h-[68px] lg:w-[76px] lg:h-[76px]',
};

/**
 * NashkaIconBadge
 * Official Nashka Circular Icon Container (v1.0):
 * - Soft light background (#F4F8FC)
 * - Gold border (#D6AD55)
 * - Royal Blue outline icon (#161A8D)
 * - Smooth -3.5px hover translation and subtle touch press feedback
 */
export function NashkaIconBadge({
  icon,
  size = 'standard',
  iconSize,
  className = '',
}: NashkaIconBadgeProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center justify-center rounded-full bg-[var(--color-soft-bg)] border-2 border-[var(--color-gold)] shadow-[var(--shadow-icon-badge)] transition-[transform,box-shadow] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[3.5px] group-hover:shadow-[0_12px_22px_-6px_rgba(22,26,141,0.2)] group-active:translate-y-0 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 shrink-0 pointer-events-none select-none ${BADGE_SIZE_CLASSES[size]} ${className}`}
    >
      <NashkaIcon icon={icon} size={iconSize ?? size} />
    </span>
  );
}
