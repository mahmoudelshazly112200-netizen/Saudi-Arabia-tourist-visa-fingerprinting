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
  standard: 'w-[26px] h-[26px] sm:w-[30px] sm:h-[30px] lg:w-[34px] lg:h-[34px]',
  compact: 'w-[20px] h-[20px] sm:w-[22px] sm:h-[22px]',
  detailed: 'w-[44px] h-[44px] sm:w-[50px] sm:h-[50px] lg:w-[56px] lg:h-[56px]',
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
