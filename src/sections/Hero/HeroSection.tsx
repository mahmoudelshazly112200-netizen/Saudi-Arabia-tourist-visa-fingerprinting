import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Compass } from 'lucide-react';
import { VISA_SERVICE_CONFIG } from '../../constants/brand';
import { GENERATED_IMAGES as HERO_IMAGES } from '../../constants/content';
import { formatEgpAmount } from '../../utils/formatters';

export function HeroSection() {
  const [imageError, setImageError] = useState(false);

  const handleScrollToPricing = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const pricingEl = document.getElementById('pricing');
    if (pricingEl) {
      event.preventDefault();
      pricingEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', '/#pricing');
    }
  };

  return (
    <section
      aria-label="التأشيرة السياحية السعودية"
      className="nashka-hero border-b border-[#E6ECF4]"
    >
      {/* Subtle Ambient Illumination */}
      <div className="nashka-hero-ambient pointer-events-none" aria-hidden="true" />

      {/* Desktop / Wide Tablet Left Royal-Blue Architectural Wing & Filigree */}
      <div className="nashka-hero-royal-wing pointer-events-none" aria-hidden="true">
        <svg
          className="w-full h-full"
          viewBox="0 0 640 720"
          fill="none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="nashkaRoyalWingGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#10145F" stopOpacity="0.96" />
              <stop offset="55%" stopColor="#171C91" stopOpacity="0.88" />
              <stop offset="100%" stopColor="#171C91" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="nashkaGoldArcGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#D5A43B" stopOpacity="0.65" />
              <stop offset="65%" stopColor="#D5A43B" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#D5A43B" stopOpacity="0" />
            </linearGradient>
            <pattern
              id="nashkaArchitecturalLattice"
              width="48"
              height="48"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M24 0L48 24L24 48L0 24Z"
                stroke="#C5E5FF"
                strokeOpacity="0.09"
                strokeWidth="0.9"
                fill="none"
              />
              <circle
                cx="24"
                cy="24"
                r="6"
                stroke="#D5A43B"
                strokeOpacity="0.1"
                strokeWidth="0.7"
                fill="none"
              />
            </pattern>
          </defs>
          <path
            d="M0 0H420C295 165 245 375 380 650C405 695 435 720 470 720H0V0Z"
            fill="url(#nashkaRoyalWingGrad)"
          />
          <path
            d="M0 0H395C275 165 232 375 362 650C385 695 415 720 448 720H0V0Z"
            fill="url(#nashkaArchitecturalLattice)"
          />
          <path
            d="M422 0C296 168 248 378 384 654"
            stroke="url(#nashkaGoldArcGrad)"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* Subtle Riyadh Architectural Horizon Silhouette (Desktop + restrained on Tablet, hidden on Mobile) */}
      <div className="nashka-hero-skyline pointer-events-none" aria-hidden="true">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 220"
          fill="none"
          preserveAspectRatio="xMidYMax slice"
        >
          <defs>
            <linearGradient id="nashkaSkylineSilhouette" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#171C91" stopOpacity="0.11" />
              <stop offset="100%" stopColor="#171C91" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="nashkaHorizonGold" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#D5A43B" stopOpacity="0.55" />
              <stop offset="45%" stopColor="#D5A43B" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#D5A43B" stopOpacity="0.08" />
            </linearGradient>
          </defs>
          {/* Minimalist Riyadh Skyline: Al Faisaliah, Kingdom Centre & District Towers */}
          <path
            d="M0 220V182H46V165H78V182H132V148H154V128H172V148H198V180H260V154H284V104L296 86L308 104V154H336V176H410V132H434V96H452V132H478V178H542V144H572V118H590V144H624V182H676V138H694V44C694 38 700 34 706 34H718C724 34 730 38 730 44V138H744V182H792V146H814V72L824 46L834 72V146H864V178H922V122H946V102H966V122H992V182H1058V154H1094V134H1122V154H1164V184H1244V162H1284V184H1440V220H0Z"
            fill="url(#nashkaSkylineSilhouette)"
          />
          {/* Kingdom Centre iconic skybridge cutout detail */}
          <path
            d="M703 48H721C721 62 717 70 712 70C707 70 703 62 703 48Z"
            fill="#F3F7FC"
            fillOpacity="0.7"
          />
          {/* Architectural Horizon Hairlines */}
          <path
            d="M0 198C310 210 640 206 980 184C1165 172 1320 158 1440 144"
            stroke="url(#nashkaHorizonGold)"
            strokeWidth="1.25"
          />
          <path
            d="M0 212C380 204 780 194 1440 168"
            stroke="#C5E5FF"
            strokeOpacity="0.45"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 min-[390px]:px-5 sm:px-6 lg:px-8">
        <div className="nashka-hero-grid">
          {/* Editorial Copy & Dominant Primary CTA */}
          <div className="nashka-hero-content">
            <div className="nashka-hero-kicker">
              <span className="w-7 h-[2px] bg-[#D5A43B] rounded-full shrink-0" aria-hidden="true" />
              <span>التأشيرة السياحية السعودية</span>
              <span className="hidden sm:inline text-[#D5A43B]" aria-hidden="true">·</span>
              <span className="hidden sm:inline text-[#171C91]">نشكا للسياحة</span>
            </div>

            <h1 className="nashka-hero-h1 tracking-tight">
              <span className="nashka-hero-line1">تأشيرتك للسعودية</span>{' '}
              <span className="nashka-hero-line2">
                أسهل وأسرع{' '}
                <span className="relative inline-block text-[#171C91]">
                  مع نشكا
                  <span
                    className="absolute inset-x-0 -bottom-1 h-[3px] rounded-full bg-[#D5A43B]"
                    aria-hidden="true"
                  />
                </span>
              </span>
            </h1>

            <p className="nashka-hero-desc">
              نتولى تجهيز ملفك، وإصدار التأمين الطبي، وحجز موعد البصمة في تساهيل، مع متابعة مستمرة حتى
              صدور التأشيرة.
            </p>

            {/* Structured Visa Specifications Strip */}
            <div className="nashka-hero-specs tabular-nums">
              <span>
                <strong className="text-[#171C91] font-bold">
                  {formatEgpAmount(VISA_SERVICE_CONFIG.pricePerPersonEgp)} ج.م
                </strong>{' '}
                للفرد الواحد
              </span>
              <span className="nashka-hero-specs-sep text-[#D5A43B] font-bold" aria-hidden="true">
                ·
              </span>
              <span className="inline-flex items-center gap-2">
                <span>
                  إصدار في <strong className="text-[#17213B] font-bold">3 أيام عمل</strong>
                </span>
                <span className="text-[#D5A43B] font-bold" aria-hidden="true">
                  ·
                </span>
                <span>
                  إقامة <strong className="text-[#17213B] font-bold">90 يومًا</strong>
                </span>
              </span>
            </div>

            <div className="nashka-hero-cta-wrap">
              <Link
                to="/apply"
                className="nashka-hero-cta group inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-l from-[#171C91] via-[#1B22A8] to-[#10145F] hover:from-[#10145F] hover:to-[#0C104D] active:bg-[#0C104D] text-white font-bold whitespace-nowrap shrink-0 border border-[#D5A43B]/45 shadow-[0_16px_36px_-10px_rgba(23,28,145,0.42)] hover:shadow-[0_20px_42px_-10px_rgba(23,28,145,0.52)] hover:-translate-y-0.5 active:translate-y-0 transition-[transform,box-shadow,background-color] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171C91]"
              >
                <span>ابدأ طلب التأشيرة الآن</span>
                <span
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#D5A43B]/20 flex items-center justify-center shrink-0"
                  aria-hidden="true"
                >
                  <ArrowLeft className="w-4 h-4 text-[#D5A43B] transition-transform duration-150 group-hover:-translate-x-0.5" />
                </span>
              </Link>

              <a
                href="/#pricing"
                onClick={handleScrollToPricing}
                className="nashka-hero-secondary-link inline-flex items-center justify-center gap-1.5 text-[#004AAD] hover:text-[#171C91] font-bold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171C91] rounded-lg"
              >
                <span>تفاصيل الباقة والسعر</span>
                <ChevronDown className="w-4 h-4 shrink-0" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Cinematic Framed Saudi Travel Showcase */}
          <div className="nashka-hero-media">
            <div className="nashka-hero-frame-stage">
              {/* Soft Warm Gold Ambient Glow behind frame corners */}
              <div className="nashka-hero-glow pointer-events-none" aria-hidden="true" />

              {/* Delicate Architectural Gold Corner Details (Desktop full / Tablet minimal / Mobile off) */}
              <span
                className="nashka-hero-corner nashka-hero-corner--tr pointer-events-none"
                aria-hidden="true"
              />
              <span
                className="nashka-hero-corner nashka-hero-corner--tl pointer-events-none"
                aria-hidden="true"
              />
              <span
                className="nashka-hero-corner nashka-hero-corner--br pointer-events-none"
                aria-hidden="true"
              />
              <span
                className="nashka-hero-corner nashka-hero-corner--bl pointer-events-none"
                aria-hidden="true"
              />

              {/* Outer Frame Layer */}
              <div className="nashka-hero-frame">
                {/* Inner Mat / Double-Frame Ring */}
                <div className="nashka-hero-frame-inner">
                  {!imageError ? (
                    <img
                      src={HERO_IMAGES.heroArabFamilyRiyadh}
                      alt="عائلة عربية مسافرة في المطار مع إطلالة برج المملكة بالرياض"
                      loading="eager"
                      fetchPriority="high"
                      referrerPolicy="no-referrer"
                      onError={() => setImageError(true)}
                      className="nashka-hero-img"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#161A8D] to-[#0D105A] text-white p-8 text-center">
                      <Compass className="w-10 h-10 text-[#D6AD55]" aria-hidden="true" />
                      <p className="text-base font-bold text-[#F4F8FC]">
                        التأشيرة السياحية السعودية — نشكا للسياحة
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Subtle Golden Shimmer Horizon Accent along lower frame edge */}
              <div className="nashka-hero-bottom-arc pointer-events-none" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
