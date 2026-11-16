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
  standard: 'nashka-icon-badge--standard',
  compact: 'nashka-icon-badge--compact',
  detailed: 'nashka-icon-badge--standard',
};

/**
 * NashkaIconBadge
 * Signature Nashka Dual-Ring Circular Emblem:
 * - Inner light radial cushion framed by subtle Royal Blue hairline
 * - Outer Gold perimeter border (#D5A43B)
 * - Two-tone Royal Blue & Gold architectural SVG artwork
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
      className={`nashka-icon-badge ${BADGE_SIZE_CLASSES[size]} ${className}`}
    >
      <span className="nashka-icon-badge-inner" />
      <NashkaIcon icon={icon} size={iconSize ?? size} className="relative z-10" />
    </span>
  );
}
