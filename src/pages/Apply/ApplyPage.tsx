import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { VISA_SERVICE_CONFIG } from '../../constants/brand';
import { formatEgpAmount } from '../../utils/formatters';
import { CustomerLayout } from '../../components/layout/CustomerLayout';
import { VisaApplicationForm } from '../../forms/VisaApplicationForm';
import { usePageMeta } from '../../hooks/usePageMeta';

export function ApplyPage() {
  usePageMeta({
    title: 'تقديم طلب التأشيرة السياحية السعودية | نشكا للسياحة',
    robots: 'index, follow',
  });

  return (
    <CustomerLayout>
      {/* Page Header */}
      <section className="bg-[#161A8D] text-white py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#C5E5FF] hover:text-white mb-5 min-h-[44px]"
          >
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>العودة إلى صفحة التأشيرة السياحية</span>
          </Link>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">
            نموذج التقديم على التأشيرة السياحية السعودية
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#C5E5FF] leading-relaxed max-w-2xl">
            سجّل بياناتك وارفع صورة جواز السفر الساري والصورة الشخصية الحديثة لبدء تجهيز ملفك وحجز
            موعد البصمة لدى مركز تساهيل. السعر المعتمد للباقة هو{' '}
            <strong className="text-[#C9A13B] tabular-nums">
              {formatEgpAmount(VISA_SERVICE_CONFIG.pricePerPersonEgp)}{' '}
              {VISA_SERVICE_CONFIG.currencyLabelAr} للفرد الواحد
            </strong>
            .
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-[#C5E5FF]">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#C9A13B] shrink-0" aria-hidden="true" />
              <span>جواز سفر ساري + صورة شخصية حديثة لبدء الطلب</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#C9A13B] shrink-0" aria-hidden="true" />
              <span>كشف الحساب البنكي يُطلب فقط أثناء موعد البصمة</span>
            </span>
          </div>
        </div>
      </section>

      {/* Main Form Container */}
      <section className="py-10 sm:py-14 bg-[#FAF8F5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <VisaApplicationForm />
        </div>
      </section>
    </CustomerLayout>
  );
}
