import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle2,
  Info,
  MessageCircle,
  RotateCcw,
  Search,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { CONTACT_CONFIG, VISA_SERVICE_CONFIG } from '../constants/brand';
import { BANK_STATEMENT_OPTIONS, DOCUMENTS_EXPLANATORY_NOTE } from '../constants/content';
import { useApplicationForm } from '../hooks/useApplicationForm';
import { BankStatementStatus, SubmissionOutcomeStatus } from '../types/visa';
import {
  calculateTotalVisaPrice,
  formatApplicantsLabel,
  formatEgpAmount,
  getBankStatementStatusLabel,
} from '../utils/formatters';
import { getLocalTodayIso } from '../utils/validation';
import { Button } from '../components/ui/Button';
import {
  ApplicantCounter,
  FileUploadField,
  TextAreaField,
  TextField,
} from '../components/ui/FormControls';

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
    handleSubmit,
    resetForm,
  } = useApplicationForm();

  const topFeedbackRef = React.useRef<HTMLDivElement>(null);
  const todayIso = getLocalTodayIso();
  const totalAmountEgp = calculateTotalVisaPrice(formData.applicantsCount);
  const hasErrors = Object.keys(errors).length > 0;

  React.useEffect(() => {
    if (
      hasErrors ||
      outcome.status === SubmissionOutcomeStatus.SUBMITTED_CONFIRMED ||
      outcome.status === SubmissionOutcomeStatus.ERROR
    ) {
      topFeedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [hasErrors, outcome.status]);

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

  return (
    <div ref={topFeedbackRef} className="space-y-8 scroll-mt-24">
      {/* Server-Confirmed Submission Receipt */}
      {outcome.status === SubmissionOutcomeStatus.SUBMITTED_CONFIRMED && confirmedRef && (
        <section
          role="status"
          aria-live="polite"
          data-testid="submission-confirmed-panel"
          className="rounded-3xl border-2 border-emerald-300 bg-white p-6 sm:p-8 shadow-[0_12px_32px_-10px_rgba(21,128,61,0.12)] space-y-6"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-emerald-700">
                تم حفظ الطلب وتأكيد استلام المستندات
              </p>
              <h2 className="mt-1 text-lg sm:text-2xl font-extrabold text-[#161A8D]">
                شكراً لك، تم تسجيل طلب التأشيرة السياحية بنجاح
              </h2>
              <p className="mt-1.5 text-sm sm:text-base text-[#5A657D] leading-relaxed">
                {outcome.message}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#FAF8F5] border border-[#E5EAF2] p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-xs text-[#5A657D] block">رقم الطلب المرجعي المؤكد</span>
              <span
                data-testid="confirmed-reference-id"
                className="font-extrabold text-base text-[#161A8D] font-en tabular-nums block text-right mt-1"
                dir="ltr"
              >
                {confirmedRef}
              </span>
            </div>
            <div>
              <span className="text-xs text-[#5A657D] block">اسم مقدم الطلب</span>
              <span className="font-bold text-slate-900 block mt-1">{formData.fullName}</span>
            </div>
            <div>
              <span className="text-xs text-[#5A657D] block">عدد المتقدمين والإجمالي</span>
              <span className="font-bold text-[#161A8D] tabular-nums block mt-1">
                {formatApplicantsLabel(formData.applicantsCount)} ·{' '}
                {formatEgpAmount(outcome.calculatedTotalEgp ?? totalAmountEgp)} ج.م
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
            <Link
              to={trackUrl}
              className="min-h-[48px] px-6 py-3 rounded-xl bg-[#161A8D] hover:bg-[#10136B] text-white text-sm sm:text-base font-semibold inline-flex items-center justify-center gap-2 transition-colors"
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
            >
              <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>إرسال رقم المرجع عبر واتساب</span>
            </Button>

            <button
              type="button"
              onClick={resetForm}
              className="min-h-[46px] px-4 py-2.5 rounded-xl text-sm font-semibold text-[#5A657D] hover:text-slate-900 hover:bg-slate-100 inline-flex items-center justify-center gap-1.5 cursor-pointer"
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
          className="rounded-2xl border border-red-300 bg-red-50 p-5 sm:p-6 flex items-start gap-3.5"
        >
          <AlertCircle className="w-6 h-6 text-red-700 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h2 className="text-base sm:text-lg font-bold text-red-900">
              تعذر إرسال الطلب إلى الخادم
            </h2>
            <p className="mt-1 text-sm text-red-800 leading-relaxed">{outcome.message}</p>
          </div>
        </section>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-7">
        {hasErrors && (
          <div
            role="alert"
            data-testid="form-validation-summary"
            className="rounded-xl border border-red-300 bg-red-50 p-4 flex items-start gap-3 text-sm text-red-800"
          >
            <AlertCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-bold text-red-900">
                يرجى مراجعة الحقول المطلوبة واستكمال البيانات الموضحة باللون الأحمر قبل إرسال الطلب.
              </p>
            </div>
          </div>
        )}

        {/* Group 1: Applicant Information */}
        <section className="bg-white rounded-2xl border border-[#E5EAF2] p-5 sm:p-7 lg:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <p className="text-xs font-bold text-[#8B6918] mb-1">الخطوة 1 من 4</p>
            <h2 className="text-xl sm:text-2xl font-bold text-[#161A8D]">
              بيانات المتقدم الأساسية
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <div className="md:col-span-2">
              <TextField
                label="الاسم الكامل"
                placeholder="مثال: محمد أحمد محمود علي"
                value={formData.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
                error={errors.fullName}
                hint="اكتب الاسم الكامل مطابقاً لما هو مدون في جواز السفر الساري."
                requiredMark
                autoComplete="name"
              />
            </div>

            <TextField
              label="رقم الهاتف / واتساب"
              type="tel"
              inputMode="tel"
              inputDir="ltr"
              placeholder="010XXXXXXXX"
              value={formData.phoneNumber}
              onChange={(e) => updateField('phoneNumber', e.target.value)}
              error={errors.phoneNumber}
              hint="يفضل إدخال رقم مفعل عليه واتساب لمتابعة حجز موعد البصمة."
              requiredMark
              autoComplete="tel"
            />

            <TextField
              label="الجنسية"
              placeholder="مثال: مصري"
              value={formData.nationality}
              onChange={(e) => updateField('nationality', e.target.value)}
              error={errors.nationality}
              requiredMark
            />

            <div className="md:col-span-2">
              <TextField
                label="المهنة الحالية"
                placeholder="مثال: محاسب / طبيب / صاحب عمل / طالب"
                value={formData.currentProfession}
                onChange={(e) => updateField('currentProfession', e.target.value)}
                error={errors.currentProfession}
                hint="اذكر المهنة الحالية أو المسمى الوظيفي الفعلي."
                requiredMark
              />
            </div>
          </div>
        </section>

        {/* Group 2: Travel Information & Applicant Counter */}
        <section className="bg-white rounded-2xl border border-[#E5EAF2] p-5 sm:p-7 lg:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <p className="text-xs font-bold text-[#8B6918] mb-1">الخطوة 2 من 4</p>
            <h2 className="text-xl sm:text-2xl font-bold text-[#161A8D]">
              بيانات السفر وعدد المتقدمين
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-start">
            <TextField
              label="تاريخ السفر المتوقع"
              type="date"
              min={todayIso}
              value={formData.expectedTravelDate}
              onChange={(e) => updateField('expectedTravelDate', e.target.value)}
              error={errors.expectedTravelDate}
              hint="اختر الموعد التقريبي المخطط لرحلتك إلى المملكة."
              requiredMark
            />

            <ApplicantCounter
              value={formData.applicantsCount}
              onIncrement={incrementApplicants}
              onDecrement={decrementApplicants}
              error={errors.applicantsCount}
            />
          </div>

          {/* Live Package Total Calculation Bar */}
          <div className="rounded-xl bg-[#F1F8FF] border border-[#C5E5FF] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-slate-700">
                إجمالي تكلفة الباقة المعتمدة ({formatApplicantsLabel(formData.applicantsCount)} ×{' '}
                <span className="tabular-nums">
                  {formatEgpAmount(VISA_SERVICE_CONFIG.pricePerPersonEgp)}
                </span>{' '}
                {VISA_SERVICE_CONFIG.currencyLabelAr})
              </p>
            </div>
            <p
              data-testid="calculated-total-price"
              className="text-xl sm:text-2xl font-extrabold text-[#161A8D] tabular-nums"
            >
              {formatEgpAmount(totalAmountEgp)} {VISA_SERVICE_CONFIG.currencyLabelAr}
            </p>
          </div>
        </section>

        {/* Group 3: Initial Required Document Uploads */}
        <section className="bg-white rounded-2xl border border-[#E5EAF2] p-5 sm:p-7 lg:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <p className="text-xs font-bold text-[#8B6918] mb-1">الخطوة 3 من 4</p>
            <h2 className="text-xl sm:text-2xl font-bold text-[#161A8D]">
              رفع مستندات التقديم الأساسية
            </h2>
            <p className="mt-1.5 text-sm text-[#5A657D]">
              ارفع صورة واضحة من جواز السفر الساري والصورة الشخصية الحديثة لبدء طلبك.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileUploadField
              label="صورة جواز السفر الساري"
              description="صورة واضحة لصفحة البيانات (JPG, PNG, WEBP) أو ملف PDF."
              accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
              document={formData.passportDocument}
              error={errors.passportDocument}
              onSelectFile={(file) => handleFileSelect('passportDocument', file)}
            />

            <FileUploadField
              label="الصورة الشخصية الحديثة"
              description="صورة شخصية حديثة بالمواصفات الرسمية وخلفية فاتحة (JPG, PNG, WEBP)."
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              document={formData.personalPhoto}
              error={errors.personalPhoto}
              onSelectFile={(file) => handleFileSelect('personalPhoto', file)}
            />
          </div>
        </section>

        {/* Group 4: Bank Statement Status & Explanatory Notes */}
        <section className="bg-white rounded-2xl border border-[#E5EAF2] p-5 sm:p-7 lg:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <p className="text-xs font-bold text-[#8B6918] mb-1">الخطوة 4 من 4</p>
            <h2 className="text-xl sm:text-2xl font-bold text-[#161A8D]">
              حالة كشف الحساب البنكي والملاحظات التوضيحية
            </h2>
          </div>

          <div className="rounded-xl border border-[#C9A13B]/45 bg-[#FBF7EE] p-4 flex items-start gap-3 text-sm text-slate-800">
            <Info className="w-5 h-5 text-[#8B6918] shrink-0 mt-0.5" aria-hidden="true" />
            <p className="leading-relaxed">
              <strong>ملاحظة:</strong> {DOCUMENTS_EXPLANATORY_NOTE}
            </p>
          </div>

          <fieldset>
            <legend className="block text-sm sm:text-base font-bold text-slate-900 mb-3">
              حالة كشف الحساب البنكي (لموعد البصمة)
              <span className="text-red-600 mr-1" aria-hidden="true">*</span>
            </legend>

            <div className="space-y-3">
              {BANK_STATEMENT_OPTIONS.map((option) => {
                const isSelected = formData.bankStatementStatus === option.value;
                return (
                  <label
                    key={option.value}
                    className={[
                      'flex items-start gap-3.5 p-4 rounded-xl border transition-colors cursor-pointer min-h-[56px]',
                      isSelected
                        ? 'border-[#161A8D] bg-[#F1F8FF]'
                        : 'border-[#E5EAF2] hover:border-slate-300 bg-white',
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
                      className="mt-1 w-5 h-5 accent-[#161A8D] shrink-0 cursor-pointer"
                    />
                    <div>
                      <span className="block text-sm sm:text-base font-bold text-slate-900">
                        {option.labelAr}
                      </span>
                      <span className="block text-xs sm:text-sm text-[#5A657D] mt-0.5">
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
                className="mt-2 flex items-center gap-1.5 text-sm font-medium text-red-700"
              >
                <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{errors.bankStatementStatus}</span>
              </p>
            )}
          </fieldset>

          <TextAreaField
            label="ملاحظات توضيحية — اختياري"
            placeholder="أضف أي استفسارات، أسماء المرافقين في حال التقديم لأكثر من فرد، أو تفاصيل إضافية تود إبلاغ فريق نشكا بها..."
            value={formData.explanatoryNotes}
            onChange={(e) => updateField('explanatoryNotes', e.target.value)}
            error={errors.explanatoryNotes}
          />
        </section>

        {/* Group 5: Data Usage Consent & Submit */}
        <section className="bg-white rounded-2xl border border-[#E5EAF2] p-5 sm:p-7 lg:p-8 space-y-6">
          <div>
            <label className="flex items-start gap-3.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.dataUsageConsent}
                onChange={(e) => updateField('dataUsageConsent', e.target.checked)}
                className="mt-1 w-5 h-5 rounded accent-[#161A8D] shrink-0 cursor-pointer"
              />
              <span className="text-sm sm:text-base text-slate-800 leading-relaxed">
                <strong>الموافقة على استخدام البيانات:</strong> أقر بصحة البيانات والمستندات
                المرفقة، وأوافق على استخدامها من قِبل شركة نشكا للسياحة لغرض مراجعة وتجهيز طلب
                التأشيرة السياحية السعودية وحجز موعد تساهيل والتواصل معي بشأن الطلب.
                <span className="text-red-600 mr-1" aria-hidden="true">*</span>
              </span>
            </label>

            {errors.dataUsageConsent && (
              <p
                role="alert"
                className="mt-2 flex items-center gap-1.5 text-sm font-medium text-red-700"
              >
                <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{errors.dataUsageConsent}</span>
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#5A657D]">
              <ShieldCheck className="w-5 h-5 text-[#161A8D] shrink-0" aria-hidden="true" />
              <span>يتم رفع المستندات وحفظ الطلب مباشرة على خادم المنصة.</span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full sm:w-auto min-w-[240px]"
            >
              <Send className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{isSubmitting ? 'جاري حفظ الطلب والمستندات...' : 'إرسال طلب التأشيرة'}</span>
            </Button>
          </div>
        </section>
      </form>
    </div>
  );
}
