import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronUp, MapPin, Plane } from 'lucide-react';
import { JOURNEY_DESTINATIONS } from '../../constants/content';
import { SectionHeader } from '../../components/common/SectionHeader';
import { ResilientImage } from '../../components/ui/ResilientImage';

export function JourneySection() {
  const [isAllOpen, setIsAllOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleCardSelect = (id: string) => {
    setSelectedId((prev) => {
      if (prev === id && isAllOpen) {
        return null;
      }
      return id;
    });
    setIsAllOpen(true);
  };

  const handleToggleAll = () => {
    setIsAllOpen((prev) => {
      if (prev) {
        setSelectedId(null);
      }
      return !prev;
    });
  };

  return (
    <section
      id="journey"
      className="nashka-gallery-section py-12 min-[390px]:py-14 lg:py-20 scroll-mt-16"
    >
      {/* Editorial Atmospheric & Geographic Backdrop (Desktop + Restrained Tablet, Hidden Mobile) */}
      <div className="nashka-gallery-ambient" aria-hidden="true" />

      {/* Subtle Curved Flight Path & Airplane */}
      <svg
        className="nashka-gallery-flight"
        viewBox="0 0 360 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M342 132 C265 92, 185 48, 72 56"
          stroke="url(#nashkaFlightStroke)"
          strokeWidth="1.75"
          strokeDasharray="5 6"
          strokeLinecap="round"
        />
        <g transform="translate(46, 36) rotate(-14)">
          <path
            d="M28 12L17 15.5L8 24H5L10 15.5L2 14L0 17H-2L0 12L-2 7H0L2 10L10 8.5L5 0H8L17 8.5L28 12Z"
            fill="#171C91"
            fillOpacity="0.62"
          />
          <circle cx="28" cy="12" r="2.4" fill="#D5A43B" fillOpacity="0.92" />
        </g>
        <defs>
          <linearGradient id="nashkaFlightStroke" x1="342" y1="132" x2="72" y2="56" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#171C91" stopOpacity="0.12" />
            <stop offset="55%" stopColor="#171C91" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#D5A43B" stopOpacity="0.72" />
          </linearGradient>
        </defs>
      </svg>

      {/* Transparent Faint Saudi Arabia Map Silhouette */}
      <svg
        className="nashka-gallery-map"
        viewBox="0 0 280 230"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M58 46L96 30L138 42L176 74L214 96L242 126L230 162L188 186L138 198L96 196L74 168L54 134L36 96L42 64L58 46Z"
          fill="url(#nashkaMapFill)"
          stroke="#171C91"
          strokeOpacity="0.22"
          strokeWidth="1.35"
          strokeLinejoin="round"
        />
        {/* Subtle inner geographic coordinate lines */}
        <path
          d="M68 92C112 86, 152 102, 206 122M84 146C124 138, 166 150, 212 146"
          stroke="#171C91"
          strokeOpacity="0.15"
          strokeWidth="1"
          strokeDasharray="3 4"
        />
        {/* Golden Pin Accent on Map */}
        <circle cx="144" cy="112" r="11" fill="#D5A43B" fillOpacity="0.22" />
        <path
          d="M144 96C139.03 96 135 100.03 135 105C135 111.75 144 121 144 121C144 121 153 111.75 153 105C153 100.03 148.97 96 144 96ZM144 108.2C142.23 108.2 140.8 106.77 140.8 105C140.8 103.23 142.23 101.8 144 101.8C145.77 101.8 147.2 103.23 147.2 105C147.2 106.77 145.77 108.2 144 108.2Z"
          fill="#D5A43B"
          fillOpacity="0.86"
        />
        <defs>
          <linearGradient id="nashkaMapFill" x1="36" y1="30" x2="242" y2="198" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C5E5FF" stopOpacity="0.58" />
            <stop offset="100%" stopColor="#171C91" stopOpacity="0.11" />
          </linearGradient>
        </defs>
      </svg>

      {/* Subtle Horizon Skyline & Royal Gold Arc Bottom Accent */}
      <svg
        className="nashka-gallery-skyline"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M0 120V104H960V78H976V104H994V60H1014V104H1038V44H1058V104H1076V26H1094V14H1110V26L1118 104H1142V56H1164V104H1186V38H1208V104H1232V68H1256V104H1284V52H1308V104H1340V76H1366V104H1440V120H0Z"
          fill="url(#nashkaGallerySkyline)"
        />
        <path
          d="M0 98C360 118 820 116 1440 82"
          stroke="url(#nashkaGalleryGoldLine)"
          strokeWidth="1.5"
        />
        <defs>
          <linearGradient id="nashkaGallerySkyline" x1="960" y1="14" x2="1440" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#171C91" stopOpacity="0.03" />
            <stop offset="65%" stopColor="#171C91" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#10145F" stopOpacity="0.14" />
          </linearGradient>
          <linearGradient id="nashkaGalleryGoldLine" x1="0" y1="98" x2="1440" y2="82" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#D5A43B" stopOpacity="0" />
            <stop offset="32%" stopColor="#D5A43B" stopOpacity="0.52" />
            <stop offset="72%" stopColor="#D5A43B" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#D5A43B" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative z-10 max-w-7xl mx-auto px-4 min-[390px]:px-5 sm:px-6 lg:px-8">
        <SectionHeader
          kicker="معالم وأماكن بارزة"
          title="وجهاتك إلى السعودية"
          description="أبرز المدن والمعالم التي بانتظارك في المملكة."
          align="center"
        />

        {/* Editorial Travel Gallery Grid — 3 Distinct Treatments */}
        <div className="nashka-gallery-grid">
          {JOURNEY_DESTINATIONS.map((dest, idx) => {
            const cardNumber = String(idx + 1).padStart(2, '0');
            const isLead = idx === 0;
            const isSelected = selectedId === dest.id;

            return (
              <article
                key={dest.id}
                data-gallery-slot={cardNumber}
                className={`group nashka-gallery-card nashka-gallery-card--${cardNumber} ${
                  isLead ? 'nashka-gallery-card--lead' : ''
                } ${isSelected ? 'nashka-gallery-card--active' : ''}`}
              >
                <button
                  type="button"
                  onClick={() => handleCardSelect(dest.id)}
                  aria-expanded={isAllOpen && isSelected}
                  className="nashka-gallery-trigger"
                >
                  {/* Gold Editorial Numbering Badge */}
                  <span className="nashka-gallery-numeral tabular-nums" aria-hidden="true">
                    {cardNumber}
                  </span>

                  {/* Full-Bleed Architectural / Landscape Frame */}
                  <ResilientImage
                    src={dest.imageUrl}
                    alt={`${dest.city} — ${dest.landmark}`}
                    fallbackLabel={dest.city}
                    loading="eager"
                    containerClassName="nashka-gallery-media-box"
                    className={`nashka-gallery-img nashka-gallery-img--${cardNumber}`}
                  />

                  {/* Dark Scrim for Desktop & Tablet Photography Overlay */}
                  <div className="nashka-gallery-scrim" aria-hidden="true" />

                  {/* Destination Caption Overlay (Overlaid on Desktop/Tablet, Light Surface Band Below Photo on Mobile) */}
                  <div className="nashka-gallery-caption">
                    <div className="nashka-gallery-caption-text">
                      <h3 className="nashka-gallery-city">{dest.city}</h3>
                      <p className="nashka-gallery-landmark">
                        <MapPin className="nashka-gallery-pin" aria-hidden="true" />
                        <span>{dest.landmark}</span>
                      </p>
                    </div>
                    <span className="nashka-gallery-arrow" aria-hidden="true">
                      <ArrowLeft className="w-4 h-4" />
                    </span>
                  </div>
                </button>
              </article>
            );
          })}
        </div>

        {/* Interactive Gallery Action Footer */}
        <div className="nashka-gallery-footer">
          <button
            type="button"
            onClick={handleToggleAll}
            aria-expanded={isAllOpen}
            aria-controls="nashka-destinations-overview"
            className="nashka-gallery-cta"
          >
            <span>{isAllOpen ? 'إخفاء دليل الوجهات' : 'اكتشف جميع الوجهات'}</span>
            {isAllOpen ? (
              <ChevronUp className="w-4 h-4 shrink-0" aria-hidden="true" />
            ) : (
              <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Interactive Destination Overview Drawer (Cleanly Displays Approved 4 Cities Without Inventing Data) */}
        {isAllOpen && (
          <div
            id="nashka-destinations-overview"
            className="nashka-gallery-drawer"
          >
            <div className="nashka-gallery-drawer-header">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#FCF9F0] border border-[#D5A43B]/50 text-[#876216]">
                  <Plane className="w-4 h-4" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-[length:var(--text-h3)] font-bold text-[#17213B]">
                    دليل الوجهات المعتمدة
                  </h3>
                  <p className="text-[length:var(--text-caption)] text-[#68758A]">
                    تتيح لك التأشيرة التنقل بحرية بين أبرز مدن المملكة ومعالمها
                  </p>
                </div>
              </div>
              <Link
                to="/apply"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#171C91] px-4 py-2.5 text-[length:var(--text-btn)] font-bold text-white shadow-sm hover:bg-[#10145F] transition-colors"
              >
                <span>تقديم طلب التأشيرة</span>
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="nashka-gallery-drawer-grid">
              {JOURNEY_DESTINATIONS.map((dest, idx) => {
                const badgeNum = String(idx + 1).padStart(2, '0');
                const isHighlighted = selectedId === dest.id;
                return (
                  <div
                    key={dest.id}
                    className={`nashka-gallery-drawer-item ${
                      isHighlighted ? 'nashka-gallery-drawer-item--active' : ''
                    }`}
                  >
                    <span className="nashka-gallery-drawer-num tabular-nums">{badgeNum}</span>
                    <div className="min-w-0">
                      <p className="font-bold text-[#17213B] text-[length:var(--text-body)]">
                        {dest.city}
                      </p>
                      <p className="text-[length:var(--text-caption)] text-[#68758A] mt-0.5">
                        {dest.landmark}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
