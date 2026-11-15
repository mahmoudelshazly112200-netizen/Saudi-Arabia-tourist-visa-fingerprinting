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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E5EAF2] shadow-[0_2px_12px_-4px_rgba(22,26,141,0.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-[70px] flex items-center justify-between gap-2.5 sm:gap-3 lg:gap-8">
        {/* Zone 1: Right-side Official Nashka Brand Mark */}
        <Link
          to="/"
          aria-label="نشكا للسياحة — الصفحة الرئيسية"
          className="inline-flex items-center shrink-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#161A8D]"
        >
          <NashkaLogo variant="light" size="md" />
        </Link>

        {/* Zone 2: Center 5 Approved Navigation Links */}
        <nav
          aria-label="التنقل الرئيسي"
          className="hidden lg:flex items-center gap-7 text-sm font-semibold text-[#5A657D]"
        >
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleSectionLinkClick(e, item.href)}
              className="py-1.5 hover:text-[#161A8D] border-b-2 border-transparent hover:border-[#C9A13B] transition-colors whitespace-nowrap shrink-0"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Left-side Primary CTA Button + Mobile Menu Trigger */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <div className="hidden min-[360px]:block">
            <Button
              to="/apply"
              variant="primary"
              size="sm"
              className="rounded-xl px-3.5 sm:px-5 text-xs sm:text-sm min-h-[38px] sm:min-h-[40px]"
            >
              <span>ابدأ الطلب</span>
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" aria-hidden="true" />
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-panel"
            aria-label={mobileMenuOpen ? 'إغلاق القائمة الرئيسية' : 'فتح القائمة الرئيسية'}
            className="lg:hidden w-11 h-11 rounded-xl border border-[#E5EAF2] text-[#161A8D] hover:bg-[#F1F8FF] flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          id="mobile-navigation-panel"
          aria-label="قائمة الجوال"
          className="lg:hidden border-t border-[#E5EAF2] bg-white px-4 pt-3 pb-5 shadow-lg"
        >
          <ul className="flex flex-col divide-y divide-slate-100">
            {NAV_LINKS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={(e) => handleSectionLinkClick(e, item.href)}
                  className="flex items-center min-h-[48px] px-2 text-base font-semibold text-slate-800 hover:text-[#161A8D]"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                to="/track"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center min-h-[48px] px-2 text-base font-semibold text-[#5A657D] hover:text-[#161A8D]"
              >
                متابعة حالة الطلب
              </Link>
            </li>
          </ul>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <Button
              to="/apply"
              variant="primary"
              size="md"
              fullWidth
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>ابدأ الطلب</span>
              <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
