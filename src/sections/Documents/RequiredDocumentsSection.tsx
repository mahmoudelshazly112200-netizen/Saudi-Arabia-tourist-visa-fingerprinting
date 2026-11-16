import React from 'react';
import { Info } from 'lucide-react';
import {
  DOCUMENTS_EXPLANATORY_NOTE,
  REQUIRED_DOCUMENTS_CARDS,
} from '../../constants/content';
import { SectionHeader } from '../../components/common/SectionHeader';
import { NashkaFeatureCard } from '../../components/ui/NashkaFeatureCard';
import { NashkaNoticeCard } from '../../components/ui/NashkaNoticeCard';
import {
  BankStatementIcon,
  PassportDocumentIcon,
  PersonalPhotoIcon,
} from '../../components/ui/DocumentIcons';

const DOC_ICONS = {
  passport: PassportDocumentIcon,
  photo: PersonalPhotoIcon,
  bank: BankStatementIcon,
} as const;

export function RequiredDocumentsSection() {
  return (
    <section
      id="documents"
      className="py-11 sm:py-14 lg:py-20 bg-white border-b border-[#E8EDF4] scroll-mt-16"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          kicker="المستندات المطلوبة"
          title="جهّز مستنداتك قبل الطلب"
          description="مستندات بسيطة وواضحة لبدء تجهيز طلب التأشيرة."
          align="center"
        />

        {/* Full-Width 3 Equal Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-fr gap-3.5 sm:gap-5 lg:gap-6 items-stretch">
          {REQUIRED_DOCUMENTS_CARDS.map((doc) => {
            const IconComponent = DOC_ICONS[doc.iconKey];
            return (
              <NashkaFeatureCard
                key={doc.id}
                icon={IconComponent}
                title={doc.title}
                description={doc.description}
                footerBadge={doc.timingLabel}
                footerBadgeTone={doc.isBiometricOnly ? 'gold' : 'primary'}
              />
            );
          })}
        </div>

        {/* Full-Width Aligned Notice Bar */}
        <NashkaNoticeCard icon={Info} surface="soft" className="w-full mt-5 sm:mt-6">
          <p className="text-[#334155]">
            <strong className="font-bold text-[#0B0B0D]">ملاحظة:</strong>{' '}
            {DOCUMENTS_EXPLANATORY_NOTE}
          </p>
        </NashkaNoticeCard>
      </div>
    </section>
  );
}
