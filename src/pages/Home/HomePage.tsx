import React from 'react';
import { CustomerLayout } from '../../components/layout/CustomerLayout';
import { HeroSection } from '../../sections/Hero/HeroSection';
import { WhyNashkaSection } from '../../sections/Features/WhyNashkaSection';
import { VisaBenefitsSection } from '../../sections/Benefits/VisaBenefitsSection';
import { VisaDetailsSection } from '../../sections/VisaDetails/VisaDetailsSection';
import { PricingSection } from '../../sections/Pricing/PricingSection';
import { JourneySection } from '../../sections/Journey/JourneySection';
import { RequiredDocumentsSection } from '../../sections/Documents/RequiredDocumentsSection';
import { ApplicationStepsSection } from '../../sections/Steps/ApplicationStepsSection';
import { FaqSection } from '../../sections/FAQ/FaqSection';
import { FinalCtaSection } from '../../sections/CTA/FinalCtaSection';
import { usePageMeta } from '../../hooks/usePageMeta';

export function HomePage() {
  usePageMeta({
    title: 'Nashka Saudi Tourist Visa Platform — نشكا للسياحة | التأشيرة السياحية السعودية',
    description:
      'تقديم إلكتروني متكامل على التأشيرة السياحية السعودية عبر شركة نشكا للسياحة بسعر 9,500 ج.م للفرد شامل تجهيز الملف وحجز موعد البصمة والمتابعة حتى الإصدار.',
    robots: 'index, follow',
    canonicalPath: '/',
  });

  return (
    <CustomerLayout>
      {/* SECTION 02 */}
      <HeroSection />
      {/* SECTION 03 */}
      <WhyNashkaSection />
      {/* SECTION 04 */}
      <VisaBenefitsSection />
      {/* SECTION 05 */}
      <VisaDetailsSection />
      {/* SECTION 06 */}
      <PricingSection />
      {/* SECTION 07 */}
      <JourneySection />
      {/* SECTION 08 */}
      <RequiredDocumentsSection />
      {/* SECTION 09 */}
      <ApplicationStepsSection />
      {/* SECTION 10 */}
      <FaqSection />
      {/* SECTION 11 */}
      <FinalCtaSection />
    </CustomerLayout>
  );
}
