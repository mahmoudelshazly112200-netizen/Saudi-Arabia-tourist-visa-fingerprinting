import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Phone } from 'lucide-react';
import { CONTACT_CONFIG } from '../../constants/brand';
import { FAQ_ITEMS } from '../../constants/content';
import { SectionHeader } from '../../components/common/SectionHeader';
import { FaqAccordion } from '../../components/faq/FaqAccordion';
import { Button } from '../../components/ui/Button';

export function FaqSection() {
  return (
    <section
      id="faq"
      className="py-12 min-[390px]:py-14 lg:py-20 bg-white border-b border-[#E6ECF4] scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 min-[390px]:px-5 sm:px-6 lg:px-8">
        <SectionHeader
          kicker="إجابات سريعة ومباشرة"
          title="الأسئلة الشائعة"
          description="أبرز الاستفسارات حول التأشيرة والتقديم."
          align="center"
        />

        <FaqAccordion items={FAQ_ITEMS} columns={2} enableFiltering={false} />

        {/* Bottom Support Prompt & Interactive FAQ Page Link */}
        <div className="mt-7 sm:mt-9 pt-2 text-center">
          <p className="text-[length:var(--text-body)] font-bold leading-[1.55] text-[#17213B] mb-3.5">
            هل لديك استفسار إضافي؟ تواصل معنا مباشرة.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3">
            <Button
              href={CONTACT_CONFIG.getWhatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              size="md"
              className="rounded-xl px-5 min-h-[48px]"
            >
              <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>تواصل معنا عبر واتساب</span>
            </Button>

            <Button
              href={CONTACT_CONFIG.getPhoneHref()}
              variant="outline"
              size="md"
              className="rounded-xl px-5 min-h-[48px]"
            >
              <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>طلب اتصال مستشار</span>
            </Button>

            <Link
              to="/faq"
              className="min-h-[48px] px-5 py-2.5 rounded-xl bg-white border border-[#E6ECF4] hover:border-[#004AAD] text-[length:var(--text-btn)] font-bold text-[#004AAD] inline-flex items-center justify-center gap-2 transition-colors"
            >
              <span>البحث في جميع الأسئلة الشائعة</span>
              <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
