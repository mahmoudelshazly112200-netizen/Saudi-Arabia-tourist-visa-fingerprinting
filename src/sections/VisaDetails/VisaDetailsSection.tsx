import React from 'react';
import { Calendar, Clock, Fingerprint, LogIn, Timer } from 'lucide-react';
import { VISA_SPEC_CARDS } from '../../constants/content';
import { SectionHeader } from '../../components/common/SectionHeader';
import { NashkaInfoCard } from '../../components/ui/NashkaInfoCard';
import { NashkaNoticeCard } from '../../components/ui/NashkaNoticeCard';

const SPEC_ICONS = {
  calendar: Calendar,
  clock: Clock,
  logIn: LogIn,
  timer: Timer,
} as const;

export function VisaDetailsSection() {
  return (
    <section
      id="visa-details"
      className="py-11 sm:py-14 lg:py-20 bg-[#F4F8FC] border-b border-[#E8EDF4] scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          kicker="معلومات التأشيرة"
          title="تفاصيل التأشيرة"
          description="أهم مواصفات التأشيرة قبل بدء الطلب."
          align="center"
        />

        <div className="grid grid-cols-1 min-[340px]:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 items-stretch">
          {VISA_SPEC_CARDS.map((spec) => {
            const IconComponent = SPEC_ICONS[spec.iconKey];
            return (
              <NashkaInfoCard
                key={spec.id}
                icon={IconComponent}
                label={spec.label}
                value={spec.value}
              />
            );
          })}
        </div>

        <NashkaNoticeCard
          icon={Fingerprint}
          surface="white"
          centered
          className="max-w-2xl mx-auto mt-6 sm:mt-8"
        >
          <p className="font-semibold text-[#334155]">
            <strong className="text-[#0B0B0D]">البصمة الحيوية:</strong> موعد البصمة مطلوب لدى مركز
            تساهيل.
          </p>
        </NashkaNoticeCard>
      </div>
    </section>
  );
}
