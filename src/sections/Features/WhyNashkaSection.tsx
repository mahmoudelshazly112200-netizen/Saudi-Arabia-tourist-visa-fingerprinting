import React from 'react';
import { ArrowLeft } from 'lucide-react';
import {
  WHY_NASHKA_CARDS,
  WHY_NASHKA_HEADER,
  WHY_NASHKA_PROMISE,
} from '../../constants/content';
import { Button } from '../../components/ui/Button';
import { NashkaFeatureCard } from '../../components/ui/NashkaFeatureCard';
import { NashkaNoticeCard } from '../../components/ui/NashkaNoticeCard';
import {
  ConciergeSupportGlyph,
  FileAuditGlyph,
  RouteCompassGlyph,
  TimelinePulseGlyph,
  TrustShieldGlyph,
} from '../../components/ui/NashkaCardIcons';

const ICON_MAP = {
  fileCheck: FileAuditGlyph,
  compass: RouteCompassGlyph,
  activity: TimelinePulseGlyph,
  headset: ConciergeSupportGlyph,
} as const;

const SHAPE_SEQUENCE = ['arc-start', 'arc-end', 'arc-end', 'arc-start'] as const;

export function WhyNashkaSection() {
  return (
    <section
      id="why-nashka"
      className="py-12 min-[390px]:py-14 lg:py-20 bg-[#F3F7FC] border-b border-[#E6ECF4] scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 min-[390px]:px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-10 xl:gap-12 items-start">
          {/* 1. Editorial Header Block */}
          <div className="lg:col-start-1 lg:col-span-5 lg:row-start-1 text-center lg:text-right max-w-xl mx-auto lg:mx-0">
            <div className="inline-flex items-center justify-center lg:justify-start gap-2.5 text-[length:var(--text-caption)] font-bold leading-[1.45] text-[#876216] mb-1.5 sm:mb-2">
              <span className="w-6 h-[2px] bg-[#D5A43B] rounded-full shrink-0" aria-hidden="true" />
              <span>{WHY_NASHKA_HEADER.kicker}</span>
            </div>

            <h2 className="text-[length:var(--text-h2)] font-bold text-[#171C91] leading-[1.3] tracking-tight">
              {WHY_NASHKA_HEADER.title}
            </h2>

            <p className="mt-2 sm:mt-2.5 text-[length:var(--text-body)] font-normal text-[#68758A] leading-[1.65] [text-wrap:balance]">
              {WHY_NASHKA_HEADER.description}
            </p>
          </div>

          {/* 2. Unified 2x2 Feature Cards Grid */}
          <div className="lg:col-start-6 lg:col-span-7 lg:row-start-1 lg:row-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 items-stretch">
            {WHY_NASHKA_CARDS.map((card, idx) => {
              const IconComponent = ICON_MAP[card.iconKey];
              const cardIndex = String(idx + 1).padStart(2, '0');
              return (
                <NashkaFeatureCard
                  key={card.id}
                  icon={IconComponent}
                  cardIndex={cardIndex}
                  shapeVariant={SHAPE_SEQUENCE[idx] ?? 'arc-start'}
                  title={card.title}
                  description={card.description}
                />
              );
            })}
          </div>

          {/* 3. Trust Commitment Notice Card & CTA */}
          <div className="lg:col-start-1 lg:col-span-5 lg:row-start-2 lg:self-end">
            <NashkaNoticeCard
              icon={TrustShieldGlyph}
              title={WHY_NASHKA_PROMISE.title}
              stackActionOnDesktop
              action={
                <Button
                  to="/apply"
                  variant="primary"
                  size="md"
                  className="w-full md:w-auto lg:w-full rounded-xl min-h-[48px] px-6"
                >
                  <span>{WHY_NASHKA_PROMISE.ctaLabel}</span>
                  <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
                </Button>
              }
            >
              <p>{WHY_NASHKA_PROMISE.description}</p>
            </NashkaNoticeCard>
          </div>
        </div>
      </div>
    </section>
  );
}
