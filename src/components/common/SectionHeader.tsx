import React from 'react';

interface SectionHeaderProps {
  kicker?: string;
  title: string;
  description?: string;
  align?: 'start' | 'center';
  inverted?: boolean;
}

export function SectionHeader({
  kicker,
  title,
  description,
  align = 'center',
  inverted = false,
}: SectionHeaderProps) {
  const alignmentClass =
    align === 'center'
      ? 'text-center mx-auto max-w-2xl'
      : 'text-center lg:text-right max-w-2xl mx-auto lg:mx-0';

  const kickerAlignClass =
    align === 'center' ? 'justify-center' : 'justify-center lg:justify-start';

  return (
    <div className={`mb-7 sm:mb-9 lg:mb-10 ${alignmentClass}`}>
      {kicker && (
        <p
          className={`inline-flex items-center gap-2.5 text-[length:var(--text-caption)] font-bold leading-[1.45] mb-1.5 sm:mb-2 ${kickerAlignClass} ${
            inverted ? 'text-[#D5A43B]' : 'text-[#876216]'
          }`}
        >
          <span className="w-6 h-[2px] bg-[#D5A43B] rounded-full shrink-0" aria-hidden="true" />
          <span>{kicker}</span>
        </p>
      )}
      <h2
        className={`text-[length:var(--text-h2)] font-bold leading-[1.3] tracking-tight ${
          inverted ? 'text-white' : 'text-[#171C91]'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-2 sm:mt-2.5 text-[length:var(--text-body)] font-normal leading-[1.65] [text-wrap:balance] ${
            inverted ? 'text-[#C5E5FF]' : 'text-[#68758A]'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
