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
    align === 'center' ? 'text-center mx-auto max-w-[22rem] sm:max-w-2xl' : 'max-w-2xl';

  return (
    <div className={`mb-7 sm:mb-11 lg:mb-12 ${alignmentClass}`}>
      {kicker && (
        <p
          className={`text-xs sm:text-sm font-bold leading-relaxed mb-2 sm:mb-2.5 ${
            inverted ? 'text-[#C9A13B]' : 'text-[#8B6918]'
          }`}
        >
          {kicker}
        </p>
      )}
      <h2
        className={`text-[clamp(1.35rem,5.8vw,1.6rem)] sm:text-[1.9rem] lg:text-[2.2rem] font-extrabold leading-[1.4] sm:leading-[1.35] ${
          inverted ? 'text-white' : 'text-[#161A8D]'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-2.5 sm:mt-3.5 text-[13.5px] min-[390px]:text-[14.5px] sm:text-base lg:text-[17.5px] leading-[1.8] sm:leading-[1.85] [text-wrap:balance] ${
            inverted ? 'text-[#C5E5FF]' : 'text-[#5A657D]'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
