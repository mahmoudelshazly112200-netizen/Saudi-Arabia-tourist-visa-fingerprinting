import {
  BankStatementStatus,
  FaqCategory,
  FaqItem,
  JourneyDestinationCardItem,
  StepItem,
  VisaBenefitCardItem,
} from '../types/visa';
import { AdminRole, RolePermissionMatrix } from '../types/admin';

import heroArabFamilyRiyadhImg from '../assets/images/hero_arab_family_riyadh_1794659157144.jpg';
import heroRiyadhWideImg from '../assets/images/hero_riyadh_kingdom_wide_1794662637356.jpg';
import heroRiyadhPortraitImg from '../assets/images/hero_riyadh_kingdom_portrait_1794662637800.jpg';
import umrahCourtyardImg from '../assets/images/umrah_custom_user.png';
import makkahHaramImg from '../assets/images/makkah_haram_kaaba_1794659155936.jpg';
import madinahMosqueImg from '../assets/images/madinah_prophets_mosque_1794659159543.jpg';
import riyadhSkylineImg from '../assets/images/dest_riyadh_skyline_1794656707534.jpg';
import alulaRocksImg from '../assets/images/dest_alula_maraya_1794656707628.jpg';
import alulaNatureImg from '../assets/images/hero_saudi_tourism_1794656705960.jpg';
import shoppingBoulevardImg from '../assets/images/saudi_shopping_boulevard_1794659161007.jpg';
import jeddahEventsImg from '../assets/images/dest_jeddah_redsea_1794656707699.jpg';
import documentsShowcaseImg from '../assets/images/documents_custom_user.png';
import familyHospitalityImg from '../assets/images/saudi_family_hospitality_1794682805497.jpg';
import riyadhSeasonFestivalImg from '../assets/images/riyadh_season_festival_1794682805164.jpg';

export const GENERATED_IMAGES = {
  heroArabFamilyRiyadh: heroArabFamilyRiyadhImg,
  heroRiyadhWide: heroRiyadhWideImg,
  heroRiyadhPortrait: heroRiyadhPortraitImg,
  umrahCourtyard: umrahCourtyardImg,
  makkahHaram: makkahHaramImg,
  madinahMosque: madinahMosqueImg,
  riyadhSkyline: riyadhSkylineImg,
  alulaRocks: alulaRocksImg,
  alulaNature: alulaNatureImg,
  shoppingBoulevard: shoppingBoulevardImg,
  jeddahEvents: jeddahEventsImg,
  documentsShowcase: documentsShowcaseImg,
  familyHospitality: familyHospitalityImg,
  riyadhSeasonFestival: riyadhSeasonFestivalImg,
} as const;

export const NAV_LINKS = [
  { label: 'لماذا نشكا؟', href: '/#why-nashka' },
  { label: 'المزايا', href: '/#benefits' },
  { label: 'الأسعار والخدمات', href: '/#pricing' },
  { label: 'خطوات التقديم', href: '/#steps' },
  { label: 'الأسئلة الشائعة', href: '/#faq' },
] as const;

export const WHY_NASHKA_HEADER = {
  kicker: 'خدمة متخصصة وموثوقة',
  title: 'لماذا تختار نشكا؟',
  description: 'خبرة ومتابعة موثوقة في كل خطوة من رحلتك للحصول على التأشيرة.',
} as const;

export const WHY_NASHKA_PROMISE = {
  title: 'مرافقة موثوقة من البداية للنهاية',
  description: 'نضع دقة ملفك ووضوح الإجراءات في المقام الأول لتخوض تجربتك باطمئنان.',
  ctaLabel: 'ابدأ طلب التأشيرة',
} as const;

