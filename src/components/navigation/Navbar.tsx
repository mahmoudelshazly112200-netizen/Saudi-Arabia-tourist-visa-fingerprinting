import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu, X } from 'lucide-react';
import { NAV_LINKS } from '../../constants/content';
import { Button } from '../ui/Button';
import { NashkaLogo } from '../ui/NashkaLogo';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const handleSectionLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    const hashIndex = href.indexOf('#');
    if (hashIndex === -1) return;

    const targetId = href.slice(hashIndex + 1);
    event.preventDefault();
    setMobileMenuOpen(false);

    if (location.pathname !== '/') {
      navigate(`/#${targetId}`);
      return;
    }

    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `/#${targetId}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E8EDF4] shadow-[0_2px_12px_-4px_rgba(22,26,141,0.06)]">
        <div className="max-w-7xl mx-auto px-3 min-[375px]:px-4 sm:px-6 lg:px-8 h-16 sm:h-[72px] flex items-center justify-between gap-2 sm:gap-4 lg:gap-8">
          {/* Zone 1: Right-side Official Nashka Brand Mark */}
          <Link
            to="/"
            aria-label="نشكا للسياحة — الصفحة الرئيسية"
            className="inline-flex items-center shrink-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#161A8D]"
          >
            <NashkaLogo variant="light" size="md" />
          </Link>

          {/* Zone 2: Center 5 Approved Navigation Links (Desktop) */}
          <nav
            aria-label="التنقل الرئيسي"
            className="hidden lg:flex items-center gap-7 text-[15px] font-bold text-[#0B0B0D]"
          >
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleSectionLinkClick(e, item.href)}
                className="py-1.5 hover:text-[#161A8D] border-b-2 border-transparent hover:border-[#D6AD55] transition-colors whitespace-nowrap shrink-0"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Left-side Primary CTA + Responsive Drawer Toggle */}
          <div className="flex items-center gap-1.5 min-[375px]:gap-2 sm:gap-2.5 shrink-0">
            <Button
              to="/apply"
              variant="primary"
              size="sm"
              className="rounded-xl px-3 min-[375px]:px-4 sm:px-5 text-[14px] min-[375px]:text-[15px] font-bold min-h-[44px]"
            >
              <span>ابدأ الطلب</span>
              <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
            </Button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label={mobileMenuOpen ? 'إغلاق القائمة الجانبية' : 'فتح القائمة الجانبية'}
              className="lg:hidden w-11 h-11 rounded-xl border border-[#E8EDF4] bg-white text-[#161A8D] hover:bg-[#F4F8FC] flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Slide-Over Mobile & Small-Tablet Side Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="قائمة التنقل">
          <div
            className="fixed inset-0 bg-[#0B0B0D]/45 backdrop-blur-[2px]"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          <nav
            id="mobile-navigation-drawer"
            aria-label="قائمة الجوال الجانبية"
            className="fixed inset-y-0 right-0 z-[75] w-[min(85vw,340px)] bg-white border-l border-[#E8EDF4] shadow-2xl flex flex-col justify-between p-5 overflow-y-auto"
          >
            <div>
              <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#E8EDF4]">
                <NashkaLogo variant="light" size="sm" />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="إغلاق القائمة"
                  className="w-10 h-10 rounded-xl border border-[#E8EDF4] text-[#0B0B0D] hover:bg-[#F4F8FC] flex items-center justify-center cursor-pointer"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              <ul className="mt-3 flex flex-col divide-y divide-[#E8EDF4]">
                {NAV_LINKS.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={(e) => handleSectionLinkClick(e, item.href)}
                      className="flex items-center min-h-[48px] px-2 text-base font-bold text-[#0B0B0D] hover:text-[#161A8D] transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
                <li>
                  <Link
                    to="/faq"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center min-h-[48px] px-2 text-base font-semibold text-[#004AAD] hover:text-[#161A8D]"
                  >
                    صفحة الأسئلة الشائعة التفاعلية
                  </Link>
                </li>
                <li>
                  <Link
                    to="/track"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center min-h-[48px] px-2 text-base font-semibold text-[#004AAD] hover:text-[#161A8D]"
                  >
                    متابعة حالة الطلب
                  </Link>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-[#E8EDF4]">
              <Button
                to="/apply"
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>ابدأ الطلب</span>
                <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
              </Button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
