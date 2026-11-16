import React from 'react';
import { CheckCircle2, ClipboardCheck, Fingerprint, Send } from 'lucide-react';
import { APPLICATION_STEPS } from '../../constants/content';
import { SectionHeader } from '../../components/common/SectionHeader';
import { NashkaStepCard } from '../../components/ui/NashkaStepCard';

const STEP_ICONS = [Send, ClipboardCheck, Fingerprint, CheckCircle2] as const;

export function ApplicationStepsSection() {
  return (
    <section id="steps" className="py-11 sm:py-14 lg:py-20 bg-[#F4F8FC] border-b border-[#E8EDF4] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          kicker="رحلتك تبدأ بخطوات بسيطة"
          title="خطوات التقديم"
          description="نتولى إجراءات طلبك بعناية، من استلام المستندات حتى صدور التأشيرة."
          align="center"
        />

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6 items-stretch">
          {APPLICATION_STEPS.map((step, idx) => {
            const StepIcon = STEP_ICONS[idx] || CheckCircle2;

            return (
              <li key={step.stepNumber} className="flex">
                <NashkaStepCard
                  icon={StepIcon}
                  stepNumber={step.stepNumber}
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
