import React from 'react';
import { ArrowLeft, MessageCircle, Phone } from 'lucide-react';
import { CONTACT_CONFIG } from '../../constants/brand';
import { Button } from '../../components/ui/Button';

export function FinalCtaSection() {
  return (
    <section className="py-10 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl sm:rounded-3xl bg-[#161A8D] text-white p-5 min-[375px]:p-6 sm:p-10 lg:p-12 shadow-[0_18px_44px_-12px_rgba(22,26,141,0.25)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-7 lg:gap-8 items-center">
            {/* 1. Heading & Description Block (Top on Mobile, Right Top on Desktop) */}
            <div className="lg:col-span-7 lg:row-start-1 text-center sm:text-right">
              <p className="text-xs sm:text-sm font-bold leading-relaxed text-[#C9A13B]">
                ابدأ رحلتك بسهولة
              </p>
              <h2 className="mt-2.5 sm:mt-3 text-[clamp(1.35rem,5.8vw,1.65rem)] sm:text-3xl lg:text-[2.25rem] font-extrabold leading-[1.4] sm:leading-[1.35] text-white [text-wrap:balance]">
                جاهز لبدء طلب تأشيرتك؟
              </h2>
              <p className="mt-3 sm:mt-4 text-[13.5px] sm:text-base text-[#C5E5FF] leading-[1.85] max-w-xl mx-auto sm:mx-0 [text-wrap:balance]">
                سجّل بياناتك الآن عبر صفحة التقديم لنبدأ تجهيز ملفك ومتابعة طلبك حتى الإصدار.
              </p>
            </div>

            {/* 2. Action Buttons Block (Middle on Mobile for immediate action, Left Full Span on Desktop) */}
            <div className="lg:col-span-5 lg:row-span-2 lg:row-start-1 flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center lg:justify-end gap-3 sm:gap-3.5">
              <Button
                to="/apply"
                variant="gold"
                size="lg"
                className="rounded-xl px-6 min-h-[50px] sm:min-h-[52px]"
              >
                <span>الانتقال لنموذج التقديم</span>
                <ArrowLeft className="w-5 h-5 shrink-0" aria-hidden="true" />
              </Button>

              <a
                href={CONTACT_CONFIG.getWhatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[48px] sm:min-h-[52px] px-6 py-3 sm:py-3.5 rounded-xl bg-white/10 hover:bg-white/18 border border-white/25 text-white text-sm sm:text-base font-semibold inline-flex items-center justify-center gap-2.5 whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <MessageCircle className="w-5 h-5 text-[#C9A13B] shrink-0" aria-hidden="true" />
                <span>تواصل عبر واتساب</span>
              </a>
            </div>

            {/* 3. Approved Contact Numbers (Bottom separated strip on Mobile, Right Bottom on Desktop) */}
            <div className="lg:col-span-7 lg:row-start-2 pt-4 sm:pt-5 border-t border-white/15 flex flex-col sm:flex-row sm:flex-wrap items-center sm:items-center justify-center sm:justify-start gap-2 sm:gap-x-7 sm:gap-y-2.5 text-xs sm:text-sm text-[#C5E5FF]">
              <a
                href={CONTACT_CONFIG.getPhoneHref()}
                className="inline-flex items-center justify-center sm:justify-start gap-2 hover:text-white transition-colors min-h-[40px] px-2 sm:px-0"
              >
                <Phone className="w-4 h-4 text-[#C9A13B] shrink-0" aria-hidden="true" />
                <span>هاتف الشركة:</span>
                <span className="font-en font-bold text-white tabular-nums" dir="ltr">
                  {CONTACT_CONFIG.companyPhoneDisplay}
                </span>
              </a>

              <a
                href={CONTACT_CONFIG.getWhatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center sm:justify-start gap-2 hover:text-white transition-colors min-h-[40px] px-2 sm:px-0"
              >
                <MessageCircle className="w-4 h-4 text-[#C9A13B] shrink-0" aria-hidden="true" />
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
