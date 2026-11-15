import React, { useState } from 'react';
import { ChevronDown, MessageCircle, Phone } from 'lucide-react';
import { CONTACT_CONFIG } from '../../constants/brand';
import { FAQ_ITEMS } from '../../constants/content';
import { SectionHeader } from '../../components/common/SectionHeader';
import { Button } from '../../components/ui/Button';

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0]?.id || null);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="py-10 sm:py-20 lg:py-24 bg-[#FAF8F5] border-y border-[#E5EAF2]/80 scroll-mt-14 sm:scroll-mt-16"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          kicker="إجابات سريعة ومباشرة"
          title="الأسئلة الشائعة"
          description="أبرز الاستفسارات حول التأشيرة والتقديم."
          align="center"
        />

        {/* 2 Columns on Desktop, 1 Column on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 items-start">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            const panelId = `${item.id}-panel`;
            const buttonId = `${item.id}-button`;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border transition-colors overflow-hidden ${
                  isOpen ? 'border-[#C5E5FF] shadow-[var(--shadow-card)]' : 'border-[#E8EDF4]'
                }`}
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleItem(item.id)}
                    className="w-full min-h-[54px] sm:min-h-[60px] px-4 sm:px-6 py-3.5 sm:py-4 text-right flex items-center justify-between gap-3 sm:gap-4 hover:bg-[#F4F8FC] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#161A8D]"
                  >
                    <span className="text-[14px] min-[375px]:text-[15px] sm:text-base font-bold text-[#161A8D] leading-[1.6]">
                      {item.question}
                    </span>
                    <span
                      className={`w-8 h-8 rounded-full bg-[#F4F8FC] text-[#161A8D] flex items-center justify-center shrink-0 transition-colors border ${
                        isOpen ? 'border-[#D6AD55]' : 'border-[#C5E5FF]'
                      }`}
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </span>
                  </button>
                </h3>

                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="px-4 sm:px-6 pb-5 sm:pb-6 pt-3.5 border-t border-slate-100 text-[13.5px] sm:text-[15px] text-[#5A657D] leading-[1.9]"
                  >
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Support Prompt & Approved Actions */}
        <div className="mt-7 sm:mt-10 pt-2 sm:pt-4 text-center">
          <p className="text-sm sm:text-base font-bold text-[#161A8D] mb-3.5 sm:mb-4">
            هل لديك استفسار إضافي؟ تواصل معنا مباشرة.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3">
            <Button
              href={CONTACT_CONFIG.getWhatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              size="md"
              className="rounded-xl px-6 min-h-[48px]"
            >
              <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>تواصل معنا عبر واتساب</span>
            </Button>

            <Button
              href={CONTACT_CONFIG.getPhoneHref()}
              variant="outline"
              size="md"
              className="rounded-xl px-6 min-h-[48px]"
            >
              <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>طلب اتصال مستشار</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
