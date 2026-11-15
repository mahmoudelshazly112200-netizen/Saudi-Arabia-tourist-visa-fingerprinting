import React from 'react';
import { MapPin } from 'lucide-react';
import { JOURNEY_DESTINATIONS } from '../../constants/content';
import { SectionHeader } from '../../components/common/SectionHeader';
import { ResilientImage } from '../../components/ui/ResilientImage';

export function JourneySection() {
  return (
    <section id="journey" className="py-10 sm:py-20 lg:py-24 bg-white scroll-mt-14 sm:scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          kicker="معالم وأماكن بارزة"
          title="رحلتك إلى السعودية"
          description="أبرز المدن والمعالم التي بانتظارك في المملكة."
          align="center"
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {JOURNEY_DESTINATIONS.map((dest) => (
            <article
              key={dest.id}
              className="bg-white rounded-2xl border border-[#C5E5FF] shadow-[var(--shadow-card)] hover:border-[#9FD3FF] hover:shadow-[var(--shadow-card-hover)] transition-[box-shadow,border-color] duration-200 overflow-hidden flex flex-col"
            >
              <ResilientImage
                src={dest.imageUrl}
                alt={`${dest.city} — ${dest.landmark}`}
                fallbackLabel={dest.city}
                containerClassName="aspect-[4/3] w-full overflow-hidden bg-[#0D105A]"
                className="w-full h-full object-cover transition-transform duration-200 hover:scale-[1.02]"
              />
              <div className="p-3.5 sm:p-5 text-center flex-1 flex flex-col items-center justify-center">
                <h3 className="text-[15px] min-[375px]:text-base sm:text-lg lg:text-xl font-bold text-[#161A8D] leading-[1.45] whitespace-nowrap">
                  {dest.city}
                </h3>
                <p className="mt-1.5 sm:mt-2 inline-flex items-center gap-1 sm:gap-1.5 text-[12px] min-[375px]:text-[13px] sm:text-sm font-medium text-[#5A657D] leading-[1.6] whitespace-nowrap">
                  <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#C9A13B] shrink-0" aria-hidden="true" />
                  <span>{dest.landmark}</span>
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
