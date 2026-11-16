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
      className="py-11 sm:py-14 lg:py-20 bg-white border-b border-[#E8EDF4] scroll-mt-16"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E8EDF4] shadow-[0_12px_36px_-10px_rgba(22,26,141,0.08)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* 1. Quiet Sky-Blue Highlighted Price + Royal Blue CTA Block (Always TOP on Mobile, Right Side on RTL Desktop) */}
            <div className="lg:col-span-5 bg-[#C5E5FF]/35 border-b lg:border-b-0 lg:border-l border-[#E8EDF4] p-4 sm:p-8 lg:p-9 flex flex-col justify-between text-center">
              <div>
                <p className="text-[13px] sm:text-sm font-bold leading-[1.45] text-[#8B6918]">
                  التكلفة المعتمدة للباقة
                </p>
                <h2
                  aria-label="سعر التأشيرة السياحية السعودية"
                  className="mt-1 text-[1.375rem] sm:text-[1.625rem] font-extrabold text-[#161A8D] leading-[1.3]"
                >
                  السعر الإجمالي للفرد
                </h2>

                <div
                  dir="ltr"
                  className="mt-4 sm:mt-5 inline-flex items-baseline justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-white border border-[#C5E5FF] shadow-[var(--shadow-card)] font-en"
                >
                  <span className="text-[2rem] min-[390px]:text-[2.125rem] sm:text-[3.125rem] font-extrabold text-[#161A8D] tabular-nums leading-none">
                    {formatEgpAmount(VISA_SERVICE_CONFIG.pricePerPersonEgp)}
                  </span>
                  <span className="text-base sm:text-xl font-extrabold text-[#6B4F12] tracking-wide">
                    {VISA_SERVICE_CONFIG.currencyCode}
                  </span>
                </div>

                <p className="mt-2.5 text-[14px] sm:text-[15px] font-bold leading-[1.5] text-[#0B0B0D]">
                  للفرد الواحد شاملة رسوم الخدمة
                </p>
              </div>

              <div className="mt-4 sm:mt-7">
                <Button
                  to="/apply"
                  variant="primary"
                  size="lg"
                  fullWidth
                  className="rounded-xl min-h-[48px] text-[15px] sm:text-base font-extrabold shadow-[0_12px_26px_-8px_rgba(22,26,141,0.32)]"
                >
                  <span>ابدأ طلب التأشيرة</span>
                  <ArrowLeft className="w-5 h-5 text-[#D6AD55] shrink-0" aria-hidden="true" />
                </Button>
              </div>
            </div>

            {/* 2. Exact 6 Approved Inclusions Block (Below Price+CTA on Mobile, Left Side on RTL Desktop) */}
            <div className="lg:col-span-7 p-4 sm:p-8 lg:p-9 bg-white flex flex-col justify-center">
              <h3 className="text-[17px] sm:text-[19px] font-extrabold text-[#0B0B0D] leading-[1.35] mb-3.5 sm:mb-4">
                ويشمل
              </h3>
              <ul className="space-y-2.5 sm:space-y-3.5">
                {PACKAGE_INCLUSIONS.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 sm:gap-3 text-[14px] sm:text-[15.5px] font-medium text-[#334155]"
                  >
                    <CheckCircle2
                      className="w-[18px] h-[18px] sm:w-5 sm:h-5 text-[#004AAD] shrink-0 mt-0.5 sm:mt-1"
                      aria-hidden="true"
                    />
                    <span className="leading-[1.6]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