export const WHY_NASHKA_CARDS = [
  {
    id: 'precision',
    iconKey: 'fileCheck',
    title: 'دقة قبل التقديم',
    description: 'فحص شامل للبيانات والمستندات قبل تقديم الطلب لتفادي أي ملاحظات شكلية.',
  },
  {
    id: 'clarity',
    iconKey: 'compass',
    title: 'وضوح وتوجيه مباشر',
    description: 'ترتيب عملي ومنظم لكل إجراء يغنيك عن عناء البحث والحيرة في التفاصيل.',
  },
  {
    id: 'followup',
    iconKey: 'activity',
    title: 'متابعة أولاً بأول',
    description: 'تواصل مستمر لإطلاعك على مستجدات حالة طلبك حتى تكتمل الإجراءات.',
  },
  {
    id: 'support',
    iconKey: 'headset',
    title: 'دعم متخصص معك',
    description: 'فريق متخصص متاح للإجابة عن استفساراتك وتقديم المساندة بثقة واهتمام.',
  },
] as const;

export const VISA_BENEFIT_CARDS: VisaBenefitCardItem[] = [
  {
    id: 'umrah',
    numberLabel: '01',
    title: 'أداء مناسك العمرة',
    description: 'أداء العمرة وزيارة المسجد النبوي بيسر.',
    imageUrl: GENERATED_IMAGES.umrahCourtyard,
    imageAlt: 'معتمر يرفع يديه بالدعاء أمام الكعبة المشرفة بالمسجد الحرام',
    featured: true,
    imagePosition: 'top',
  },
  {
    id: 'explore-kingdom',
    numberLabel: '02',
    title: 'استكشاف المملكة',
    description: 'جولات حرة بين مدن المملكة ومعالمها.',
    imageUrl: GENERATED_IMAGES.riyadhSkyline,
    imageAlt: 'أفق مدينة الرياض وبرج المملكة وقت الغروب',
    featured: true,
    imagePosition: 'center',
  },
  {
    id: 'visit-relatives',
    numberLabel: '03',
    title: 'زيارة الأهل والأصدقاء',
    description: 'لقاء الأحبة وقضاء أوقات عائلية دافئة.',
    imageUrl: GENERATED_IMAGES.familyHospitality,
    imageAlt: 'لقاء عائلي عربي دافئ وتقديم القهوة السعودية في المملكة',
    imagePosition: 'center',
  },
  {
    id: 'seasons-events',
    numberLabel: '04',
    title: 'الفعاليات والمواسم',
    description: 'حضور المواسم والفعاليات طوال العام.',
    imageUrl: GENERATED_IMAGES.riyadhSeasonFestival,
    imageAlt: 'أجواء الفعاليات والمواسم السعودية المضاءة ليلاً في الرياض',
    imagePosition: 'center',
  },
  {
    id: 'shopping-entertainment',
    numberLabel: '05',
    title: 'التسوق والترفيه',
    description: 'مجمعات عصرية وتجارب ترفيهية رائعة.',
    imageUrl: GENERATED_IMAGES.shoppingBoulevard,
    imageAlt: 'ممشى تسوق وترفيه حديث في السعودية وقت المساء',
    imagePosition: 'center',
  },
  {
    id: 'heritage-nature',
    numberLabel: '06',
    title: 'التراث والطبيعة',
    description: 'اكتشف المواقع التراثية وطبيعة العلا.',
    imageUrl: GENERATED_IMAGES.alulaNature,
    imageAlt: 'التكوينات الصخرية والطبيعة الصحراوية الساحرة في العلا',
    imagePosition: 'center',
  },
];

export const VISA_SPEC_CARDS = [
  {
    id: 'validity',
    iconKey: 'calendar',
    label: 'صلاحية التأشيرة',
    value: '90 يومًا',
  },
  {
    id: 'stay-duration',
    iconKey: 'clock',
    label: 'مدة الإقامة',
    value: '90 يومًا',
  },
  {
    id: 'entries',
    iconKey: 'logIn',
    label: 'عدد مرات الدخول',
    value: 'مرة واحدة',
  },
  {
    id: 'processing-time',
    iconKey: 'timer',
    label: 'مدة الإصدار',
    value: '3 أيام عمل',
  },
] as const;

