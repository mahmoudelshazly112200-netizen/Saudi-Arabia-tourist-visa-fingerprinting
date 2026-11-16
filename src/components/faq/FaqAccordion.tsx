import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronsDownUp, MessageCircle, Search, X } from 'lucide-react';
import { CONTACT_CONFIG } from '../../constants/brand';
import { FAQ_CATEGORIES, FAQ_ITEMS } from '../../constants/content';
import { FaqCategory, FaqItem } from '../../types/visa';
import { Button } from '../ui/Button';

interface FaqAccordionProps {
  items?: FaqItem[];
  enableFiltering?: boolean;
  columns?: 1 | 2;
}

export function FaqAccordion({
  items = FAQ_ITEMS,
  enableFiltering = false,
  columns = 2,
}: FaqAccordionProps) {
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState<Set<string>>(() =>
    items[0]?.id ? new Set([items[0].id]) : new Set()
  );

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return items.filter((item) => {
      const matchesCat =
        !enableFiltering || selectedCategory === 'all' || item.category === selectedCategory;
      if (!matchesCat) return false;
      if (!q) return true;
      return (
        item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q)
      );
    });
  }, [items, enableFiltering, selectedCategory, searchQuery]);

  const toggleItem = (id: string) => {
    setOpenIds((prev) => {
      if (!enableFiltering) {
        return prev.has(id) ? new Set() : new Set([id]);
      }
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const allFilteredOpen =
    filteredItems.length > 0 && filteredItems.every((item) => openIds.has(item.id));

  const handleToggleAll = () => {
    if (allFilteredOpen) {
      setOpenIds(new Set());
    } else {
      setOpenIds(new Set(filteredItems.map((item) => item.id)));
    }
  };

  const renderFaqCard = (item: FaqItem) => {
    const isOpen = openIds.has(item.id);
    const panelId = `${item.id}-panel`;
    const buttonId = `${item.id}-button`;

    return (
      <div
        key={item.id}
        className={`bg-white rounded-2xl border transition-colors overflow-hidden ${
          isOpen
            ? 'border-[#C5E5FF] shadow-[var(--shadow-card)]'
            : 'border-[#E8EDF4] hover:border-[#C5E5FF]'
        }`}
      >
        <h3>
          <button
            id={buttonId}
            type="button"
            aria-expanded={isOpen}
            aria-controls={panelId}
            onClick={() => toggleItem(item.id)}
            className="w-full min-h-[54px] px-4 sm:px-5 py-3.5 text-right flex items-center justify-between gap-3 sm:gap-4 hover:bg-[#F4F8FC] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#161A8D]"
          >
            <span className="text-[15px] sm:text-base font-bold text-[#0B0B0D] leading-[1.4]">
              {item.question}
            </span>
            <span
              className={`w-8 h-8 rounded-full bg-[#F4F8FC] text-[#161A8D] flex items-center justify-center shrink-0 transition-colors border ${
                isOpen ? 'border-[#D6AD55] bg-[#FCF9F0]' : 'border-[#E8EDF4]'
              }`}
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </span>
          </button>
        </h3>

        {isOpen && (
          <div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            className="px-4 sm:px-5 pb-4 sm:pb-5 pt-3 border-t border-[#E8EDF4] text-[14px] sm:text-[15px] text-[#475569] leading-[1.65] sm:leading-[1.75]"
          >
            <p>{item.answer}</p>
          </div>
        )}
      </div>
    );
  };

  const midpoint = Math.ceil(filteredItems.length / 2);
  const firstColumnItems = filteredItems.slice(0, midpoint);
  const secondColumnItems = filteredItems.slice(midpoint);

  return (
    <div className="space-y-6">
      {enableFiltering && (
        <div className="bg-white rounded-2xl border border-[#E8EDF4] p-4 sm:p-5 space-y-4 shadow-[var(--shadow-card)]">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search
                className="w-4 h-4 text-[#475569] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن سؤال (مثال: كشف الحساب، العمرة، تساهيل، التكلفة...)"
                aria-label="ابحث في الأسئلة الشائعة"
                className="w-full min-h-[48px] pr-10 pl-10 py-2 rounded-xl border border-[#E8EDF4] bg-[#F4F8FC] text-base text-[#0B0B0D] placeholder:text-slate-400 focus:outline-none focus:border-[#161A8D] focus:bg-white transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="مسح البحث"
                  className="w-8 h-8 rounded-lg text-slate-400 hover:text-[#0B0B0D] flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleToggleAll}
              disabled={filteredItems.length === 0}
              className="min-h-[48px] px-4 py-2 rounded-xl border border-[#E8EDF4] bg-white hover:bg-[#F4F8FC] text-[15px] font-bold text-[#004AAD] inline-flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
            >
              <ChevronsDownUp className="w-4 h-4 text-[#D6AD55]" aria-hidden="true" />
              <span>{allFilteredOpen ? 'إغلاق جميع الإجابات' : 'فتح جميع الإجابات'}</span>
            </button>
          </div>

          <div
            role="tablist"
            aria-label="تصنيف الأسئلة الشائعة"
            className="flex flex-wrap items-center gap-2 pt-1"
          >
            {FAQ_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={[
                    'min-h-[42px] px-4 py-1.5 rounded-xl text-sm font-bold transition-colors cursor-pointer border',
                    isSelected
                      ? 'bg-[#161A8D] text-white border-[#161A8D]'
                      : 'bg-[#F4F8FC] text-[#0B0B0D] border-[#E8EDF4] hover:border-[#C5E5FF] hover:text-[#004AAD]',
                  ].join(' ')}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8EDF4] p-8 sm:p-10 text-center space-y-4">
          <p className="text-lg font-bold text-[#0B0B0D]">
            لم يتم العثور على أسئلة مطابقة لبحثك
          </p>
          <p className="text-base text-[#334155] max-w-md mx-auto">
            تواصل مع فريق نشكا للسياحة مباشرة عبر واتساب للإجابة عن سؤالك بشكل فوري ودقيق.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              href={CONTACT_CONFIG.getWhatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              size="md"
            >
              <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>اسأل فريق نشكا عبر واتساب</span>
            </Button>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="min-h-[48px] px-4 py-2 rounded-xl border border-[#E8EDF4] text-[15px] font-bold text-[#004AAD] hover:bg-[#F4F8FC] cursor-pointer"
            >
              إعادة ضبط التصفية
            </button>
          </div>
        </div>
      ) : columns === 2 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-5 items-start">
          <div className="flex flex-col gap-3.5 sm:gap-4 items-stretch">
            {firstColumnItems.map(renderFaqCard)}
          </div>
          <div className="flex flex-col gap-3.5 sm:gap-4 items-stretch">
            {secondColumnItems.map(renderFaqCard)}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5 sm:gap-4 items-start">
          {filteredItems.map(renderFaqCard)}
        </div>
      )}
    </div>
  );
}
