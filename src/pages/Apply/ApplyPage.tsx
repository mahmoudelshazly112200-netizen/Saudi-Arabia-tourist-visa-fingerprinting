import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Info } from 'lucide-react';
import { CustomerLayout } from '../../components/layout/CustomerLayout';
import { VisaApplicationForm } from '../../forms/VisaApplicationForm';
import { usePageMeta } from '../../hooks/usePageMeta';

export function ApplyPage() {
  usePageMeta({
    title: 'تقديم طلب التأشيرة السياحية السعودية | نشكا للسياحة',
    description:
      'قدّم طلب التأشيرة السياحية السعودية أونلاين مع شركة نشكا للسياحة عبر رفع جواز السفر والصورة الشخصية واستلام رقم مرجع فوري.',
    robots: 'index, follow',
    canonicalPath: '/apply',
  });

  return (
    <CustomerLayout showPricingInFooter={false}>
      {/* Compact Brand Header */}
      <section className="bg-[#161A8D] text-white py-7 sm:py-10 lg:py-12">
        <div className="max-w-[1120px] mx-auto px-3 min-[375px]:px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#C5E5FF] hover:text-white mb-3.5 min-h-[44px]"
          >
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>العودة إلى صفحة التأشيرة السياحية</span>
          </Link>

          <h1 className="text-[clamp(1.375rem,2.5vw,2.125rem)] font-extrabold leading-tight">
            نموذج التقديم على التأشيرة السياحية السعودية
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-[#C5E5FF] leading-relaxed max-w-2xl">
            أدخل بياناتك وارفع المستندات المطلوبة لبدء تجهيز طلبك وحجز موعد البصمة لدى مركز تساهيل.
          </p>
        </div>
      </section>

      {/* Main Wizard Section */}
      <section className="py-6 sm:py-10 lg:py-12 bg-[#F4F8FC]">
        <div className="max-w-[1120px] mx-auto px-3 min-[375px]:px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-6">
          {/* Concise Single Pre-Submission Notice */}
          <aside
            aria-label="معلومات أساسية قبل التقديم"
            className="rounded-2xl border border-[#D6AD55]/50 bg-white p-4 sm:p-5 flex items-start gap-3"
          >
            <Info className="w-5 h-5 text-[#D6AD55] shrink-0 mt-0.5" aria-hidden="true" />
            <ul className="space-y-1.5 text-xs sm:text-sm text-[#334155] leading-relaxed">
              <li>
                <strong className="text-[#0B0B0D]">المطلوب لبدء الطلب:</strong> جواز سفر ساري وصورة شخصية حديثة.
              </li>
              <li>
                <strong className="text-[#0B0B0D]">كشف الحساب البنكي:</strong> يُقدّم أثناء موعد البصمة فقط.
              </li>
              <li>
                <strong className="text-[#0B0B0D]">الحد الأدنى للرصيد المطلوب:</strong> 50,000 جنيه مصري.
              </li>
            </ul>
          </aside>

          <VisaApplicationForm />
        </div>
      </section>
    </CustomerLayout>
  );
}