export const BIOMETRIC_NOTICE_TEXT = 'البصمة الحيوية: موعد البصمة مطلوب لدى مركز تساهيل.';

/**
 * Mandatory Constraint from Section 06:
 * Exact 6 approved inclusions without adding or deleting any item.
 */
export const PACKAGE_INCLUSIONS = [
  'تقديم طلب التأشيرة وسداد رسوم إنجاز',
  'إصدار وثيقة التأمين الطبي المعتمدة',
  'حجز موعد البصمة عبر مركز تساهيل',
  'حجز مبدئي لتذاكر الطيران والإقامة بالفندق',
  'تدقيق شامل على الملف وكافة المستندات',
  'متابعة مستمرة للطلب حتى صدور التأشيرة',
] as const;

export const JOURNEY_DESTINATIONS: JourneyDestinationCardItem[] = [
  {
    id: 'dest-riyadh',
    city: 'الرياض',
    landmark: 'برج المملكة وأفق العاصمة',
    imageUrl: GENERATED_IMAGES.riyadhSkyline,
  },
  {
    id: 'dest-jeddah',
    city: 'جدة',
    landmark: 'كورنيش جدة والبحر الأحمر',
    imageUrl: GENERATED_IMAGES.jeddahEvents,
  },
  {
    id: 'dest-makkah',
    city: 'مكة المكرمة',
    landmark: 'المسجد الحرام',
    imageUrl: GENERATED_IMAGES.makkahHaram,
  },
  {
    id: 'dest-madinah',
    city: 'المدينة المنورة',
    landmark: 'المسجد النبوي الشريف',
    imageUrl: GENERATED_IMAGES.madinahMosque,
  },
];

export const REQUIRED_DOCUMENTS_CARDS = [
  {
    id: 'doc-passport',
    iconKey: 'passport',
    title: 'صورة جواز السفر',
    description: 'ساري لمدة لا تقل عن 6 أشهر.',
    timingLabel: 'عند بدء التقديم',
    isBiometricOnly: false,
  },
  {
    id: 'doc-photo',
    iconKey: 'photo',
    title: 'صورة شخصية',
    description: 'صورة حديثة بمقاس 4×6 سم.',
    timingLabel: 'عند بدء التقديم',
    isBiometricOnly: false,
  },
  {
    id: 'doc-bank',
    iconKey: 'bank',
    title: 'كشف حساب بنكي',
    description: 'برصيد يبدأ من 50,000 ج.م.',
    timingLabel: 'أثناء إجراء البصمة',
    isBiometricOnly: true,
  },
] as const;

export const DOCUMENTS_EXPLANATORY_NOTE =
  'كشف الحساب البنكي يُطلب فقط أثناء إجراء البصمة، وليس ضمن مستندات بدء التقديم.';

export const APPLICATION_STEPS: StepItem[] = [
  {
    stepNumber: '01',
    title: 'المستندات',
    description: 'أرسل جواز السفر والصورة الشخصية.',
  },
  {
    stepNumber: '02',
    title: 'المراجعة',
    description: 'ندقق المستندات ونجهز طلبك.',
  },
  {
    stepNumber: '03',
    title: 'البصمة',
    description: 'نحجز لك موعد إجراء البصمة.',
  },
  {
    stepNumber: '04',
    title: 'المتابعة',
    description: 'نتابع طلبك حتى صدور التأشيرة.',
  },
];

