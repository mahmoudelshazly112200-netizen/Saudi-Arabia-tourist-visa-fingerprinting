import React from 'react';
import { MapPin } from 'lucide-react';
import { JOURNEY_DESTINATIONS } from '../../constants/content';
import { SectionHeader } from '../../components/common/SectionHeader';
import { ResilientImage } from '../../components/ui/ResilientImage';

export function JourneySection() {
  return (
    <section id="journey" className="py-11 sm:py-14 lg:py-20 bg-[#F4F8FC] border-b border-[#E8EDF4] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          kicker="معالم وأماكن بارزة"
          title="رحلتك إلى السعودية"
          description="أبرز المدن والمعالم التي بانتظارك في المملكة."
          align="center"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6 items-stretch">
          {JOURNEY_DESTINATIONS.map((dest) => (
            <article
              key={dest.id}
              className="group bg-white rounded-2xl border border-[#E8EDF4] shadow-[var(--shadow-card)] hover:border-[#C5E5FF] hover:shadow-[var(--shadow-card-hover)] transition-[box-shadow,border-color] duration-200 overflow-hidden flex flex-col"
            >
              <ResilientImage
                src={dest.imageUrl}
                alt={`${dest.city} — ${dest.landmark}`}
                fallbackLabel={dest.city}
                loading="eager"
                containerClassName="aspect-[16/10] w-full overflow-hidden bg-[#F4F8FC] border-b border-[#E8EDF4]"
                className="w-full h-full object-cover transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
              <div className="p-4 sm:p-5 text-center flex-1 flex flex-col items-center justify-center">
                <h3 className="text-[17px] sm:text-[18px] font-bold text-[#0B0B0D] leading-[1.35]">
                  {dest.city}
                </h3>
                <p className="mt-1.5 inline-flex items-center justify-center gap-1.5 text-[14px] sm:text-[14.5px] font-medium text-[#475569] leading-[1.55]">
                  <MapPin className="w-4 h-4 text-[#D6AD55] shrink-0" aria-hidden="true" />
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
