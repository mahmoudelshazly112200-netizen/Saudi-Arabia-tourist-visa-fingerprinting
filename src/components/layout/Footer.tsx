import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import { CONTACT_CONFIG, VISA_SERVICE_CONFIG } from '../../constants/brand';
import { formatEgpAmount } from '../../utils/formatters';
import { NashkaLogo } from '../ui/NashkaLogo';

interface FooterProps {
  showPricingNote?: boolean;
}

export function Footer({ showPricingNote = true }: FooterProps) {
  return (
    <footer className="bg-[#10145F] text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 min-[390px]:px-5 sm:px-6 lg:px-8 pt-10 pb-20 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-7 sm:gap-9 pb-8 border-b border-white/10">
          {/* 1. Brand Identity */}
          <div className="lg:col-span-4">
            <div className="flex items-center">
              <Link
                to="/"
                aria-label="نشكا للسياحة — الصفحة الرئيسية"
                className="inline-flex items-center min-h-[44px] rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C5E5FF]"
              >
                <NashkaLogo variant="dark" size="md" />
              </Link>
            </div>

            <p className="mt-3.5 text-[length:var(--text-body)] font-normal text-[#C5E5FF] leading-[1.7] max-w-md">
              خدمة متخصصة لتجهيز طلبات التأشيرة السياحية السعودية وحجز موعد البصمة ومتابعة الطلب
              حتى الإصدار.
            </p>
            {showPricingNote && (
              <p className="mt-3 text-[length:var(--text-caption)] text-[#D5A43B] font-bold leading-[1.6] tabular-nums">
                السعر المعتمد: {formatEgpAmount(VISA_SERVICE_CONFIG.pricePerPersonEgp)}{' '}
                {VISA_SERVICE_CONFIG.currencyLabelAr} للفرد الواحد
              </p>
            )}
          </div>

          {/* 2. Customer Platform Links */}
          <div className="lg:col-span-2">
            <h3 className="text-[length:var(--text-h3)] font-bold text-white mb-3">روابط سريعة</h3>
            <ul className="space-y-1.5 md:space-y-2 text-[length:var(--text-caption)] text-[#C5E5FF]">
              <li>
                <Link
                  to="/"
                  className="hover:text-white transition-colors flex md:inline-block items-center min-h-[44px] md:min-h-0 py-1"
                >
                  صفحة التأشيرة السياحية
                </Link>
              </li>
              <li>
                <Link
                  to="/apply"
                  className="hover:text-white transition-colors flex md:inline-block items-center min-h-[44px] md:min-h-0 py-1"
                >
                  نموذج تقديم الطلب
                </Link>
              </li>
              <li>
                <Link
                  to="/track"
                  className="hover:text-white transition-colors flex md:inline-block items-center min-h-[44px] md:min-h-0 py-1"
                >
                  متابعة حالة الطلب
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="hover:text-white transition-colors flex md:inline-block items-center min-h-[44px] md:min-h-0 py-1"
                >
                  الأسئلة الشائعة
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Approved Contact Channels */}
          <div className="lg:col-span-3">
            <h3 className="text-[length:var(--text-h3)] font-bold text-white mb-3">
              قنوات التواصل
            </h3>
            <ul className="space-y-2.5 text-[length:var(--text-caption)]">
              <li>
                <a
                  href={CONTACT_CONFIG.getPhoneHref()}
                  className="flex items-center gap-2.5 text-[#C5E5FF] hover:text-white transition-colors min-h-[44px] md:min-h-[38px] px-3.5 py-2 md:p-0 rounded-xl md:rounded-none bg-white/5 md:bg-transparent border border-white/10 md:border-0"
                >
                  <Phone className="w-4 h-4 text-[#D5A43B] shrink-0" aria-hidden="true" />
                  <span>
                    هاتف الشركة:{' '}
                    <span className="font-en font-bold text-white tabular-nums" dir="ltr">
                      {CONTACT_CONFIG.companyPhoneDisplay}
                    </span>
                  </span>
                </a>
              </li>

              <li>
                <a
                  href={CONTACT_CONFIG.getWhatsappHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-[#C5E5FF] hover:text-white transition-colors min-h-[44px] md:min-h-[38px] px-3.5 py-2 md:p-0 rounded-xl md:rounded-none bg-white/5 md:bg-transparent border border-white/10 md:border-0"
                >
                  <MessageCircle className="w-4 h-4 text-[#D5A43B] shrink-0" aria-hidden="true" />
                  <span>
                    واتساب:{' '}
                    <span className="font-en font-bold text-white tabular-nums" dir="ltr">
                      {CONTACT_CONFIG.whatsappDisplay}
                    </span>
                  </span>
                </a>
              </li>

              <li>
                <a
                  href={`mailto:${CONTACT_CONFIG.email}`}
                  className="flex items-center gap-2.5 text-[#C5E5FF] hover:text-white transition-colors min-h-[44px] md:min-h-[38px] px-3.5 py-2 md:p-0 rounded-xl md:rounded-none bg-white/5 md:bg-transparent border border-white/10 md:border-0 min-w-0"
                >
                  <Mail className="w-4 h-4 text-[#D5A43B] shrink-0" aria-hidden="true" />
                  <span className="font-en text-right truncate" dir="ltr">
                    {CONTACT_CONFIG.email}
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* 4. Service & Privacy Policies */}
          <div className="lg:col-span-3">
            <h3 className="text-[length:var(--text-h3)] font-bold text-white mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D5A43B] shrink-0" aria-hidden="true" />
              <span>السياسات والضوابط</span>
            </h3>
            <ul className="space-y-2 text-[length:var(--text-caption)] text-[#C5E5FF] leading-[1.6]">
              <li>تُستخدم بيانات ومستندات المتقدم حصريًا لإجراءات تجهيز التأشيرة وحجز البصمة.</li>
              <li>تخضع الموافقة النهائية لإصدار التأشيرة للجهات المختصة بالمملكة العربية السعودية.</li>
              <li>
                <Link
                  to="/faq"
                  className="text-[#D5A43B] hover:text-white font-bold inline-flex items-center min-h-[40px] md:min-h-0 transition-colors"
                >
                  الاطلاع على ضوابط وسياسة الخدمة
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-5 sm:pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[length:var(--text-caption)] text-[#C5E5FF]/85 leading-[1.7]">
          <p className="tabular-nums">
            {CONTACT_CONFIG.brandNameAr} ·{' '}
            <span className="font-en font-bold text-white">{CONTACT_CONFIG.brandNameEn}</span> ·
            جميع الحقوق محفوظة © 2026
          </p>
          <p>تجهيز احترافي ومتابعة مستمرة لطلبات التأشيرة السياحية السعودية.</p>
        </div>
      </div>
    </footer>
  );
}