export const BANK_STATEMENT_OPTIONS: {
  value: BankStatementStatus;
  labelAr: string;
  descriptionAr: string;
}[] = [
  {
    value: BankStatementStatus.AVAILABLE_IF_REQUESTED,
    labelAr: 'متوفر',
    descriptionAr: 'لديّ كشف حساب بنكي برصيد لا يقل عن 50,000 جنيه مصري، وسأقدمه أثناء البصمة.',
  },
  {
    value: BankStatementStatus.NOT_AVAILABLE_CURRENTLY,
    labelAr: 'قيد التجهيز',
    descriptionAr: 'أعمل على تجهيز كشف الحساب قبل موعد البصمة.',
  },
  {
    value: BankStatementStatus.NEED_CONSULTATION,
    labelAr: 'أحتاج إلى استشارة',
    descriptionAr: 'أرغب في استشارة فريق نشكا بشأن متطلبات كشف الحساب.',
  },
];

export const FAQ_CATEGORIES: { value: FaqCategory; label: string }[] = [
  { value: 'all', label: 'جميع الأسئلة' },
  { value: 'cost_fees', label: 'التكلفة والرسوم' },
  { value: 'documents_biometrics', label: 'المستندات والبصمة' },
  { value: 'processing_rules', label: 'المدة والضوابط' },
  { value: 'application_tracking', label: 'التقديم والمتابعة' },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'cost_fees',
    question: 'كم تبلغ تكلفة خدمة التأشيرة السياحية؟',
    answer:
      'تبلغ تكلفة خدمة التأشيرة السياحية السعودية 9,500 ج.م للفرد الواحد، وتشمل خدمات الباقة الست المعتمدة الموضحة في قسم الأسعار والخدمات.',
  },
  {
    id: 'faq-2',
    category: 'documents_biometrics',
    question: 'ما هي المستندات المطلوبة لبدء الطلب؟',
    answer:
      'لبدء الطلب عبر المنصة تحتاج فقط إلى مستندين عند بدء التقديم: صورة جواز السفر (ساري لمدة لا تقل عن 6 أشهر)، وصورة شخصية (صورة حديثة بمقاس 4×6 سم).',
  },
  {
    id: 'faq-3',
    category: 'documents_biometrics',
    question: 'هل كشف الحساب البنكي مطلوب عند بدء التقديم؟',
    answer:
      'لا، كشف الحساب البنكي (برصيد لا يقل عن 50,000 جنيه مصري) يُطلب فقط أثناء إجراء البصمة لدى مركز تساهيل، وليس عند بدء التقديم.',
  },
  {
    id: 'faq-4',
    category: 'processing_rules',
    question: 'كم تستغرق مدة معالجة واستخراج التأشيرة؟',
    answer:
      'تبلغ مدة الإصدار المعتادة 3 أيام عمل بعد استكمال التقديم وإجراء البصمة، بصلاحية 90 يومًا ومدة إقامة 90 يومًا لدخول مرة واحدة.',
  },
  {
    id: 'faq-5',
    category: 'documents_biometrics',
    question: 'هل يشترط الذهاب إلى مركز تساهيل شخصيًا؟',
    answer:
      'نعم، الحضور لإجراء البصمة الحيوية لدى مركز تساهيل مطلوب، ويتولى فريق نشكا حجز الموعد ضمن خدمات الباقة.',
  },
  {
    id: 'faq-6',
    category: 'processing_rules',
    question: 'هل قبول التأشيرة مضمون 100%؟',
    answer:
      'نراجع الملف وندقق المستندات بأعلى دقة، لكن قرار قبول وإصدار التأشيرة النهائي يخضع حصريًا للجهات الرسمية المختصة بالمملكة دون ضمان مسبق.',
  },
  {
    id: 'faq-7',
    category: 'processing_rules',
    question: 'هل تسمح التأشيرة السياحية بأداء مناسك العمرة؟',
    answer:
      'نعم، تتيح التأشيرة السياحية أداء مناسك العمرة وزيارة المسجد الحرام والمسجد النبوي، إلى جانب زيارة مدن وفعاليات المملكة وفق الضوابط الرسمية.',
  },
  {
    id: 'faq-8',
    category: 'cost_fees',
    question: 'هل توجد أي رسوم أو مصاريف إضافية غير معلنة؟',
    answer:
      'السعر المعلن هو 9,500 ج.م للفرد الواحد، ويشمل تقديم طلب التأشيرة وسداد رسوم إنجاز، إصدار وثيقة التأمين الطبي المعتمدة، حجز موعد البصمة عبر مركز تساهيل، حجز مبدئي لتذاكر الطيران والإقامة بالفندق، تدقيق شامل على الملف وكافة المستندات، ومتابعة مستمرة للطلب حتى صدور التأشيرة.',
  },
  {
    id: 'faq-9',
    category: 'application_tracking',
    question: 'كيف أبدأ في تقديم طلب التأشيرة الآن؟',
    answer:
      'اضغط على «ابدأ طلب التأشيرة الآن» للانتقال إلى صفحة التقديم، ثم أدخل بياناتك وارفع صورة جواز السفر والصورة الشخصية وأرسل الطلب للمراجعة مع فريق نشكا.',
  },
  {
    id: 'faq-10',
    category: 'processing_rules',
    question: 'ما هي السياسة المتبعة في حال تعذر صدور التأشيرة؟',
    answer:
      'في حال تعذر صدور التأشيرة نتيجة إجراءات الاستقصاء أو مراجعة الجهات المختصة، يتم التواصل مع العميل لمراجعة حالة الطلب وتوضيح الإجراءات المتاحة وفقًا لشروط الخدمة والسياسات المعتمدة لدى نشكا. ولا يُعد تعذر إصدار التأشيرة بحد ذاته ضمانًا لاسترداد أي مبالغ، إذ تخضع معالجة الحالة لمراجعة تفاصيل الطلب والرسوم المدفوعة وشروط الخدمة.',
  },
];

