import React from 'react';
import { APPLICATION_STEPS } from '../../constants/content';
import { SectionHeader } from '../../components/common/SectionHeader';
import { NashkaStepCard } from '../../components/ui/NashkaStepCard';
import {
  BiometricGateGlyph,
  ReviewProcessGlyph,
  SubmitRequestGlyph,
  VisaIssuedGlyph,
} from '../../components/ui/NashkaCardIcons';

const STEP_ICONS = [
  SubmitRequestGlyph,
  ReviewProcessGlyph,
  BiometricGateGlyph,
  VisaIssuedGlyph,
] as const;

export function ApplicationStepsSection() {
  return (
    <section id="steps" className="py-12 min-[390px]:py-14 lg:py-20 bg-[#F3F7FC] border-b border-[#E6ECF4] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 min-[390px]:px-5 sm:px-6 lg:px-8">
        <SectionHeader
          kicker="رحلتك تبدأ بخطوات بسيطة"
          title="خطوات التقديم"
          description="نتولى إجراءات طلبك بعناية، من استلام المستندات حتى صدور التأشيرة."
          align="center"
        />

        <ol className="nashka-grid-4 items-stretch">
          {APPLICATION_STEPS.map((step, idx) => {
            const StepIcon = STEP_ICONS[idx] || VisaIssuedGlyph;

            return (
              <li key={step.stepNumber} className="flex">
                <NashkaStepCard
                  icon={StepIcon}
                  stepNumber={step.stepNumber}
                  shapeVariant={idx % 2 === 0 ? 'arc-start' : 'arc-end'}
                  title={step.title}
                  description={step.description}
                  className="w-full"
                />
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
