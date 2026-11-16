import React from 'react';

interface NashkaCardIndexProps {
  numberLabel: string;
  className?: string;
}

/**
 * NashkaCardIndex
 * Refined small geometric gold numeral medallion (01, 02, 03...)
 * Scaled proportionally across Desktop, Tablet, and Mobile corners
 * while remaining clearly subordinate to card headings.
 */
export function NashkaCardIndex({ numberLabel, className = '' }: NashkaCardIndexProps) {
  return (
    <span className={`nashka-card-index font-en tabular-nums select-none ${className}`}>
      {numberLabel}
    </span>
  );
}
