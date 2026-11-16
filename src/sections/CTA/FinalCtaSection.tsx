import React from 'react';
import { ArrowLeft, MessageCircle, Phone } from 'lucide-react';
import { CONTACT_CONFIG } from '../../constants/brand';
import { Button } from '../../components/ui/Button';

export function FinalCtaSection() {
  return (
    <section className="py-12 min-[390px]:py-14 lg:py-20 bg-[#F3F7FC]">
      <div className="max-w-7xl mx-auto px-4 min-[390px]:px-5 sm:px-6 lg:px-8">
        <div className="rounded-2xl sm:rounded-3xl bg-[#171C91] text-white p-5 min-[390px]:p-6 sm:p-9 lg:p-11 shadow-[0_18px_44px_-12px_rgba(23,28,145,0.28)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-center">
            {/* 1. Heading & Description Block */}
            <div className="lg:col-span-7 lg:row-start-1 text-center sm:text-right">
              <p className="inline-flex items-center justify-center sm:justify-start gap-2.5 text-[length:var(--text-caption)] font-bold leading-[1.45] text-[#D5A43B]">
                <span className="w-6 h-[2px] bg-[#D5A43B] rounded-full shrink-0" aria-hidden="true" />
                <span>ابدأ رحلتك بسهولة</span>
              </p>
              <h2 className="mt-2 text-[length:var(--text-h2)] font-bold leading-[1.3] text-white [text-wrap:balance]">
                جاهز لرحلتك القادمة؟
              </h2>
              <p className="mt-2.5 text-[15px] leading-[32.9px] font-normal text-[#C5E5FF] max-w-xl mx-auto sm:mx-0 [text-wrap:balance]">
                سجّل بياناتك الآن عبر صفحة التقديم لنبدأ تجهيز ملفك ومتابعة طلبك حتى الإصدار.
              </p>
            </div>

            {/* 2. Action Buttons Block */}
            <div className="lg:col-span-5 lg:row-span-2 lg:row-start-1 flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center lg:justify-end gap-3">
              <Button
                to="/apply"
                variant="white"
                size="lg"
                className="rounded-xl px-5 min-h-[48px] text-[14px] font-bold"
              >
                <span>الانتقال لنموذج التقديم</span>
                <ArrowLeft className="w-4 h-4 text-[#D5A43B] shrink-0" aria-hidden="true" />
              </Button>

              <a
                href={CONTACT_CONFIG.getWhatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[48px] px-5 py-3 rounded-xl bg-[#004AAD] hover:bg-[#10145F] border border-white/25 text-white text-[14px] sm:text-[13px] font-bold inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <MessageCircle className="w-[18px] h-[18px] text-[#D5A43B] shrink-0" aria-hidden="true" />
                <span>تواصل عبر واتساب</span>
              </a>
            </div>

            {/* 3. Approved Contact Numbers */}
            <div className="lg:col-span-7 lg:row-start-2 pt-4 sm:pt-5 border-t border-white/15 flex flex-col sm:flex-row sm:flex-wrap items-center sm:items-center justify-center sm:justify-start gap-2 sm:gap-x-7 sm:gap-y-2.5 text-[length:var(--text-caption)] text-[#C5E5FF]">
              <a
                href={CONTACT_CONFIG.getPhoneHref()}
                className="inline-flex items-center justify-center sm:justify-start gap-2 hover:text-white transition-colors min-h-[44px] px-2 sm:px-0"
              >
                <Phone className="w-4 h-4 text-[#D5A43B] shrink-0" aria-hidden="true" />
                <span>هاتف الشركة:</span>
                <span className="font-en font-bold text-white tabular-nums" dir="ltr">
                  {CONTACT_CONFIG.companyPhoneDisplay}
                </span>
              </a>

              <a
                href={CONTACT_CONFIG.getWhatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center sm:justify-start gap-2 hover:text-white transition-colors min-h-[44px] px-2 sm:px-0"
              >
                <MessageCircle className="w-4 h-4 text-[#D5A43B] shrink-0" aria-hidden="true" />
                <span>واتساب الاستفسارات:</span>
                <span className="font-en font-bold text-white tabular-nums" dir="ltr">
                  {CONTACT_CONFIG.whatsappDisplay}
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
