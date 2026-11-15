import React from 'react';
import { Info } from 'lucide-react';
import {
  DOCUMENTS_EXPLANATORY_NOTE,
  GENERATED_IMAGES,
  REQUIRED_DOCUMENTS_CARDS,
} from '../../constants/content';
import { SectionHeader } from '../../components/common/SectionHeader';
import { ResilientImage } from '../../components/ui/ResilientImage';
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
      className="py-12 sm:py-20 lg:py-24 bg-[#F4F8FC] border-y border-[#E8EDF4] scroll-mt-14 sm:scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8 xl:gap-8 xl:items-center">
          {/* Right Region (RTL): Heading + 3 Equal-Height Document Cards + Notice Card */}
          <div className="xl:col-span-8">
            <SectionHeader
              kicker="المستندات المطلوبة"
              title="جهّز مستنداتك لبدء الطلب"
              description="مستندات بسيطة وواضحة لبدء تجهيز طلب التأشيرة."
              align="start"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-fr gap-4 sm:gap-5 items-stretch">
              {REQUIRED_DOCUMENTS_CARDS.map((doc) => {
                const IconComponent = DOC_ICONS[doc.iconKey];
                return (
                  <NashkaFeatureCard
                    key={doc.id}
                    icon={IconComponent}
                    title={doc.title}
                    description={doc.description}
                    singleLineDescription
                    footerBadge={doc.timingLabel}
                    footerBadgeTone={doc.isBiometricOnly ? 'gold' : 'primary'}
                  />
                );
              })}
            </div>

            <NashkaNoticeCard icon={Info} surface="white" className="mt-5 sm:mt-6">
              <p className="text-slate-800">
                <strong className="font-bold text-[#161A8D]">ملاحظة:</strong>{' '}
                {DOCUMENTS_EXPLANATORY_NOTE}
              </p>
            </NashkaNoticeCard>
          </div>

          {/* Left Region (RTL End): Uncropped 4:3 Studio Documents Photography */}
          <div className="xl:col-span-4 max-w-xl mx-auto w-full xl:max-w-none">
            <div className="rounded-2xl overflow-hidden border border-[#C5E5FF] bg-white shadow-[var(--shadow-card)]">
              <ResilientImage
                src={GENERATED_IMAGES.documentsShowcase}
                alt="جواز سفر مصري ساري وصورة شخصية حديثة وكشف حساب بنكي"
                fallbackLabel="مستندات التقديم"
                containerClassName="aspect-[4/3] w-full overflow-hidden bg-[#F4F8FC]"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
