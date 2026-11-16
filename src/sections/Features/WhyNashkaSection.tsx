import React from 'react';
import { Activity, ArrowLeft, Compass, FileCheck2, Headset, ShieldCheck } from 'lucide-react';
import {
  WHY_NASHKA_CARDS,
  WHY_NASHKA_HEADER,
  WHY_NASHKA_PROMISE,
} from '../../constants/content';
import { Button } from '../../components/ui/Button';
import { NashkaFeatureCard } from '../../components/ui/NashkaFeatureCard';
import { NashkaNoticeCard } from '../../components/ui/NashkaNoticeCard';

const ICON_MAP = {
  fileCheck: FileCheck2,
  compass: Compass,
  activity: Activity,
  headset: Headset,
} as const;

export function WhyNashkaSection() {
  return (
    <section
      id="why-nashka"
      className="py-11 sm:py-14 lg:py-20 bg-[#F4F8FC] border-b border-[#E8EDF4] scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-10 xl:gap-12 items-start">
          {/* 1. Editorial Header Block */}
          <div className="lg:col-start-1 lg:col-span-5 lg:row-start-1 text-center lg:text-right max-w-xl mx-auto lg:mx-0">
            <div className="inline-flex items-center justify-center lg:justify-start gap-2.5 text-[13px] sm:text-sm font-bold leading-[1.45] text-[#8B6918] mb-1.5 sm:mb-2">
              <span className="w-6 h-[2px] bg-[#D6AD55] rounded-full shrink-0" aria-hidden="true" />
              <span>{WHY_NASHKA_HEADER.kicker}</span>
            </div>

            <h2 className="text-[1.5rem] sm:text-[1.875rem] lg:text-[2.125rem] font-extrabold text-[#161A8D] leading-[1.3] tracking-tight">
              {WHY_NASHKA_HEADER.title}
            </h2>

            <p className="mt-2 sm:mt-2.5 text-[14.5px] sm:text-base lg:text-[17px] text-[#475569] leading-[1.6] sm:leading-[1.7] [text-wrap:balance]">
              {WHY_NASHKA_HEADER.description}
            </p>
          </div>

          {/* 2. Unified 2x2 Feature Cards Grid */}
          <div className="lg:col-start-6 lg:col-span-7 lg:row-start-1 lg:row-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5 items-stretch">
            {WHY_NASHKA_CARDS.map((card) => {
              const IconComponent = ICON_MAP[card.iconKey];
              return (
                <NashkaFeatureCard
                  key={card.id}
                  icon={IconComponent}
                  title={card.title}
                  description={card.description}
                />
              );
            })}
          </div>

          {/* 3. Trust Commitment Notice Card & CTA */}
          <div className="lg:col-start-1 lg:col-span-5 lg:row-start-2 lg:self-end">
            <NashkaNoticeCard
              icon={ShieldCheck}
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
