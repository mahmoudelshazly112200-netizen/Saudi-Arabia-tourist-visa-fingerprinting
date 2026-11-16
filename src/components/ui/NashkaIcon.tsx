import React from 'react';

export type NashkaIconComponent = React.ComponentType<{
  className?: string;
  strokeWidth?: number | string;
  'aria-hidden'?: boolean | 'true' | 'false';
}>;

export type NashkaIconSize = 'standard' | 'compact' | 'detailed';

interface NashkaIconProps {
  icon: NashkaIconComponent;
  size?: NashkaIconSize;
  className?: string;
}

const ICON_SIZE_CLASSES: Record<NashkaIconSize, string> = {
  standard: 'w-5 h-5 sm:w-[22px] sm:h-[22px] lg:w-6 lg:h-6',
  compact: 'w-[18px] h-[18px] sm:w-5 sm:h-5',
  detailed: 'w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10',
};

/**
 * NashkaIcon
 * Standardized Royal Blue (#161A8D) outline icon artwork with uniform stroke weight.
 */
export function NashkaIcon({
  icon: IconComponent,
  size = 'standard',
  className = '',
}: NashkaIconProps) {
  return (
    <IconComponent
      className={`text-[var(--color-primary)] shrink-0 ${ICON_SIZE_CLASSES[size]} ${className}`}
      strokeWidth={1.85}
      aria-hidden="true"
    />
  );
}
