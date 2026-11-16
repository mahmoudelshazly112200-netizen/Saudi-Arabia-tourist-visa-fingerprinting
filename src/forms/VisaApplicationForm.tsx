import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  MessageCircle,
  RotateCcw,
  Search,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { CONTACT_CONFIG, VISA_SERVICE_CONFIG } from '../constants/brand';
import { BANK_STATEMENT_OPTIONS } from '../constants/content';
import { useApplicationForm } from '../hooks/useApplicationForm';
import {
  BankStatementStatus,
  SubmissionOutcomeStatus,
  VisaApplicationFormData,
} from '../types/visa';
import {
  calculateTotalVisaPrice,
  formatApplicantsLabel,
  formatEgpAmount,
  getBankStatementStatusLabel,
} from '../utils/formatters';
import { getLocalTodayIso, validateVisaApplicationForm } from '../utils/validation';
import { Button } from '../components/ui/Button';
import {
  ApplicantCounter,
  FileUploadField,
  TextAreaField,
  TextField,
} from '../components/ui/FormControls';

type WizardStepNumber = 1 | 2 | 3 | 4;

interface WizardStepConfig {
  number: WizardStepNumber;
  title: string;
  shortTitle: string;
  fields: (keyof VisaApplicationFormData)[];
}

const WIZARD_STEPS: readonly WizardStepConfig[] = [
  {
    number: 1,
    title: 'البيانات الشخصية',
    shortTitle: 'الشخصية',
    fields: ['fullName', 'phoneNumber', 'nationality', 'currentProfession'],
  },
  {
    number: 2,
    title: 'بيانات السفر',
    shortTitle: 'السفر',
    fields: ['expectedTravelDate', 'applicantsCount'],
  },
  {
    number: 3,
    title: 'المستندات المطلوبة',
    shortTitle: 'المستندات',
    fields: ['passportDocument', 'personalPhoto'],
  },
  {
    number: 4,
    title: 'حالة كشف الحساب البنكي',
    shortTitle: 'كشف الحساب',
    fields: ['bankStatementStatus', 'explanatoryNotes', 'dataUsageConsent'],
  },
];

