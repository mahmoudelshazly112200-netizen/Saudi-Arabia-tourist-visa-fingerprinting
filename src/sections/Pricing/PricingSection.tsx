import React from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { VISA_SERVICE_CONFIG } from '../../constants/brand';
import { PACKAGE_INCLUSIONS } from '../../constants/content';
import { formatEgpAmount } from '../../utils/formatters';
import { Button } from '../../components/ui/Button';

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="py-10 sm:py-20 lg:py-24 bg-[#FAF8F5] border-y border-[#E5EAF2]/80 scroll-mt-14 sm:scroll-mt-16"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Prominent White Pricing Card with Sky Blue Border */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-[#C5E5FF] shadow-[0_12px_36px_-10px_rgba(22,26,141,0.08)] p-5 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-x-10 md:gap-y-6 items-center">
            {/* 1. Price Header Block (Top on Mobile, Right Top on Desktop) */}
            <div className="md:col-span-5 md:row-start-1 text-center bg-[#F1F8FF]/65 md:bg-transparent rounded-2xl md:rounded-none p-4 md:p-0 border border-[#C5E5FF]/60 md:border-0 md:border-l md:border-l-[#E5EAF2] md:pl-8 md:self-end">
              <h2
                aria-label="سعر التأشيرة السياحية السعودية"
                className="text-lg sm:text-2xl font-extrabold text-[#161A8D] leading-[1.4]"
              >
                السعر
              </h2>

              <div
                dir="ltr"
                className="mt-3 md:mt-4 flex items-baseline justify-center gap-2 font-en"
              >
                <span className="text-[2.45rem] min-[375px]:text-[2.75rem] sm:text-[3.4rem] font-extrabold text-[#161A8D] tabular-nums leading-none">
                  {formatEgpAmount(VISA_SERVICE_CONFIG.pricePerPersonEgp)}
                </span>
                <span className="text-base sm:text-xl font-bold text-[#8B6918] tracking-wide">
                  {VISA_SERVICE_CONFIG.currencyCode}
                </span>
              </div>

              <p className="mt-2 text-xs sm:text-sm font-semibold text-[#5A657D] leading-[1.5]">
                للفرد الواحد
              </p>
            </div>

            {/* 2. Exact 6 Approved Inclusions Block (Middle on Mobile, Left Full Span on Desktop) */}
            <div className="md:col-span-7 md:row-span-2 md:row-start-1">
              <h3 className="text-base sm:text-xl font-extrabold text-[#161A8D] leading-[1.4] mb-4 sm:mb-5">
                ويشمل
              </h3>
              <ul className="space-y-3.5 sm:space-y-4">
                {PACKAGE_INCLUSIONS.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 sm:gap-3 text-[13.5px] min-[375px]:text-[14.5px] sm:text-base font-medium text-slate-800"
                  >
                    <CheckCircle2
                      className="w-4 h-4 sm:w-5 sm:h-5 text-[#161A8D] shrink-0 mt-1"
                      aria-hidden="true"
                    />
                    <span className="leading-[1.8]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Primary CTA Block (Bottom after inclusions on Mobile, Right Bottom on Desktop) */}
            <div className="md:col-span-5 md:row-start-2 pt-1 md:pt-1 md:border-l md:border-[#E5EAF2] md:pl-8 md:self-start">
              <Button
                to="/apply"
                variant="primary"
                size="lg"
                fullWidth
                className="rounded-xl min-h-[50px] sm:min-h-[52px]"
              >
                <span>ابدأ طلب التأشيرة</span>
                <ArrowLeft className="w-5 h-5 shrink-0" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
