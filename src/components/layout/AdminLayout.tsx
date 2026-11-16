import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Database,
  FileCheck2,
  FolderKanban,
  LogOut,
  Menu,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';
import { NashkaLogo } from '../ui/NashkaLogo';

export type AdminTabKey = 'applications' | 'customers' | 'documents' | 'roles' | 'integrations';

interface AdminLayoutProps {
  activeTab: AdminTabKey;
  onSelectTab: (tab: AdminTabKey) => void;
  sessionCount: number;
  adminEmail?: string;
  adminRoleLabelAr?: string;
  onSignOut?: () => void;
  children: React.ReactNode;
}

const ADMIN_NAV_ITEMS: {
  key: AdminTabKey;
  labelAr: string;
  Icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: 'applications', labelAr: 'إدارة طلبات التأشيرة', Icon: FolderKanban },
  { key: 'customers', labelAr: 'إدارة العملاء', Icon: Users },
  { key: 'documents', labelAr: 'مراجعة المستندات', Icon: FileCheck2 },
  { key: 'roles', labelAr: 'الأدوار والصلاحيات', Icon: ShieldCheck },
  { key: 'integrations', labelAr: 'حالة الربط الخلفي', Icon: Database },
];

export function AdminLayout({
  activeTab,
  onSelectTab,
  sessionCount,
  adminEmail,
  adminRoleLabelAr,
  onSignOut,
  children,
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleTabChange = (tab: AdminTabKey) => {
    onSelectTab(tab);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F4F8FC] text-[#0B0B0D] flex flex-col lg:flex-row" dir="rtl">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-68 xl:w-72 shrink-0 flex-col bg-[#0D105A] text-white border-l border-[#E8EDF4]/15">
        <div className="px-5 py-4 flex flex-col gap-2 border-b border-white/10">
          <div className="flex items-center justify-between gap-2">
            <NashkaLogo variant="dark" size="sm" />
            <span className="text-[11px] font-bold text-[#D6AD55] whitespace-nowrap">
              بوابة الإدارة
            </span>
          </div>
          {adminEmail && (
            <div className="pt-1.5 border-t border-white/10">
              <p className="text-[11px] font-semibold text-[#C5E5FF] truncate font-en" dir="ltr">
                {adminEmail}
              </p>
              {adminRoleLabelAr && (
                <p className="text-[11px] text-white/75 mt-0.5">{adminRoleLabelAr}</p>
              )}
            </div>
          )}
        </div>

        <nav aria-label="قائمة لوحة الإدارة" className="flex-1 p-4 space-y-1.5">
          {ADMIN_NAV_ITEMS.map(({ key, labelAr, Icon }) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleTabChange(key)}
                className={[
                  'w-full min-h-[44px] px-3.5 py-2.5 rounded-xl flex items-center justify-between text-sm font-semibold transition-colors cursor-pointer',
                  isActive
                    ? 'bg-[#161A8D] text-white border border-[#D6AD55]/55'
                    : 'text-[#C5E5FF]/85 hover:bg-white/10 hover:text-white',
                ].join(' ')}
              >
                <span className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-[#D6AD55] shrink-0" aria-hidden="true" />
                  <span>{labelAr}</span>
                </span>
                {key === 'applications' && sessionCount > 0 && (
                  <span className="text-xs font-bold tabular-nums text-[#D6AD55]">
                    {sessionCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          {onSignOut && (
            <button
              type="button"
              onClick={onSignOut}
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#DC3545]/20 hover:bg-[#DC3545]/30 border border-[#DC3545]/40 text-xs font-semibold text-[#FDECEE] flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>تسجيل الخروج</span>
            </button>
          )}
          <Link
            to="/"
            className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>العودة لواجهة العملاء</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-[#E8EDF4] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen((prev) => !prev)}
              aria-label={sidebarOpen ? 'إغلاق قائمة الإدارة' : 'فتح قائمة الإدارة'}
              aria-expanded={sidebarOpen}
              className="lg:hidden w-11 h-11 rounded-xl border border-[#E8EDF4] text-[#161A8D] flex items-center justify-center shrink-0 cursor-pointer"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
            <nav aria-label="مسار التنقل" className="text-sm font-semibold text-[#5A657D] truncate">
              <span className="text-[#161A8D] font-bold">لوحة الإدارة</span>
              <span className="mx-2 text-[#5A657D]/60" aria-hidden="true">/</span>
              <span className="text-[#0B0B0D]">
                {ADMIN_NAV_ITEMS.find((item) => item.key === activeTab)?.labelAr}
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              to="/apply"
              className="min-h-[40px] px-3.5 py-2 rounded-lg bg-[#EAF4FF] text-[#004AAD] hover:bg-[#C5E5FF]/70 text-xs sm:text-sm font-bold inline-flex items-center whitespace-nowrap transition-colors"
            >
              معاينة نموذج التقديم
            </Link>
            {onSignOut && (
              <button
                type="button"
                onClick={onSignOut}
                aria-label="تسجيل الخروج من الإدارة"
                className="lg:hidden min-h-[40px] px-3 py-2 rounded-lg border border-[#E8EDF4] text-[#0B0B0D] hover:bg-[#F4F8FC] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">خروج</span>
              </button>
            )}
          </div>
        </header>

        {/* Mobile Drawer */}
        {sidebarOpen && (
          <div className="lg:hidden bg-[#0D105A] text-white border-b border-white/10 px-4 py-4 space-y-1.5">
            <div className="pb-3 mb-2 border-b border-white/10 flex items-center justify-between gap-2">
              <NashkaLogo variant="dark" size="sm" />
              {adminEmail && (
                <span className="text-xs text-[#C5E5FF] truncate font-en" dir="ltr">
                  {adminEmail}
                </span>
              )}
            </div>
            {ADMIN_NAV_ITEMS.map(({ key, labelAr, Icon }) => {
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleTabChange(key)}
                  className={[
                    'w-full min-h-[46px] px-3.5 py-2.5 rounded-xl flex items-center justify-between text-sm font-semibold cursor-pointer',
                    isActive
                      ? 'bg-[#161A8D] text-white border border-[#D6AD55]/55'
                      : 'text-[#C5E5FF] hover:bg-white/10',
                  ].join(' ')}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-[#D6AD55]" aria-hidden="true" />
                    <span>{labelAr}</span>
                  </span>
                </button>
              );
            })}
            <div className="pt-2 border-t border-white/10 space-y-1">
              {onSignOut && (
                <button
                  type="button"
                  onClick={onSignOut}
                  className="w-full flex items-center gap-2 min-h-[44px] px-3.5 text-sm text-[#FDECEE] hover:text-white cursor-pointer"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                  <span>تسجيل الخروج</span>
                </button>
              )}
              <Link
                to="/"
                className="flex items-center gap-2 min-h-[44px] px-3.5 text-sm text-[#C5E5FF] hover:text-white"
              >
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
                <span>العودة لواجهة العملاء</span>
              </Link>
            </div>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
