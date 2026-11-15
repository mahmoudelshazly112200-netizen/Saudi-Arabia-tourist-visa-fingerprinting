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
      className="py-12 sm:py-18 lg:py-24 bg-[#FAF8F5] border-b border-[#E8EDF4] scroll-mt-14 sm:scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="مميزات التأشيرة"
          description="اكتشف المملكة، واستمتع برحلة تجمع بين العمرة والسياحة وزيارة الأقارب."
          align="center"
        />

        {/* Row 1: Two Wide Horizontal Bento Cards (01 & 02) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 mb-4 sm:mb-5 lg:mb-6">
          {featuredCards.map((card) => (
            <article
              key={card.id}
              className="group bg-white rounded-2xl border border-[#C5E5FF] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:border-[#9FD3FF] transition-[box-shadow,border-color,transform] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden grid grid-cols-1 sm:grid-cols-12 items-stretch"
            >
              {/* Right side in RTL: Photographic Cover */}
              <ResilientImage
                src={card.imageUrl}
                alt={card.imageAlt}
                fallbackLabel={card.title}
                containerClassName="sm:col-span-6 aspect-[16/10] sm:aspect-auto sm:h-full sm:min-h-[224px] lg:min-h-[236px] overflow-hidden bg-[#F4F8FC]"
                className={`w-full h-full object-cover ${
                  card.imagePosition === 'top' ? 'object-top' : 'object-center'
                } transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100`}
              />

              {/* Left side in RTL: Number, Title & Concise Copy */}
              <div className="sm:col-span-6 p-5 sm:p-6 lg:p-7 flex flex-col justify-center text-start">
                <span className="font-en tabular-nums text-[12px] sm:text-[13px] font-bold text-[#8B6918] mb-1.5">
                  {card.numberLabel}
                </span>
                <h3 className="text-lg sm:text-[19px] lg:text-[21px] font-extrabold text-[#161A8D] leading-[1.4] [text-wrap:balance]">
                  {card.title}
                </h3>
                <p className="mt-2 text-[13.5px] sm:text-[14.5px] lg:text-[15px] text-[#5A657D] leading-[1.75]">
                  {card.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Row 2: Four Vertical Photo Cards (03 - 06) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 items-stretch">
          {secondaryCards.map((card) => (
            <article
              key={card.id}
              className="group bg-white rounded-2xl border border-[#C5E5FF] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:border-[#9FD3FF] transition-[box-shadow,border-color,transform] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden flex flex-col"
            >
              <ResilientImage
                src={card.imageUrl}
                alt={card.imageAlt}
                fallbackLabel={card.title}
                containerClassName="aspect-[4/3] w-full overflow-hidden bg-[#F4F8FC]"
                className={`w-full h-full object-cover ${
                  card.imagePosition === 'top' ? 'object-top' : 'object-center'
                } transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100`}
              />

              <div className="p-4 sm:p-5 lg:p-6 flex-1 flex flex-col justify-start text-start">
                <span className="font-en tabular-nums text-[12px] font-bold text-[#8B6918] mb-1">
                  {card.numberLabel}
                </span>
                <h3 className="text-[16px] sm:text-[17.5px] lg:text-[18px] font-extrabold text-[#161A8D] leading-[1.4] [text-wrap:balance]">
                  {card.title}
                </h3>
                <p className="mt-1.5 text-[13.5px] sm:text-[14px] text-[#5A657D] leading-[1.75]">
                  {card.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
