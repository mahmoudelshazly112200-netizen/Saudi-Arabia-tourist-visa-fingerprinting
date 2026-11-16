export const BRAND_TOKENS = {
  colors: {
    royalBlue: '#171C91',
    darkBlue: '#10145F',
    actionBlue: '#004AAD',
    skyBlue: '#C5E5FF',
    gold: '#D5A43B',
    deepBlack: '#17213B',
    primaryText: '#17213B',
    white: '#FFFFFF',
    cloudWhite: '#F3F7FC',
    softBackground: '#F3F7FC',
    softGray: '#E6ECF4',
    neutral: '#E6ECF4',
    secondaryText: '#68758A',
  },
  fonts: {
    arabic: 'Tajawal',
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

const configuredSiteUrl = (envObj.VITE_SITE_URL || '').trim().replace(/\/+$/, '');

export function getSiteOrigin(): string {
  if (configuredSiteUrl) return configuredSiteUrl;
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return '';
}

export function normalizeWhatsappDigits(phone: string): string {
  const digits = (phone || '').replace(/[^\d]/g, '');
  if (!digits) return '';
  if (digits.startsWith('00')) return digits.slice(2);
  if (digits.startsWith('0') && digits.length === 11) return `20${digits.slice(1)}`;
  return digits;
}

export function buildCustomerWhatsappHref(phone: string, message: string): string {
  const normalized = normalizeWhatsappDigits(phone);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${normalized}?text=${encoded}`;
}

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
