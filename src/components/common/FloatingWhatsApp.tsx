import React from 'react';
import { MessageCircle } from 'lucide-react';
import { CONTACT_CONFIG } from '../../constants/brand';

export function FloatingWhatsApp() {
  const whatsappUrl = CONTACT_CONFIG.getWhatsappHref();

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل عبر واتساب مع نشكا للسياحة"
      className="fixed bottom-4 left-4 sm:bottom-5 sm:left-5 z-40 inline-flex items-center gap-2 h-10 sm:h-11 px-3.5 sm:px-4 rounded-full bg-[#161A8D] text-white border border-white/20 shadow-lg hover:bg-[#10136B] font-bold transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#161A8D]"
    >
      <MessageCircle className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-[#D6AD55] shrink-0" aria-hidden="true" />
      <span className="text-[13.5px] sm:text-sm font-bold whitespace-nowrap">تواصل واتساب</span>
    </a>
  );
}
