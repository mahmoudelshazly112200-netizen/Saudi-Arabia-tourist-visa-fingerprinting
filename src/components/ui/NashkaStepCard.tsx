import React from 'react';
import { NashkaIconComponent } from './NashkaIcon';
import { NashkaIconBadge } from './NashkaIconBadge';
import { NashkaCardIndex } from './NashkaCardIndex';
import type { NashkaCardShape } from './NashkaFeatureCard';

interface NashkaStepCardProps {
  icon: NashkaIconComponent;
  stepNumber: string;
  title: string;
  description: string;
  shapeVariant?: NashkaCardShape;
  className?: string;
}

/**
 * NashkaStepCard
 * NASHKA application stage card:
 * - Mobile (< 768px): Horizontal timeline card (Icon right, Stage + Title + Desc + gold signature left, gold step index corner)
 * - Tablet (768px–1199px): Uniform 2x2 centered vertical stage cards
 * - Desktop (>= 1200px): Editorial vertical stage cards with architectural variation & gold signature
 */
export function NashkaStepCard({
  icon,
  stepNumber,
  title,
  description,
  shapeVariant = 'arc-start',
  className = '',
}: NashkaStepCardProps) {
  return (
    <article
      data-nashka-shape={shapeVariant}
      className={`group nashka-card nashka-card--step h-full ${className}`}
    >
      <NashkaCardIndex numberLabel={stepNumber} />

      <div className="nashka-card-feature-inner">
        <div className="nashka-card-icon-slot">
          <NashkaIconBadge icon={icon} />
        </div>

        <div className="nashka-card-body-slot">
          <p className="text-[length:var(--text-caption)] font-bold leading-[1.45] text-[#876216] tracking-wide mb-0.5 md:mb-1 tabular-nums">
            المرحلة {stepNumber}
          </p>

          <h3 className="nashka-card-title">{title}</h3>

          <p className="nashka-card-desc">{description}</p>

          <span className="nashka-card-signature" aria-hidden="true" />
        </div>
      </div>
    </article>
  );
}
