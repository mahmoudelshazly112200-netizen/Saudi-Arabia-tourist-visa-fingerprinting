import React from 'react';
import { VISA_BENEFIT_CARDS } from '../../constants/content';
import { SectionHeader } from '../../components/common/SectionHeader';
import { ResilientImage } from '../../components/ui/ResilientImage';

export function VisaBenefitsSection() {
  const featuredCards = VISA_BENEFIT_CARDS.filter((card) => card.featured);
  const secondaryCards = VISA_BENEFIT_CARDS.filter((card) => !card.featured);

  return (
    <section
      id="benefits"
      className="py-11 sm:py-14 lg:py-20 bg-white border-b border-[#E8EDF4] scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          kicker="مميزات التأشيرة السياحية"
          title="مميزات التأشيرة"
          description="اكتشف المملكة، واستمتع برحلة تجمع بين العمرة والسياحة وزيارة الأقارب."
          align="center"
        />

        {/* Row 1: Two Featured Photographic Bento Cards (01 & 02) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-5 lg:gap-6 mb-3.5 sm:mb-5 lg:mb-6 items-stretch">
          {featuredCards.map((card) => {
            const positionClass =
              card.imagePosition === 'top' ? 'object-top' : 'object-center';

            return (
              <article
                key={card.id}
                className="group bg-white rounded-2xl border border-[#E8EDF4] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:border-[#C5E5FF] transition-[box-shadow,border-color] duration-200 overflow-hidden grid grid-cols-1 sm:grid-cols-12 items-stretch"
              >
                <ResilientImage
                  src={card.imageUrl}
                  alt={card.imageAlt}
                  fallbackLabel={card.title}
                  loading="eager"
                  containerClassName="sm:col-span-5 aspect-[16/10] sm:aspect-auto sm:h-full sm:min-h-[188px] w-full overflow-hidden bg-[#F4F8FC] border-b sm:border-b-0 sm:border-l border-[#E8EDF4]"
                  className={`w-full h-full object-cover ${positionClass} transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100`}
                />

                <div className="sm:col-span-7 p-4 sm:p-5 lg:p-6 flex flex-col justify-center text-start">
                  <span className="font-en tabular-nums text-[13px] font-bold leading-[1.45] text-[#8B6918] mb-1">
                    {card.numberLabel}
                  </span>
                  <h3 className="text-[17px] sm:text-[18px] font-bold text-[#0B0B0D] leading-[1.35] [text-wrap:balance]">
                    {card.title}
                  </h3>
                  <p className="mt-1.5 text-[14px] sm:text-[14.5px] text-[#475569] leading-[1.6]">
                    {card.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        {/* Row 2: Four Photographic Cards (03 - 06) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6 items-stretch">
          {secondaryCards.map((card) => {
            const positionClass =
              card.imagePosition === 'top' ? 'object-top' : 'object-center';

            return (
              <article
                key={card.id}
                className="group bg-white rounded-2xl border border-[#E8EDF4] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:border-[#C5E5FF] transition-[box-shadow,border-color] duration-200 overflow-hidden flex flex-col"
              >
                <ResilientImage
                  src={card.imageUrl}
                  alt={card.imageAlt}
                  fallbackLabel={card.title}
                  loading="eager"
                  containerClassName="aspect-[16/10] w-full overflow-hidden bg-[#F4F8FC] border-b border-[#E8EDF4]"
                  className={`w-full h-full object-cover ${positionClass} transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100`}
                />

                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-start text-start">
                  <span className="font-en tabular-nums text-[13px] font-bold leading-[1.45] text-[#8B6918] mb-1">
                    {card.numberLabel}
                  </span>
                  <h3 className="text-[17px] sm:text-[18px] font-bold text-[#0B0B0D] leading-[1.35] [text-wrap:balance]">
                    {card.title}
                  </h3>
                  <p className="mt-1.5 text-[14px] sm:text-[14.5px] text-[#475569] leading-[1.6]">
                    {card.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
