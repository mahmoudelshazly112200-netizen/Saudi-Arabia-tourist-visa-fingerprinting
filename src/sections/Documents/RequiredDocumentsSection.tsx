import React from 'react';
import {
  DOCUMENTS_EXPLANATORY_NOTE,
  REQUIRED_DOCUMENTS_CARDS,
} from '../../constants/content';
import { SectionHeader } from '../../components/common/SectionHeader';
import { NashkaFeatureCard } from '../../components/ui/NashkaFeatureCard';
import { NashkaNoticeCard } from '../../components/ui/NashkaNoticeCard';
import { DocumentNoteGlyph } from '../../components/ui/NashkaCardIcons';
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

const DOC_SHAPES = ['arc-start', 'balanced', 'arc-end'] as const;

export function RequiredDocumentsSection() {
  return (
    <section
      id="documents"
      className="py-12 min-[390px]:py-14 lg:py-20 bg-white border-b border-[#E6ECF4] scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 min-[390px]:px-5 sm:px-6 lg:px-8">
        <SectionHeader
          kicker="المستندات المطلوبة"
          title="جهّز مستنداتك قبل الطلب"
          description="مستندات بسيطة وواضحة لبدء تجهيز طلب التأشيرة."
          align="center"
        />

        {/* Responsive 1-col (mobile) -> 2-col (768px) -> 3-col (1024px+) Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-4 sm:gap-5 lg:gap-6 items-stretch">
          {REQUIRED_DOCUMENTS_CARDS.map((doc, idx) => {
            const IconComponent = DOC_ICONS[doc.iconKey];
            const isThirdCard = idx === REQUIRED_DOCUMENTS_CARDS.length - 1;
            const cardIndex = String(idx + 1).padStart(2, '0');
            return (
              <NashkaFeatureCard
                key={doc.id}
                icon={IconComponent}
                cardIndex={cardIndex}
                shapeVariant={DOC_SHAPES[idx] ?? 'arc-start'}
                title={doc.title}
                description={doc.description}
                footerBadge={doc.timingLabel}
                footerBadgeTone={doc.isBiometricOnly ? 'gold' : 'primary'}
                className={isThirdCard ? 'md:col-span-2 lg:col-span-1' : ''}
              />
            );
          })}
        </div>

        {/* Full-Width Aligned Notice Bar */}
        <NashkaNoticeCard icon={DocumentNoteGlyph} surface="soft" className="w-full mt-5 sm:mt-6 lg:mt-7">
          <p className="font-normal">
            <strong className="font-bold text-[#17213B]">ملاحظة:</strong>{' '}
            {DOCUMENTS_EXPLANATORY_NOTE}
          </p>
        </NashkaNoticeCard>
      </div>
    </section>
  );
}
