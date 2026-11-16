import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, MessageCircle, Phone } from 'lucide-react';
import { CustomerLayout } from '../../components/layout/CustomerLayout';
import { FaqAccordion } from '../../components/faq/FaqAccordion';
import { Button } from '../../components/ui/Button';
import { CONTACT_CONFIG } from '../../constants/brand';
import { FAQ_ITEMS } from '../../constants/content';
import { usePageMeta } from '../../hooks/usePageMeta';

export function FaqPage() {
  usePageMeta({
    title: 'الأسئلة الشائعة حول التأشيرة السياحية السعودية | نشكا للسياحة',
    description:
      'إجابات تفاعلية كاملة عن تكلفة التأشيرة السياحية السعودية (9,500 ج.م)، المستندات المطلوبة، موعد البصمة، وخطوات التقديم مع نشكا للسياحة.',
    robots: 'index, follow',
    canonicalPath: '/faq',
  });

  return (
    <CustomerLayout>
      <section className="bg-[#171C91] text-white py-10 sm:py-14">
        <div className="max-w-5xl mx-auto px-4 min-[390px]:px-5 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[length:var(--text-caption)] font-bold text-[#C5E5FF] hover:text-white mb-4 min-h-[44px]"
          >
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>العودة إلى الصفحة الرئيسية</span>
          </Link>
          <h1 className="text-[length:var(--text-h1)] font-bold leading-tight">
            الأسئلة الشائعة عن التأشيرة السياحية السعودية
          </h1>
          <p className="mt-3 text-[length:var(--text-body)] font-normal text-[#C5E5FF] leading-relaxed max-w-2xl">
            ابحث أو صفِّ حسب الموضوع للوصول السريع إلى كل ما يخص المستندات، التكلفة المعتمدة،
            ومواعيد البصمة لدى مركز تساهيل.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-14 bg-[#F3F7FC]">
        <div className="max-w-5xl mx-auto px-4 min-[390px]:px-5 sm:px-6 lg:px-8 space-y-8">
          <FaqAccordion items={FAQ_ITEMS} enableFiltering columns={1} />

          <div className="rounded-2xl bg-white border border-[#E6ECF4] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <h2 className="text-[length:var(--text-h3)] font-bold text-[#17213B]">
                جاهز لبدء طلب التأشيرة السياحية الآن؟
              </h2>
              <p className="mt-1 text-[length:var(--text-caption)] font-normal text-[#68758A]">
                سجّل بياناتك وارفع صورة جواز السفر والصورة الشخصية في دقائق، أو تواصل مع مستشارينا.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 shrink-0">
              <Button to="/apply" variant="primary" size="md">
                <span>ابدأ الطلب الآن</span>
                <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
              </Button>
              <Button
                href={CONTACT_CONFIG.getWhatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                size="md"
              >
                <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>تواصل واتساب</span>
              </Button>
              <Button
                href={CONTACT_CONFIG.getPhoneHref()}
                variant="outline"
                size="md"
              >
                <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="font-en tabular-nums" dir="ltr">
                  {CONTACT_CONFIG.companyPhoneDisplay}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </CustomerLayout>
  );
}
