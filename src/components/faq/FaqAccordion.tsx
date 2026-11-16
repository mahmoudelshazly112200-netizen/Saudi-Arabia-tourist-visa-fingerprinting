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

  const renderFaqCard = (item: FaqItem, idx: number) => {
    const isOpen = openIds.has(item.id);
    const panelId = `${item.id}-panel`;
    const buttonId = `${item.id}-button`;
    const numLabel = String(idx + 1).padStart(2, '0');

    return (
      <div
        key={item.id}
        data-open={isOpen ? 'true' : 'false'}
        className={`nashka-card nashka-card--faq !p-0 overflow-hidden transition-[box-shadow,border-color] duration-200 ${
          isOpen ? 'border-[#D5A43B]/45' : ''
        }`}
      >
        <h3>
          <button
            id={buttonId}
            type="button"
            aria-expanded={isOpen}
            aria-controls={panelId}
            onClick={() => toggleItem(item.id)}
            className="w-full min-h-[54px] px-4 sm:px-5 lg:px-6 py-3.5 sm:py-4 text-right flex items-center justify-between gap-3 sm:gap-4 hover:bg-[#F3F7FC]/75 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#171C91]"
          >
            <span className="flex items-center gap-3 min-w-0">
              <span className="nashka-card-index nashka-card-index--inline font-en tabular-nums shrink-0 select-none">
                {numLabel}
              </span>
              <span className="text-[length:var(--text-body)] font-bold text-[#17213B] leading-[1.45]">
                {item.question}
              </span>
            </span>
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors border-[1.5px] ${
                isOpen
                  ? 'border-[#D5A43B] bg-[#FCF9F0] text-[#171C91]'
                  : 'border-[#D5A43B]/45 bg-[#F3F7FC] text-[#171C91]'
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
            className="px-4 sm:px-5 lg:px-6 pb-4 sm:pb-5 pt-3 border-t border-[#E6ECF4] text-[length:var(--text-body)] font-normal text-[#68758A] leading-[1.65]"
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
        <div className="bg-white rounded-2xl border border-[#E6ECF4] p-4 sm:p-5 space-y-4 shadow-[var(--shadow-card)]">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search
                className="w-4 h-4 text-[#68758A] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن سؤال (مثال: كشف الحساب، العمرة، تساهيل، التكلفة...)"
                aria-label="ابحث في الأسئلة الشائعة"
                className="w-full min-h-[48px] pr-10 pl-10 py-2 rounded-xl border border-[#E6ECF4] bg-[#F3F7FC] text-base text-[#17213B] placeholder:text-[#68758A]/70 focus:outline-none focus:border-[#171C91] focus:bg-white transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="مسح البحث"
                  className="w-8 h-8 rounded-lg text-[#68758A] hover:text-[#17213B] flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleToggleAll}
              disabled={filteredItems.length === 0}
              className="min-h-[48px] px-4 py-2 rounded-xl border border-[#E6ECF4] bg-white hover:bg-[#F3F7FC] text-[length:var(--text-btn)] font-bold text-[#004AAD] inline-flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
            >
              <ChevronsDownUp className="w-4 h-4 text-[#D5A43B]" aria-hidden="true" />
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
                    'min-h-[42px] px-4 py-1.5 rounded-xl text-[length:var(--text-caption)] font-bold transition-colors cursor-pointer border',
                    isSelected
                      ? 'bg-[#171C91] text-white border-[#171C91]'
                      : 'bg-[#F3F7FC] text-[#17213B] border-[#E6ECF4] hover:border-[#C5E5FF] hover:text-[#004AAD]',
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
        <div className="bg-white rounded-2xl border border-[#E6ECF4] p-8 sm:p-10 text-center space-y-4">
          <p className="text-[length:var(--text-h3)] font-bold text-[#17213B]">
            لم يتم العثور على أسئلة مطابقة لبحثك
          </p>
          <p className="text-[length:var(--text-body)] text-[#68758A] max-w-md mx-auto">
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
              className="min-h-[48px] px-4 py-2 rounded-xl border border-[#E6ECF4] text-[length:var(--text-btn)] font-bold text-[#004AAD] hover:bg-[#F3F7FC] cursor-pointer"
            >
              إعادة ضبط التصفية
            </button>
          </div>
        </div>
      ) : columns === 2 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 items-start">
          <div className="flex flex-col gap-4 items-stretch">
            {firstColumnItems.map(renderFaqCard)}
          </div>
          <div className="flex flex-col gap-4 items-stretch">
            {secondColumnItems.map((item, idx) => renderFaqCard(item, midpoint + idx))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 items-start">
          {filteredItems.map(renderFaqCard)}
        </div>
      )}
    </div>
  );
}
