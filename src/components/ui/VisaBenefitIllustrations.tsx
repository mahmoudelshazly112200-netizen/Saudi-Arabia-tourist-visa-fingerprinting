import React from 'react';

export type VisaBenefitIllustrationId =
  | 'umrah'
  | 'explore-kingdom'
  | 'visit-relatives'
  | 'seasons-events'
  | 'shopping-entertainment'
  | 'heritage-nature'
  | string;

interface VisaBenefitIllustrationProps {
  benefitId: VisaBenefitIllustrationId;
  className?: string;
}

/**
 * Custom domain-authentic vector illustrations for the 6 Saudi Tourist Visa benefits,
 * styled in the original Nashka Royal Blue (#161A8D / #0D105A), Sky Blue (#C5E5FF / #F4F8FC), and Gold (#D6AD55 / #D6AD55) palette.
 */
export function VisaBenefitIllustration({
  benefitId,
  className = 'w-full h-full',
}: VisaBenefitIllustrationProps) {
  switch (benefitId) {
    case 'umrah':
      return (
        <svg viewBox="0 0 240 160" fill="none" aria-hidden="true" className={className}>
          <rect width="240" height="160" fill="#F4F8FC" />
          <circle cx="120" cy="76" r="56" fill="#C5E5FF" fillOpacity="0.45" />
          <path
            d="M52 136V76C52 44 82 24 120 24C158 24 188 44 188 76V136H52Z"
            fill="#FFFFFF"
            stroke="#C5E5FF"
            strokeWidth="2"
          />
          <rect x="64" y="42" width="12" height="94" rx="2" fill="#E8EDF4" />
          <path d="M63 42L70 28L77 42H63Z" fill="#D6AD55" />
          <rect x="94" y="64" width="52" height="58" rx="4" fill="#0D105A" />
          <rect x="94" y="75" width="52" height="7" fill="#D6AD55" />
          <rect x="115" y="96" width="10" height="26" rx="2" fill="#D6AD55" fillOpacity="0.9" />
          <path
            d="M168 38C163 38 159 42 159 47C159 52 163 56 168 56C165 55 163 51 163 47C163 43 165 39 168 38Z"
            fill="#D6AD55"
          />
          <rect x="38" y="122" width="164" height="14" rx="7" fill="#161A8D" />
        </svg>
      );

    case 'explore-kingdom':
      return (
        <svg viewBox="0 0 240 160" fill="none" aria-hidden="true" className={className}>
          <rect width="240" height="160" fill="#F4F8FC" />
          <circle cx="120" cy="80" r="58" fill="#C5E5FF" fillOpacity="0.45" />
          <rect x="52" y="88" width="22" height="44" rx="3" fill="#C5E5FF" />
          <rect x="166" y="80" width="22" height="52" rx="3" fill="#C5E5FF" />
          <path
            d="M101 132L107 26H115L117 44C118 48 122 48 123 44L125 26H133L139 132H101Z"
            fill="#161A8D"
          />
          <rect x="113" y="31" width="14" height="4" rx="2" fill="#D6AD55" />
          <path
            d="M48 106C76 62 160 56 196 84"
            stroke="#0D105A"
            strokeWidth="2.5"
            strokeDasharray="6 5"
            strokeLinecap="round"
          />
          <circle cx="184" cy="60" r="14" fill="#FFFFFF" stroke="#D6AD55" strokeWidth="2.5" />
          <path d="M184 52L188 60L184 68L180 60L184 52Z" fill="#161A8D" />
          <circle cx="184" cy="60" r="2.5" fill="#D6AD55" />
          <rect x="38" y="128" width="164" height="10" rx="5" fill="#0D105A" />
        </svg>
      );

    case 'visit-relatives':
      return (
        <svg viewBox="0 0 240 160" fill="none" aria-hidden="true" className={className}>
          <rect width="240" height="160" fill="#F4F8FC" />
          <circle cx="120" cy="80" r="56" fill="#FCF9F0" />
          <path
            d="M58 130V72C58 46 84 30 120 30C156 30 182 46 182 72V130H58Z"
            fill="#FFFFFF"
            stroke="#C5E5FF"
            strokeWidth="2"
          />
          <path
            d="M110 118H136L142 96C143 90 139 84 133 82L135 66H111L113 82C107 84 103 90 104 96L110 118Z"
            fill="#D6AD55"
          />
          <path
            d="M107 88C95 85 88 75 84 68"
            stroke="#161A8D"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M137 78C149 78 152 96 138 102"
            stroke="#161A8D"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path d="M117 66L123 52L129 66H117Z" fill="#161A8D" />
          <path d="M74 104H92L89 118H77L74 104Z" fill="#161A8D" />
          <rect x="75" y="109" width="16" height="3" fill="#D6AD55" />
          <circle cx="164" cy="64" r="12" fill="#0D105A" />
          <path
            d="M164 70C164 70 157 65.5 157 61.5C157 59.5 158.5 58 160.5 58C162 58 163.2 59 164 60C164.8 59 166 58 167.5 58C169.5 58 171 59.5 171 61.5C171 65.5 164 70 164 70Z"
            fill="#D6AD55"
          />
          <rect x="44" y="122" width="152" height="10" rx="5" fill="#161A8D" />
        </svg>
      );

    case 'seasons-events':
      return (
        <svg viewBox="0 0 240 160" fill="none" aria-hidden="true" className={className}>
          <rect width="240" height="160" fill="#F4F8FC" />
          <circle cx="120" cy="80" r="56" fill="#C5E5FF" fillOpacity="0.45" />
          <rect x="46" y="42" width="148" height="84" rx="14" fill="#0D105A" />
          <path d="M72 42L96 126H58L72 42Z" fill="#D6AD55" fillOpacity="0.2" />
          <path d="M168 42L182 126H144L168 42Z" fill="#C5E5FF" fillOpacity="0.22" />
          <path d="M68 126V92C68 82 76 74 86 74C96 74 104 82 104 92V126H68Z" fill="#161A8D" stroke="#D6AD55" strokeWidth="2" />
          <path d="M104 126V82C104 71 112 64 120 64C128 64 136 71 136 82V126H104Z" fill="#161A8D" stroke="#D6AD55" strokeWidth="2" />
          <path d="M136 126V92C136 82 144 74 154 74C164 74 172 82 172 92V126H136Z" fill="#161A8D" stroke="#D6AD55" strokeWidth="2" />
          <path d="M120 30L123 38L131 41L123 44L120 52L117 44L109 41L117 38L120 30Z" fill="#D6AD55" />
          <circle cx="80" cy="54" r="3.5" fill="#C5E5FF" />
          <circle cx="160" cy="56" r="3" fill="#D6AD55" />
        </svg>
      );

    case 'shopping-entertainment':
      return (
        <svg viewBox="0 0 240 160" fill="none" aria-hidden="true" className={className}>
          <rect width="240" height="160" fill="#F4F8FC" />
          <circle cx="120" cy="80" r="56" fill="#C5E5FF" fillOpacity="0.45" />
          <rect x="46" y="48" width="148" height="78" rx="10" fill="#FFFFFF" stroke="#C5E5FF" strokeWidth="2" />
          <rect x="56" y="58" width="54" height="58" rx="6" fill="#0D105A" />
          <path d="M64 116V76C64 69 72 64 83 64C94 64 102 69 102 76V116H64Z" fill="#161A8D" stroke="#C5E5FF" strokeWidth="1.5" />
          <rect x="130" y="64" width="46" height="48" rx="6" fill="#161A8D" />
          <path
            d="M142 64V56C142 50 147 45 153 45C159 45 164 50 164 56V64"
            stroke="#D6AD55"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <rect x="140" y="76" width="26" height="5" rx="2.5" fill="#D6AD55" />
          <path d="M180 34L182.5 40L188.5 42.5L182.5 45L180 51L177.5 45L171.5 42.5L177.5 40L180 34Z" fill="#D6AD55" />
          <rect x="38" y="122" width="164" height="10" rx="5" fill="#0D105A" />
        </svg>
      );

    case 'heritage-nature':
    default:
      return (
        <svg viewBox="0 0 240 160" fill="none" aria-hidden="true" className={className}>
          <rect width="240" height="160" fill="#F4F8FC" />
          <circle cx="120" cy="78" r="56" fill="#FCF9F0" />
          <circle cx="154" cy="48" r="18" fill="#D6AD55" />
          <path
            d="M54 126C54 78 72 44 106 44C140 44 156 76 156 126H132C132 96 122 78 105 78C88 78 78 96 78 126H54Z"
            fill="#161A8D"
          />
          <path d="M146 126L158 76L176 72L188 126H146Z" fill="#0D105A" />
          <path d="M36 126C72 106 112 114 152 126H36Z" fill="#D6AD55" fillOpacity="0.85" />
          <path d="M108 126C144 108 176 110 204 126H108Z" fill="#161A8D" fillOpacity="0.75" />
          <path d="M174 114V92" stroke="#0D105A" strokeWidth="3" strokeLinecap="round" />
          <path d="M174 92C166 86 160 88 158 92M174 92C182 86 188 88 190 92M174 92C170 82 174 78 178 80" stroke="#0D105A" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
  }
}
