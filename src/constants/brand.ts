export const BRAND_TOKENS = {
  colors: {
    royalBlue: '#161A8D',
    skyBlue: '#C5E5FF',
    gold: '#D6AD55',
    white: '#FFFFFF',
    softBackground: '#F4F8FC',
    neutral: '#E8EDF4',
    warmIvory: '#FAF8F5',
    secondaryText: '#5A657D',
  },
  fonts: {
    arabic: 'Cairo',
    english: 'Poppins',
  },
  direction: 'rtl' as const,
} as const;

export const VISA_SERVICE_CONFIG = {
  serviceNameAr: 'التأشيرة السياحية السعودية',
  serviceNameEn: 'Saudi Tourist Visa',
  pricePerPersonEgp: 9500,
  currencyCode: 'EGP',
  currencyLabelAr: 'ج.م',
  minApplicants: 1,
  maxApplicantsPerSubmission: 20,
  maxFileSizeBytes: 10 * 1024 * 1024, // 10 MB max per file
  acceptedPassportTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  acceptedPhotoTypes: ['image/jpeg', 'image/png', 'image/webp'],
} as const;

const envObj = (import.meta as { env?: Record<string, string | undefined> }).env ?? {};
const configuredPhone = (envObj.VITE_NASHKA_PHONE || '01040009577').trim();
const configuredWhatsappDigits = (envObj.VITE_NASHKA_WHATSAPP || '201060070093')
  .trim()
  .replace(/[^\d]/g, '');
const configuredEmail = (envObj.VITE_NASHKA_EMAIL || 'nashkatourism@gmail.com').trim();

export const CONTACT_CONFIG = {
  brandNameAr: 'نشكا للسياحة',
  brandNameEn: 'NASHKA TOURISM',
  platformTitleAr: 'نشكا للسياحة | التأشيرة السياحية السعودية',
  platformTitleEn: 'Nashka Tourism — Saudi Tourist Visa',
  email: configuredEmail,
  companyPhoneDisplay: configuredPhone,
  companyPhoneIntl: configuredPhone.startsWith('+')
    ? configuredPhone
    : configuredPhone.startsWith('0')
      ? `+20${configuredPhone.slice(1)}`
      : `+${configuredPhone}`,
  whatsappDisplay: '01060070093',
  whatsappIntlDigits: configuredWhatsappDigits || '201060070093',
  getPhoneHref(): string {
    return `tel:${this.companyPhoneIntl}`;
  },
  getWhatsappHref(customMessage?: string): string {
    const defaultMsg =
      customMessage ||
      'مرحباً نشكا للسياحة، أرغب في الاستفسار عن خدمة التأشيرة السياحية السعودية.';
    const encoded = encodeURIComponent(defaultMsg);
    return `https://wa.me/${this.whatsappIntlDigits}?text=${encoded}`;
  },
} as const;
