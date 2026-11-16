import React from 'react';
import { NashkaIconComponent } from './NashkaIcon';
import { NashkaIconBadge } from './NashkaIconBadge';
import { NashkaCardIndex } from './NashkaCardIndex';
import type { NashkaCardShape } from './NashkaFeatureCard';

interface NashkaInfoCardProps {
  icon: NashkaIconComponent;
  label: string;
  value: string;
  cardIndex?: string;
  shapeVariant?: NashkaCardShape;
  className?: string;
}

/**
 * NashkaInfoCard
 * NASHKA specification card:
 * - Mobile (< 768px): Horizontal spec card with right dual-ring icon, label + signature bar, left bold metric & safe top-left gold index
 * - Tablet (768px–1199px): Uniform 2x2 vertical cards with scaled icon & restrained gold edge
 * - Desktop (>= 1200px): Elevated vertical card with geometric index, subtle architectural curve & centered gold signature bar
 */
export function NashkaInfoCard({
  icon,
  label,
  value,
  cardIndex,
  shapeVariant = 'arc-start',
  className = '',
}: NashkaInfoCardProps) {
  return (
    <article
      data-nashka-shape={shapeVariant}
      className={`group nashka-card nashka-card--info h-full ${className}`}
    >
      {cardIndex && <NashkaCardIndex numberLabel={cardIndex} />}

      <div className="nashka-card-info-inner">
        <div className="nashka-card-info-main">
          <div className="nashka-card-icon-slot">
            <NashkaIconBadge icon={icon} />
          </div>

          <div className="min-w-0 flex-1 md:w-full">
            <h3 className="text-[length:var(--text-body)] font-bold text-[#68758A] leading-[1.4]">
              {label}
            </h3>

            <p className="hidden md:block mt-2 text-[clamp(1.25rem,1.8vw,1.5rem)] font-bold text-[#171C91] leading-[1.3] tabular-nums">
              {value}
            </p>
          </div>
        </div>

        {/* Mobile Prominent Value (padded clear of corner numeral) */}
        <div className="nashka-card-info-mobile-val">
          <p className="text-[17px] font-bold text-[#171C91] leading-[1.2] tabular-nums whitespace-nowrap">
            {value}
          </p>
          <span className="nashka-card-signature nashka-card-signature--inline" aria-hidden="true" />
        </div>

        {/* Tablet/Desktop Bottom Gold Signature */}
        <span className="nashka-card-signature nashka-card-signature--desktop" aria-hidden="true" />
      </div>
    </article>
  );
}
