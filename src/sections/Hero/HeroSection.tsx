import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import { GENERATED_IMAGES } from '../../constants/content';

export function HeroSection() {
  const [imageError, setImageError] = useState(false);

  return (
    <section
      aria-label="التأشيرة السياحية السعودية"
      className="nashka-hero border-b border-[#E5EAF2]"
    >
      {/* Subtle Ambient Architectural Background Accent */}
      <div className="nashka-hero-ambient pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="nashka-hero-grid">
          {/* Editorial Copy & Primary CTA */}
          <div className="nashka-hero-content">
            <div className="nashka-hero-kicker">
              <span className="w-7 h-[2px] bg-[#C9A13B] rounded-full shrink-0" aria-hidden="true" />
              <span>التأشيرة السياحية السعودية</span>
            </div>

            <h1 className="nashka-hero-h1 text-[#161A8D] tracking-tight">
              <span className="nashka-hero-line1">رحلتك إلى السعودية</span>{' '}
              <span className="nashka-hero-line2">تبدأ بخطوة</span>
            </h1>

            <p className="nashka-hero-sub font-bold text-[#0D105A]">
              اكتشف المملكة واستمتع برحلتك
            </p>

            <p className="nashka-hero-desc text-[#5A657D] font-normal">
              سجّل بياناتك لنبدأ تجهيز طلب التأشيرة ومتابعته مع فريق نشكا.
            </p>

            <div className="nashka-hero-cta-wrap">
              <Link
                to="/apply"
                className="nashka-hero-cta inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#161A8D] hover:bg-[#10136B] active:bg-[#0D105A] text-white font-bold whitespace-nowrap shrink-0 shadow-[0_12px_28px_-8px_rgba(22,26,141,0.35)] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#161A8D]"
              >
                <span>ابدأ طلب التأشيرة الآن</span>
                <ArrowLeft className="w-5 h-5 text-[#C9A13B] shrink-0" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Unobscured Framed Saudi Travel Showcase */}
          <div className="nashka-hero-media">
            <div className="nashka-hero-frame">
              {!imageError ? (
                <img
                  src={GENERATED_IMAGES.heroArabFamilyRiyadh}
                  alt="عائلة عربية مسافرة في المطار مع إطلالة برج المملكة بالرياض"
                  loading="eager"
                  fetchPriority="high"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="nashka-hero-img"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#161A8D] to-[#0D105A] text-white p-8 text-center">
                  <Compass className="w-10 h-10 text-[#C9A13B]" aria-hidden="true" />
                  <p className="text-base font-bold text-[#C5E5FF]">
                    التأشيرة السياحية السعودية — نشكا للسياحة
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
