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
    align === 'center' ? 'text-center mx-auto max-w-2xl' : 'text-center lg:text-right max-w-2xl mx-auto lg:mx-0';

  return (
    <div className={`mb-6 sm:mb-9 lg:mb-10 ${alignmentClass}`}>
      {kicker && (
        <p
          className={`text-[13px] sm:text-sm font-bold leading-[1.45] mb-1.5 sm:mb-2 ${
            inverted ? 'text-[#D6AD55]' : 'text-[#8B6918]'
          }`}
        >
          {kicker}
        </p>
      )}
      <h2
        className={`text-[1.5rem] sm:text-[1.875rem] lg:text-[2.125rem] font-extrabold leading-[1.3] ${
          inverted ? 'text-white' : 'text-[#161A8D]'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-2 sm:mt-2.5 text-[14.5px] sm:text-base lg:text-[17px] leading-[1.6] sm:leading-[1.7] [text-wrap:balance] ${
            inverted ? 'text-[#C5E5FF]' : 'text-[#475569]'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