export const ADMIN_ROLES_MATRIX: RolePermissionMatrix[] = [
  {
    role: AdminRole.SUPER_ADMIN,
    titleAr: 'مدير النظام العام',
    titleEn: 'Super Admin',
    descriptionAr: 'صلاحيات كاملة لإدارة النظام، الموظفين، الأدوار، الطلبات، العملاء، وسجلات النشاط.',
    permissions: {
      viewApplications: true,
      updateApplicationStatus: true,
      reviewDocuments: true,
      manageCustomers: true,
      managePayments: true,
      manageUsersAndRoles: true,
    },
  },
  {
    role: AdminRole.VISA_OPERATIONS_MANAGER,
    titleAr: 'مدير عمليات التأشيرات',
    titleEn: 'Visa Operations Manager',
    descriptionAr: 'إدارة دورة حياة طلبات التأشيرات، تحديث الحالات، واعتماد الملفات الجاهزة للمعالجة.',
    permissions: {
      viewApplications: true,
      updateApplicationStatus: true,
      reviewDocuments: true,
      manageCustomers: true,
      managePayments: true,
      manageUsersAndRoles: false,
    },
  },
  {
    role: AdminRole.DOCUMENT_REVIEWER,
    titleAr: 'مراجع المستندات',
    titleEn: 'Document Reviewer',
    descriptionAr: 'فحص وضوح وصلاحية جوازات السفر والصور الشخصية المرفوعة وطلب الاستبدال عند الحاجة.',
    permissions: {
      viewApplications: true,
      updateApplicationStatus: false,
      reviewDocuments: true,
      manageCustomers: false,
      managePayments: false,
      manageUsersAndRoles: false,
    },
  },
  {
    role: AdminRole.CUSTOMER_SUPPORT,
    titleAr: 'مسؤول خدمة العملاء',
    titleEn: 'Customer Support',
    descriptionAr: 'متابعة استفسارات العملاء والاطلاع على حالة الطلبات والملاحظات التوضيحية.',
    permissions: {
      viewApplications: true,
      updateApplicationStatus: false,
      reviewDocuments: false,
      manageCustomers: true,
      managePayments: false,
      manageUsersAndRoles: false,
    },
  },
];