export function VisaApplicationForm() {
  const {
    formData,
    errors,
    outcome,
    isSubmitting,
    updateField,
    incrementApplicants,
    decrementApplicants,
    handleFileSelect,
    validateStepFields,
    handleSubmit,
    resetForm,
  } = useApplicationForm();

  const topFeedbackRef = React.useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = React.useState<WizardStepNumber>(1);
  const [copiedRef, setCopiedRef] = React.useState(false);

  const todayIso = getLocalTodayIso();
  const totalAmountEgp = calculateTotalVisaPrice(formData.applicantsCount);
  const activeStepConfig = WIZARD_STEPS[currentStep - 1];
  const activeStepErrors = activeStepConfig.fields.filter((field) => Boolean(errors[field]));
  const hasVisibleErrors = activeStepErrors.length > 0;

  React.useEffect(() => {
    if (
      outcome.status === SubmissionOutcomeStatus.SUBMITTED_CONFIRMED ||
      outcome.status === SubmissionOutcomeStatus.ERROR
    ) {
      topFeedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [outcome.status]);

  const scrollToFormTop = () => {
    topFeedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleNextStep = () => {
    const isValid = validateStepFields(activeStepConfig.fields);
    if (!isValid) {
      scrollToFormTop();
      return;
    }
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as WizardStepNumber);
      scrollToFormTop();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as WizardStepNumber);
      scrollToFormTop();
    }
  };

  const handleStepSelect = (targetStep: WizardStepNumber) => {
    if (targetStep === currentStep) return;

    if (targetStep < currentStep) {
      setCurrentStep(targetStep);
      scrollToFormTop();
      return;
    }

    for (let stepIdx = currentStep; stepIdx < targetStep; stepIdx += 1) {
      const stepConfig = WIZARD_STEPS[stepIdx - 1];
      const ok = validateStepFields(stepConfig.fields);
      if (!ok) {
        setCurrentStep(stepConfig.number);
        scrollToFormTop();
        return;
      }
    }

    setCurrentStep(targetStep);
    scrollToFormTop();
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const validationErrors = validateVisaApplicationForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      const firstInvalidStep = WIZARD_STEPS.find((step) =>
        step.fields.some((field) => Boolean(validationErrors[field]))
      );
      if (firstInvalidStep && firstInvalidStep.number !== currentStep) {
        setCurrentStep(firstInvalidStep.number);
      }
      await handleSubmit(event);
      scrollToFormTop();
      return;
    }

    await handleSubmit(event);
  };

  const handleResetWizard = () => {
    resetForm();
    setCurrentStep(1);
    scrollToFormTop();
  };

  const confirmedRef = outcome.confirmedReferenceId || '';
  const whatsappSummaryMessage = [
    'مرحباً نشكا للسياحة، قمت بتسجيل طلب التأشيرة السياحية السعودية عبر المنصة:',
    confirmedRef ? `- رقم الطلب المرجعي: ${confirmedRef}` : null,
    `- الاسم الكامل: ${formData.fullName || '-'}`,
    `- الجنسية: ${formData.nationality || '-'}`,
    `- المهنة الحالية: ${formData.currentProfession || '-'}`,
    `- تاريخ السفر المتوقع: ${formData.expectedTravelDate || '-'}`,
    `- عدد المتقدمين: ${formData.applicantsCount} (${formatEgpAmount(totalAmountEgp)} ج.م)`,
    `- حالة كشف الحساب: ${getBankStatementStatusLabel(formData.bankStatementStatus)}`,
  ]
    .filter(Boolean)
    .join('\n');

  const trackUrl = confirmedRef
    ? `/track?ref=${encodeURIComponent(confirmedRef)}&phone=${encodeURIComponent(formData.phoneNumber)}`
    : '/track';

  const isConfirmed =
    outcome.status === SubmissionOutcomeStatus.SUBMITTED_CONFIRMED && Boolean(confirmedRef);

  return (
    <div ref={topFeedbackRef} className="space-y-5 sm:space-y-6 scroll-mt-24">
      {/* Server-Confirmed Submission Receipt */}
      {isConfirmed && (
        <section
          role="status"
          aria-live="polite"
          data-testid="submission-confirmed-panel"
          className="rounded-2xl border-2 border-[#16A36A]/40 bg-white p-5 sm:p-8 space-y-6"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#E9F8F0] border border-[#16A36A]/30 text-[#16A36A] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-[#16A36A]">
                تم حفظ الطلب وتأكيد استلام المستندات
              </p>
              <h2 className="mt-1 text-lg sm:text-2xl font-extrabold text-[#171C91]">
                شكراً لك، تم تسجيل طلب التأشيرة السياحية بنجاح
              </h2>
              <p className="mt-1.5 text-sm sm:text-base text-[#68758A] leading-relaxed">
                {outcome.message}
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-[#F3F7FC] border border-[#E6ECF4] p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-xs text-[#68758A] block">رقم الطلب المرجعي المؤكد</span>
              <span
                data-testid="confirmed-reference-id"
                className="font-extrabold text-base text-[#171C91] font-en tabular-nums block text-right mt-1"
                dir="ltr"
              >
                {confirmedRef}
              </span>
            </div>
            <div>
              <span className="text-xs text-[#68758A] block">اسم مقدم الطلب</span>
              <span className="font-bold text-[#17213B] block mt-1">{formData.fullName}</span>
            </div>
            <div>
              <span className="text-xs text-[#68758A] block">عدد المتقدمين والإجمالي</span>
              <span className="font-bold text-[#171C91] tabular-nums block mt-1">
                {formatApplicantsLabel(formData.applicantsCount)} ·{' '}
                {formatEgpAmount(outcome.calculatedTotalEgp ?? totalAmountEgp)}{' '}
                {VISA_SERVICE_CONFIG.currencyLabelAr}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
            <Link
              to={trackUrl}
              className="min-h-[48px] px-6 py-3 rounded-xl bg-[#171C91] hover:bg-[#10145F] text-white text-sm sm:text-base font-semibold inline-flex items-center justify-center gap-2 transition-colors"
            >
              <Search className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>متابعة حالة الطلب الآن</span>
            </Link>

            <Button
              href={CONTACT_CONFIG.getWhatsappHref(whatsappSummaryMessage)}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              size="md"
              className="min-h-[48px]"
            >
              <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>إرسال رقم المرجع عبر واتساب</span>
            </Button>

            <button
              type="button"
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.clipboard) {
                  void navigator.clipboard.writeText(confirmedRef);
                }
                setCopiedRef(true);
                window.setTimeout(() => setCopiedRef(false), 2000);
              }}
              className="min-h-[48px] px-4 py-2.5 rounded-xl border border-[#E6ECF4] bg-[#EAF4FF] hover:bg-[#C5E5FF]/60 text-sm font-semibold text-[#004AAD] inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              {copiedRef ? (
                <>
                  <Check className="w-4 h-4 text-[#16A36A] shrink-0" aria-hidden="true" />
                  <span className="text-[#16A36A]">تم نسخ رقم الطلب</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>نسخ رقم الطلب</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleResetWizard}
              className="min-h-[48px] px-4 py-2.5 rounded-xl text-sm font-semibold text-[#68758A] hover:text-[#17213B] hover:bg-[#F3F7FC] inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>تقديم طلب آخر</span>
            </button>
          </div>
        </section>
      )}

      {outcome.status === SubmissionOutcomeStatus.ERROR && (
        <section
          role="alert"
          className="rounded-2xl border border-[#DC3545]/35 bg-[#FDECEE] p-4 sm:p-5 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-[#DC3545] shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#DC3545]">
              تعذر إرسال الطلب إلى الخادم
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#17213B] leading-relaxed">{outcome.message}</p>
          </div>
        </section>
      )}

      {!isConfirmed && (
        <form onSubmit={handleFormSubmit} noValidate className="space-y-5 sm:space-y-6">
          {/* 4-Step Progress Indicator (2x2 on phones for readability, 4-col on sm+) */}
          <nav aria-label="خطوات تقديم الطلب" className="bg-white rounded-2xl border border-[#E6ECF4] p-3 sm:p-4">
            <ol className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {WIZARD_STEPS.map((step) => {
                const isActive = step.number === currentStep;
                const isCompleted = step.number < currentStep;

                return (
                  <li key={step.number} className="min-w-0">
                    <button
                      type="button"
                      onClick={() => handleStepSelect(step.number)}
                      aria-current={isActive ? 'step' : undefined}
                      className={[
                        'w-full h-full min-h-[48px] px-2.5 sm:px-3 py-2 rounded-xl border text-right transition-colors cursor-pointer flex items-center justify-start gap-2 sm:gap-2.5',
                        isActive
                          ? 'border-[#171C91] bg-[#F3F7FC] text-[#171C91]'
                          : isCompleted
                          ? 'border-[#C5E5FF] bg-white text-[#171C91] hover:bg-[#F3F7FC]'
                          : 'border-[#E6ECF4] bg-white text-[#68758A] hover:border-[#C5E5FF]',
                      ].join(' ')}
                    >
                      <span
                        className={[
                          'w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-extrabold tabular-nums flex items-center justify-center shrink-0',
                          isActive
                            ? 'bg-[#171C91] text-white'
                            : isCompleted
                            ? 'bg-[#FCF9F0] border border-[#D5A43B] text-[#876216]'
                            : 'bg-[#F3F7FC] text-[#68758A] border border-[#E6ECF4]',
                        ].join(' ')}
                      >
                        {isCompleted ? (
                          <Check className="w-4 h-4 text-[#D5A43B]" aria-hidden="true" />
                        ) : (
                          step.number
                        )}
                      </span>
                      <span className="text-[12.5px] sm:text-sm font-bold leading-snug">
                        <span className="sm:hidden">{step.shortTitle}</span>
                        <span className="hidden sm:inline">{step.title}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>

          {hasVisibleErrors && (
            <div
              role="alert"
              data-testid="form-validation-summary"
              className="rounded-xl border border-[#DC3545]/35 bg-[#FDECEE] p-3.5 sm:p-4 flex items-start gap-3 text-sm text-[#DC3545]"
            >
              <AlertCircle className="w-5 h-5 text-[#DC3545] shrink-0 mt-0.5" aria-hidden="true" />
              <p className="font-bold text-[#DC3545]">
                يرجى مراجعة الحقول المطلوبة واستكمال البيانات الموضحة باللون الأحمر.
              </p>
            </div>
          )}

          {/* Active Step Card */}
          <section className="bg-white rounded-2xl border border-[#E6ECF4] p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6">
            <div className="flex items-center justify-between gap-3 border-b border-[#E6ECF4] pb-3.5 sm:pb-4">
              <h2 className="text-[clamp(1.125rem,2vw,1.375rem)] font-bold text-[#171C91]">
                {activeStepConfig.title}
              </h2>
              <span className="text-xs sm:text-sm font-bold text-[#876216] tabular-nums shrink-0">
                الخطوة {currentStep} من 4
              </span>
            </div>

            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                <div className="md:col-span-2">
                  <TextField
                    name="fullName"
                    label="الاسم الكامل"
                    placeholder="مثال: محمد أحمد محمود علي"
                    value={formData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    error={errors.fullName}
                    hint="مطابق للاسم المدون في جواز السفر الساري."
                    requiredMark
                    autoComplete="name"
                  />
                </div>

                <TextField
                  name="phoneNumber"
                  label="رقم الهاتف / واتساب"
                  type="tel"
                  inputMode="tel"
                  inputDir="ltr"
                  placeholder="010XXXXXXXX"
                  value={formData.phoneNumber}
                  onChange={(e) => updateField('phoneNumber', e.target.value)}
                  error={errors.phoneNumber}
                  hint="يفضل رقم مفعل عليه واتساب للتنسيق."
                  requiredMark
                  autoComplete="tel"
                />

                <TextField
                  name="nationality"
                  label="الجنسية"
                  placeholder="مثال: مصري"
                  value={formData.nationality}
                  onChange={(e) => updateField('nationality', e.target.value)}
                  error={errors.nationality}
                  requiredMark
                />

                <div className="md:col-span-2">
                  <TextField
                    name="currentProfession"
                    label="المهنة الحالية"
                    placeholder="مثال: محاسب / طبيب / صاحب عمل / طالب"
                    value={formData.currentProfession}
                    onChange={(e) => updateField('currentProfession', e.target.value)}
                    error={errors.currentProfession}
                    requiredMark
                  />
                </div>
              </div>
            )}

            {/* Step 2: Travel Data + Cost Summary (ONLY in Step 2) */}
            {currentStep === 2 && (
              <div className="space-y-5 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-start">
                  <TextField
                    name="expectedTravelDate"
                    label="تاريخ السفر المتوقع"
                    type="date"
                    min={todayIso}
                    value={formData.expectedTravelDate}
                    onChange={(e) => updateField('expectedTravelDate', e.target.value)}
                    error={errors.expectedTravelDate}
                    requiredMark
                  />

                  <ApplicantCounter
                    value={formData.applicantsCount}
                    onIncrement={incrementApplicants}
                    onDecrement={decrementApplicants}
                    error={errors.applicantsCount}
                  />
                </div>

                {/* Package Cost Summary - displayed exclusively inside Step 2 */}
                <div className="rounded-xl bg-[#F3F7FC] border border-[#C5E5FF] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="space-y-0.5">
                    <p className="text-xs sm:text-sm font-bold text-[#171C91]">ملخص التكلفة</p>
                    <p className="text-xs sm:text-sm text-[#68758A] tabular-nums">
                      {formatEgpAmount(VISA_SERVICE_CONFIG.pricePerPersonEgp)}{' '}
                      {VISA_SERVICE_CONFIG.currencyLabelAr} ×{' '}
                      {formatApplicantsLabel(formData.applicantsCount)}
                    </p>
                  </div>
                  <p
                    data-testid="calculated-total-price"
                    className="text-lg sm:text-2xl font-extrabold text-[#171C91] tabular-nums"
                  >
                    {formatEgpAmount(totalAmountEgp)} {VISA_SERVICE_CONFIG.currencyLabelAr}
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Required Documents */}
            {currentStep === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-stretch">
                <FileUploadField
                  name="passportDocument"
                  label="جواز السفر"
                  description="صفحة البيانات الشخصية · الصيغ: JPG, PNG, WEBP, PDF · الحد الأقصى: 10 ميجابايت"
                  accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
                  document={formData.passportDocument}
                  error={errors.passportDocument}
                  onSelectFile={(file) => handleFileSelect('passportDocument', file)}
                />

                <FileUploadField
                  name="personalPhoto"
                  label="الصورة الشخصية"
                  description="صورة حديثة بخلفية فاتحة · الصيغ: JPG, PNG, WEBP · الحد الأقصى: 10 ميجابايت"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  document={formData.personalPhoto}
                  error={errors.personalPhoto}
                  onSelectFile={(file) => handleFileSelect('personalPhoto', file)}
                />
              </div>
            )}

            {/* Step 4: Bank Statement Status, Optional Notes, Consent & Submit */}
            {currentStep === 4 && (
              <div className="space-y-5 sm:space-y-6">
                <fieldset>
                  <legend className="block text-sm sm:text-base font-bold text-[#17213B] mb-3">
                    اختر حالة كشف الحساب البنكي
                    <span className="text-[#DC3545] mr-1" aria-hidden="true">*</span>
                  </legend>

                  <div className="space-y-2.5 sm:space-y-3">
                    {BANK_STATEMENT_OPTIONS.map((option) => {
                      const isSelected = formData.bankStatementStatus === option.value;
                      return (
                        <label
                          key={option.value}
                          className={[
                            'flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border transition-colors cursor-pointer min-h-[56px]',
                            isSelected
                              ? 'border-[#171C91] bg-[#EFF4FF]'
                              : 'border-[#E6ECF4] hover:border-[#C5E5FF] bg-white',
                          ].join(' ')}
                        >
                          <input
                            type="radio"
                            name="bankStatementStatus"
                            value={option.value}
                            checked={isSelected}
                            onChange={() =>
                              updateField('bankStatementStatus', option.value as BankStatementStatus)
                            }
                            className="mt-1 w-5 h-5 accent-[#171C91] shrink-0 cursor-pointer"
                          />
                          <div>
                            <span className="block text-sm sm:text-base font-bold text-[#17213B]">
                              {option.labelAr}
                            </span>
                            <span className="block text-xs sm:text-sm text-[#68758A] mt-0.5 leading-relaxed">
                              {option.descriptionAr}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  {errors.bankStatementStatus && (
                    <p
                      role="alert"
                      className="mt-2 flex items-center gap-1.5 text-sm font-medium text-[#DC3545]"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>{errors.bankStatementStatus}</span>
                    </p>
                  )}
                </fieldset>

                <TextAreaField
                  name="explanatoryNotes"
                  rows={3}
                  label="ملاحظات إضافية — اختياري"
                  placeholder="أضف أسماء المرافقين أو أي تفاصيل إضافية تود توضيحها لفريق نشكا..."
                  value={formData.explanatoryNotes}
                  onChange={(e) => updateField('explanatoryNotes', e.target.value)}
                  error={errors.explanatoryNotes}
                />

                <div className="pt-2 border-t border-[#E6ECF4] space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="dataUsageConsent"
                      checked={formData.dataUsageConsent}
                      onChange={(e) => updateField('dataUsageConsent', e.target.checked)}
                      className="mt-1 w-5 h-5 rounded accent-[#171C91] shrink-0 cursor-pointer"
                    />
                    <span className="text-xs sm:text-sm text-[#17213B] leading-relaxed">
                      <strong>الموافقة على استخدام البيانات:</strong> أقر بصحة البيانات والمستندات
                      المرفقة وأوافق على استخدامها لتجهيز طلب التأشيرة وحجز موعد تساهيل.
                      <span className="text-[#DC3545] mr-1" aria-hidden="true">*</span>
                    </span>
                  </label>

                  {errors.dataUsageConsent && (
                    <p
                      role="alert"
                      className="flex items-center gap-1.5 text-sm font-medium text-[#DC3545]"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>{errors.dataUsageConsent}</span>
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-xs sm:text-sm text-[#68758A]">
                    <ShieldCheck className="w-4 h-4 text-[#004AAD] shrink-0" aria-hidden="true" />
                    <span>يتم رفع المستندات وحفظ الطلب مباشرة على خادم المنصة.</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step Navigation Controls */}
            <div className="pt-4 sm:pt-5 border-t border-[#E6ECF4] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handlePreviousStep}
                  className="order-2 sm:order-1 w-full sm:w-auto sm:min-w-[150px] min-h-[48px]"
                >
                  <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>السابق</span>
                </Button>
              ) : (
                <div className="hidden sm:block" />
              )}

              {currentStep < 4 ? (
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={handleNextStep}
                  className="order-1 sm:order-2 w-full sm:w-auto sm:min-w-[180px] min-h-[48px]"
                >
                  <span>التالي</span>
                  <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  className="order-1 sm:order-2 w-full sm:w-auto sm:min-w-[220px] min-h-[48px]"
                >
                  <Send className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{isSubmitting ? 'جاري حفظ الطلب والمستندات...' : 'إرسال طلب التأشيرة'}</span>
                </Button>
              )}
            </div>
          </section>
        </form>
      )}
    </div>
  );
}
