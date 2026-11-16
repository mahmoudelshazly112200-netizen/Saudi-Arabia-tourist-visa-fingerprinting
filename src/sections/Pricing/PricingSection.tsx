import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ClipboardCheck,
  Clock,
  Crown,
  FileCheck2,
  Fingerprint,
  Plane,
  ShieldCheck,
} from 'lucide-react';
import { VISA_SERVICE_CONFIG } from '../../constants/brand';
import { GENERATED_IMAGES, PACKAGE_INCLUSIONS } from '../../constants/content';
import { formatEgpAmount } from '../../utils/formatters';
import { SectionHeader } from '../../components/common/SectionHeader';

const INCLUSION_ICONS = [
  FileCheck2,
  ShieldCheck,
  Fingerprint,
  Plane,
  ClipboardCheck,
  Clock,
] as const;

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="nashka-offer-section py-12 min-[390px]:py-14 lg:py-20 scroll-mt-16"
    >
      {/* Atmospheric Backdrop Layer (Desktop full subtlety, Tablet restrained, Mobile hidden) */}
      <div className="nashka-offer-backdrop" aria-hidden="true">
        <div className="nashka-offer-ambient" />

        {/* Delicate Flight Trail Arcs & Aircraft (Desktop Only) */}
        <svg
          className="nashka-offer-flights"
          viewBox="0 0 1440 280"
          fill="none"
          preserveAspectRatio="xMidYMin slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1385 190 C1230 135, 1140 72, 995 76"
            stroke="url(#nashkaOfferFlightR)"
            strokeWidth="1.5"
            strokeDasharray="5 6"
            strokeLinecap="round"
          />
          <g transform="translate(972, 58) rotate(-12)">
            <path
              d="M26 11L15 14.5L7 22H4L9 14.5L2 13L0 15.5H-2L0 11L-2 6.5H0L2 9L9 7.5L4 0H7L15 7.5L26 11Z"
              fill="#171C91"
              fillOpacity="0.45"
            />
            <circle cx="26" cy="11" r="2.2" fill="#D5A43B" fillOpacity="0.85" />
          </g>
          <path
            d="M65 180 C210 120, 320 66, 445 72"
            stroke="url(#nashkaOfferFlightL)"
            strokeWidth="1.35"
            strokeDasharray="4 6"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="nashkaOfferFlightR" x1="1385" y1="190" x2="995" y2="76" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#171C91" stopOpacity="0.06" />
              <stop offset="65%" stopColor="#171C91" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#D5A43B" stopOpacity="0.62" />
            </linearGradient>
            <linearGradient id="nashkaOfferFlightL" x1="65" y1="180" x2="445" y2="72" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#171C91" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#171C91" stopOpacity="0.24" />
            </linearGradient>
          </defs>
        </svg>

        {/* Subtle Architectural Skyline Contour & Gold Wave Bottom Rim */}
        <svg
          className="nashka-offer-bottom-wave"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 120V104H460V80H476V104H494V62H512V104H532V46H550V104H568V28H586V16H600V28L608 104H632V58H652V104H674V44H694V104H720V74H742V104H1440V120H0Z"
            fill="url(#nashkaOfferSkySilhouette)"
          />
          <path
            d="M0 78 C360 116, 1080 116, 1440 78 L1440 120 L0 120 Z"
            fill="url(#nashkaOfferNavySweep)"
          />
          <path
            d="M0 78 C360 116, 1080 116, 1440 78"
            stroke="url(#nashkaOfferGoldHorizon)"
            strokeWidth="1.75"
          />
          <defs>
            <linearGradient id="nashkaOfferSkySilhouette" x1="460" y1="16" x2="742" y2="120" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#171C91" stopOpacity="0.03" />
              <stop offset="50%" stopColor="#171C91" stopOpacity="0.09" />
              <stop offset="100%" stopColor="#171C91" stopOpacity="0.03" />
            </linearGradient>
            <linearGradient id="nashkaOfferNavySweep" x1="0" y1="78" x2="1440" y2="120" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#10145F" stopOpacity="0.08" />
              <stop offset="50%" stopColor="#171C91" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#10145F" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="nashkaOfferGoldHorizon" x1="0" y1="78" x2="1440" y2="78" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#D5A43B" stopOpacity="0.05" />
              <stop offset="50%" stopColor="#D5A43B" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#D5A43B" stopOpacity="0.05" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 min-[390px]:px-5 sm:px-6 lg:px-8">
        <SectionHeader
          kicker="التكلفة المعتمدة للباقة"
          title="سعر التأشيرة السياحية السعودية"
          description="تجهيز احترافي ومتابعة مستمرة حتى صدور التأشيرة"
          align="center"
        />

        {/* Premium Travel Offer Composition */}
        <div className="nashka-offer-layout">
          {/* 1. Primary Hero Price Card */}
          <article className="nashka-offer-hero-card">
            {/* Corner "عرض مميز" Seal Badge */}
            <div className="nashka-offer-seal">
              <Crown className="nashka-offer-seal-icon" aria-hidden="true" />
              <span className="nashka-offer-seal-label">عرض مميز</span>
            </div>

            {/* Top Brushed-Gold Service Ribbon */}
            <div className="nashka-offer-ribbon-wrap">
              <div className="nashka-offer-ribbon">
                <span>للفرد الواحد شاملة رسوم الخدمة بالكامل</span>
              </div>
            </div>

            {/* Soft Ambient Glow Behind Hero Price */}
            <div className="nashka-offer-price-stage">
              <div className="nashka-offer-price-glow" aria-hidden="true" />

              <div
                dir="ltr"
                aria-label={`${formatEgpAmount(VISA_SERVICE_CONFIG.pricePerPersonEgp)} جنيه مصري (${VISA_SERVICE_CONFIG.currencyCode})`}
                className="nashka-offer-price-row font-en"
              >
                <span className="nashka-offer-price-amount tabular-nums">
                  {formatEgpAmount(VISA_SERVICE_CONFIG.pricePerPersonEgp)}
                </span>
                <span className="nashka-offer-price-currency">
                  <span className="nashka-offer-currency-en">{VISA_SERVICE_CONFIG.currencyCode}</span>
                  <span className="nashka-offer-currency-ar font-sans">ج.م</span>
                </span>
              </div>

              <span className="nashka-offer-gold-divider" aria-hidden="true" />

              <p className="nashka-offer-price-sub">
                السعر الإجمالي للفرد
              </p>
              <p className="nashka-offer-price-note">
                شفافية تامة بدون أي رسوم خفية أو مصاريف إضافية
              </p>
            </div>

            {/* Panoramic Tourism Backdrop Tucked Cleanly at Lower Edge (Desktop & Restrained Tablet Only) */}
            <div className="nashka-offer-pano-wrap" aria-hidden="true">
              <img
                src={GENERATED_IMAGES.heroRiyadhWide}
                alt=""
                loading="lazy"
                className="nashka-offer-pano-img"
              />
              <div className="nashka-offer-pano-fade" />
              <div className="nashka-offer-pano-trim" />
            </div>
          </article>

          {/* 2. Independent Inclusions List Column */}
          <div className="nashka-offer-inclusions-panel">
            <div className="nashka-offer-inclusions-header">
              <h3 className="nashka-offer-inclusions-title">ويشمل</h3>
              <span className="nashka-offer-inclusions-sub">
                جميع خطوات التقديم والمتابعة ضمن باقة واحدة
              </span>
            </div>

            <span className="nashka-offer-hairline" aria-hidden="true" />

            <ul className="nashka-offer-inclusions-list">
              {PACKAGE_INCLUSIONS.map((item, idx) => {
                const IconComponent = INCLUSION_ICONS[idx % INCLUSION_ICONS.length];
                return (
                  <li key={item} className="nashka-offer-inclusion-row">
                    <span className="nashka-offer-inclusion-badge" aria-hidden="true">
                      <span className="nashka-offer-inclusion-badge-ring" />
                      <IconComponent className="w-4 h-4 text-[#171C91]" strokeWidth={2} />
                    </span>
                    <span className="nashka-offer-inclusion-text">{item}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Prominent Centered Booking CTA + Subtle FAQ Reference Footer */}
        <div className="nashka-offer-cta-zone">
          <Link to="/apply" className="group nashka-offer-cta">
            <span>ابدأ طلب التأشيرة الآن</span>
            <span className="nashka-offer-cta-icon" aria-hidden="true">
              <Plane className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            </span>
          </Link>

          <div className="nashka-offer-faq-strip">
            <span className="text-[#68758A]">
              تجهيز احترافي ومتابعة مستمرة حتى صدور التأشيرة
            </span>
            <Link to="/faq" className="nashka-offer-faq-link">
              <span>تفاصيل إضافية بالأسئلة الشائعة</span>
              <ArrowLeft className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
