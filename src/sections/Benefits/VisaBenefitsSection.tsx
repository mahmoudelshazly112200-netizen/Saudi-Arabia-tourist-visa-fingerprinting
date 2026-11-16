import React from 'react';
import { VISA_BENEFIT_CARDS } from '../../constants/content';
import { SectionHeader } from '../../components/common/SectionHeader';
import { ResilientImage } from '../../components/ui/ResilientImage';
import { NashkaCardIndex } from '../../components/ui/NashkaCardIndex';

export function VisaBenefitsSection() {
  const featuredCards = VISA_BENEFIT_CARDS.filter((card) => card.featured);
  const secondaryCards = VISA_BENEFIT_CARDS.filter((card) => !card.featured);

  return (
    <section
      id="benefits"
      className="py-12 min-[390px]:py-14 lg:py-20 bg-white border-b border-[#E6ECF4] scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 min-[390px]:px-5 sm:px-6 lg:px-8">
        <SectionHeader
          kicker="مميزات التأشيرة السياحية"
          title="مميزات التأشيرة"
          description="اكتشف المملكة، واستمتع برحلة تجمع بين العمرة والسياحة وزيارة الأقارب."
          align="center"
        />

        {/* Row 1: Two Featured Photographic Bento Cards (01 & 02) */}
        <div className="nashka-grid-2 mb-4 sm:mb-5 lg:mb-6 items-stretch">
          {featuredCards.map((card, idx) => {
            const positionClass =
              card.imagePosition === 'top' ? 'object-top' : 'object-center';
            const shape = idx % 2 === 0 ? 'arc-start' : 'arc-end';

            return (
              <article
                key={card.id}
                data-nashka-shape={shape}
                className="group nashka-card nashka-card--media nashka-card--featured-media h-full"
              >
                <NashkaCardIndex numberLabel={card.numberLabel} />

                <ResilientImage
                  src={card.imageUrl}
                  alt={card.imageAlt}
                  fallbackLabel={card.title}
                  loading="eager"
                  containerClassName="nashka-card-featured-img-wrap"
                  className={`w-full h-full object-cover ${positionClass} transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100`}
                />

                <div className="nashka-card-featured-body">
                  <h3 className="nashka-card-title">{card.title}</h3>
                  <p className="nashka-card-desc mt-2">{card.description}</p>
                  <span
                    className="nashka-card-signature nashka-card-signature--inline mt-3.5"
                    aria-hidden="true"
                  />
                </div>
              </article>
            );
          })}
        </div>

        {/* Row 2: Four Photographic Cards (1-col horizontal Mobile -> 2-col uniform Tablet -> 4-col Desktop) */}
        <div className="nashka-grid-4 items-stretch">
          {secondaryCards.map((card, idx) => {
            const positionClass =
              card.imagePosition === 'top' ? 'object-top' : 'object-center';
            const shape = idx % 2 === 0 ? 'arc-end' : 'arc-start';

            return (
              <article
                key={card.id}
                data-nashka-shape={shape}
                className="group nashka-card nashka-card--media nashka-card--bento-media h-full"
              >
                <NashkaCardIndex numberLabel={card.numberLabel} />

                <ResilientImage
                  src={card.imageUrl}
                  alt={card.imageAlt}
                  fallbackLabel={card.title}
                  loading="eager"
                  containerClassName="nashka-card-bento-img-wrap"
                  className={`w-full h-full object-cover ${positionClass} transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100`}
                />

                <div className="nashka-card-bento-body">
                  <h3 className="nashka-card-title">{card.title}</h3>
                  <p className="nashka-card-desc mt-1.5">{card.description}</p>
                  <div className="mt-auto pt-3 w-full flex">
                    <span
                      className="nashka-card-signature nashka-card-signature--inline"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
