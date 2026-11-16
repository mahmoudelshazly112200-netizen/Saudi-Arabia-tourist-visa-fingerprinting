import React from 'react';
import { NashkaIconComponent } from './NashkaIcon';
import { NashkaIconBadge } from './NashkaIconBadge';
import { NashkaCardIndex } from './NashkaCardIndex';

export type NashkaCardShape = 'arc-start' | 'arc-end' | 'balanced';

interface NashkaFeatureCardProps {
  icon: NashkaIconComponent;
  iconScale?: 'standard' | 'detailed';
  title: string;
  description: string;
  mobileDescription?: string;
  cardIndex?: string;
  shapeVariant?: NashkaCardShape;
  metaLabel?: string;
  metaTone?: 'muted' | 'gold';
  footerBadge?: string;
  footerBadgeTone?: 'primary' | 'gold';
  singleLineDescription?: boolean;
  className?: string;
}

/**
 * NashkaFeatureCard
 * Unified NASHKA TOURISM feature / document card:
 * - Mobile (< 768px): Horizontal layout (side icon right, clear title/desc left, gold numeral corner)
 * - Tablet (768px–1199px): Balanced 2-col uniform-height vertical card with proportional emblem & light ornament
 * - Desktop (>= 1200px): Architectural white card with partial gold rim, subtle shoulder curve, geometric index, dual-ring icon & gold signature line
 */
export function NashkaFeatureCard({
  icon,
  iconScale = 'standard',
  title,
  description,
  mobileDescription,
  cardIndex,
  shapeVariant = 'arc-start',
  metaLabel,
  metaTone = 'muted',
  footerBadge,
  footerBadgeTone = 'primary',
  className = '',
}: NashkaFeatureCardProps) {
  return (
    <article
      data-nashka-shape={shapeVariant}
      className={`group nashka-card nashka-card--feature h-full ${className}`}
    >
      {cardIndex && <NashkaCardIndex numberLabel={cardIndex} />}

      <div className="nashka-card-feature-inner">
        <div className="nashka-card-icon-slot">
          <NashkaIconBadge icon={icon} iconSize={iconScale} />
        </div>

        <div className="nashka-card-body-slot">
          <h3 className="nashka-card-title">{title}</h3>

          {metaLabel && (
            <p
              className={`mt-1 text-[length:var(--text-caption)] font-bold leading-[1.45] ${
                metaTone === 'gold' ? 'text-[#876216]' : 'text-[#68758A]'
              }`}
            >
              {metaLabel}
            </p>
          )}

          <p className="nashka-card-desc tabular-nums">
            {mobileDescription ? (
              <>
                <span className="md:hidden">{mobileDescription}</span>
                <span className="hidden md:inline">{description}</span>
              </>
            ) : (
              description
            )}
          </p>

          {footerBadge && (
            <div className="nashka-card-footer-note-wrap">
              <p
                className={`nashka-card-footer-note ${
                  footerBadgeTone === 'gold' ? 'text-[#876216]' : 'text-[#004AAD]'
                }`}
              >
                {footerBadge}
              </p>
            </div>
          )}

          <span className="nashka-card-signature" aria-hidden="true" />
        </div>
      </div>
    </article>
  );
}
