import React from 'react';
import { VISA_SPEC_CARDS } from '../../constants/content';
import { SectionHeader } from '../../components/common/SectionHeader';
import { NashkaInfoCard } from '../../components/ui/NashkaInfoCard';
import { NashkaNoticeCard } from '../../components/ui/NashkaNoticeCard';
import {
  BiometricGateGlyph,
  IssuanceSpeedGlyph,
  MultiEntryGlyph,
  StayDurationGlyph,
  ValidityCalendarGlyph,
} from '../../components/ui/NashkaCardIcons';

const SPEC_ICONS = {
  calendar: ValidityCalendarGlyph,
  clock: StayDurationGlyph,
  logIn: MultiEntryGlyph,
  timer: IssuanceSpeedGlyph,
} as const;

export function VisaDetailsSection() {
  return (
    <section
      id="visa-details"
      className="py-12 min-[390px]:py-14 lg:py-20 bg-[#F3F7FC] border-b border-[#E6ECF4] scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 min-[390px]:px-5 sm:px-6 lg:px-8">
        <SectionHeader
          kicker="معلومات التأشيرة"
          title="تفاصيل التأشيرة"
          description="أهم مواصفات التأشيرة قبل بدء الطلب."
          align="center"
        />

        <div className="nashka-grid-4 items-stretch">
          {VISA_SPEC_CARDS.map((spec, idx) => {
            const IconComponent = SPEC_ICONS[spec.iconKey];
            const cardIndex = String(idx + 1).padStart(2, '0');
            return (
              <NashkaInfoCard
                key={spec.id}
                icon={IconComponent}
                cardIndex={cardIndex}
                shapeVariant={idx % 2 === 0 ? 'arc-start' : 'arc-end'}
                label={spec.label}
                value={spec.value}
              />
            );
          })}
        </div>

        <NashkaNoticeCard
          icon={BiometricGateGlyph}
          surface="white"
          centered
          className="max-w-2xl mx-auto mt-5 sm:mt-6 lg:mt-7"
        >
          <p className="font-normal">
            <strong className="font-bold text-[#17213B]">البصمة الحيوية:</strong> موعد البصمة مطلوب لدى مركز
            تساهيل.
          </p>
        </NashkaNoticeCard>
      </div>
    </section>
  );
}
