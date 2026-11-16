import React from 'react';
import { ArrowLeft, MessageCircle, Phone } from 'lucide-react';
import { CONTACT_CONFIG } from '../../constants/brand';
import { Button } from '../../components/ui/Button';

export function FinalCtaSection() {
  return (
    <section className="py-11 sm:py-16 bg-[#F4F8FC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl sm:rounded-3xl bg-[#161A8D] text-white p-5 sm:p-9 lg:p-11 shadow-[0_18px_44px_-12px_rgba(22,26,141,0.28)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-center">
            {/* 1. Heading & Description Block */}
            <div className="lg:col-span-7 lg:row-start-1 text-center sm:text-right">
              <p className="text-[13px] sm:text-sm font-bold leading-[1.45] text-[#D6AD55]">
                ابدأ رحلتك بسهولة
              </p>
              <h2 className="mt-2 text-[1.5rem] sm:text-[1.875rem] lg:text-[2.125rem] font-extrabold leading-[1.3] text-white [text-wrap:balance]">
                جاهز لبدء طلب تأشيرتك؟
              </h2>
              <p className="mt-2.5 text-[15px] leading-[32.9px] text-[#C5E5FF] max-w-xl mx-auto sm:mx-0 [text-wrap:balance]">
                سجّل بياناتك الآن عبر صفحة التقديم لنبدأ تجهيز ملفك ومتابعة طلبك حتى الإصدار.
              </p>
            </div>

            {/* 2. Action Buttons Block (Never Gold as Primary Button) */}
            <div className="lg:col-span-5 lg:row-span-2 lg:row-start-1 flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center lg:justify-end gap-3">
              <Button
                to="/apply"
                variant="white"
                size="lg"
                className="rounded-xl px-5 min-h-[48px] text-[14px] font-extrabold"
              >
                <span>الانتقال لنموذج التقديم</span>
                <ArrowLeft className="w-4 h-4 text-[#D6AD55] shrink-0" aria-hidden="true" />
              </Button>

              <a
                href={CONTACT_CONFIG.getWhatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[48px] px-5 py-3 rounded-xl bg-[#004AAD] hover:bg-[#10136B] border border-white/25 text-white text-[13px] font-bold inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <MessageCircle className="w-[18px] h-[18px] text-[#D6AD55] shrink-0" aria-hidden="true" />
                <span>تواصل عبر واتساب</span>
              </a>
            </div>

            {/* 3. Approved Contact Numbers */}
            <div className="lg:col-span-7 lg:row-start-2 pt-4 sm:pt-5 border-t border-white/15 flex flex-col sm:flex-row sm:flex-wrap items-center sm:items-center justify-center sm:justify-start gap-2 sm:gap-x-7 sm:gap-y-2.5 text-sm text-[#C5E5FF]">
              <a
                href={CONTACT_CONFIG.getPhoneHref()}
                className="inline-flex items-center justify-center sm:justify-start gap-2 hover:text-white transition-colors min-h-[40px] px-2 sm:px-0"
              >
                <Phone className="w-4 h-4 text-[#D6AD55] shrink-0" aria-hidden="true" />
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
                <MessageCircle className="w-4 h-4 text-[#D6AD55] shrink-0" aria-hidden="true" />
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
