import React, { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertCircle, ArrowRight, FileCheck2, Search } from 'lucide-react';
import { CustomerLayout } from '../../components/layout/CustomerLayout';
import { TextField } from '../../components/ui/FormControls';
import { Button } from '../../components/ui/Button';
import {
  ApplicationStatusBadge,
  DocumentStatusBadge,
} from '../../components/ui/StatusBadge';
import { queryApplicationTracking } from '../../services/applicationService';
import { TrackingResultData } from '../../types/visa';
import {
  ApplicationRecordStatus,
  DocumentVerificationStatus,
} from '../../types/admin';
import { formatApplicantsLabel, formatEgpAmount } from '../../utils/formatters';
import { usePageMeta } from '../../hooks/usePageMeta';

export function TrackPage() {
  usePageMeta({
    title: 'متابعة حالة طلب التأشيرة | نشكا للسياحة',
    robots: 'noindex, follow',
  });

  const [searchParams] = useSearchParams();
  const initialRef = searchParams.get('ref') || '';
  const initialPhone = searchParams.get('phone') || '';

  const [referenceCode, setReferenceCode] = useState(initialRef);
  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [trackingResult, setTrackingResult] = useState<TrackingResultData | null>(null);

  const executeLookup = useCallback(async (refVal: string, phoneVal: string) => {
    if (!refVal.trim() || !phoneVal.trim()) {
      setErrorMsg('يرجى إدخال رقم الطلب المرجعي ورقم الهاتف المسجل بالطلب للمتابعة.');
      setTrackingResult(null);
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    const res = await queryApplicationTracking(refVal, phoneVal);
    setIsLoading(false);

    if (res.ok === false) {
      setTrackingResult(null);
      setErrorMsg(res.error);
      return;
    }

    setTrackingResult(res.tracking);
  }, []);

  useEffect(() => {
    if (initialRef && initialPhone) {
      void executeLookup(initialRef, initialPhone);
    }
  }, [initialRef, initialPhone, executeLookup]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void executeLookup(referenceCode, phoneNumber);
  };

  return (
    <CustomerLayout>
      <section className="bg-[#161A8D] text-white py-10 sm:py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#C5E5FF] hover:text-white mb-4 min-h-[44px]"
          >
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>العودة إلى الصفحة الرئيسية</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold">
            متابعة حالة طلب التأشيرة السياحية
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#C5E5FF] leading-relaxed">
            أدخل رقم الطلب المرجعي المؤكد ورقم الهاتف المسجل للاستعلام المباشر عن حالة مراجعة ملفك
            ومستنداتك لدى نشكا للسياحة.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-[#F4F8FC]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <form
            onSubmit={handleTrackSubmit}
            noValidate
            className="bg-white rounded-2xl border border-[#E8EDF4] p-6 sm:p-8 space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <TextField
                label="رقم الطلب المرجعي"
                placeholder="مثال: NSK-2026-123456"
                inputDir="ltr"
                value={referenceCode}
                onChange={(e) => setReferenceCode(e.target.value)}
                requiredMark
              />

              <TextField
                label="رقم الهاتف المسجل بالطلب"
                type="tel"
                inputMode="tel"
                inputDir="ltr"
                placeholder="010XXXXXXXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                requiredMark
              />
            </div>

            {errorMsg && (
              <div
                role="alert"
                className="rounded-xl border border-[#DC3545]/35 bg-[#FDECEE] p-4 flex items-start gap-2.5 text-sm font-medium text-[#DC3545]"
              >
                <AlertCircle className="w-4 h-4 text-[#DC3545] shrink-0 mt-0.5" aria-hidden="true" />
                <span>{errorMsg}</span>
              </div>
            )}

            <Button type="submit" variant="primary" size="md" isLoading={isLoading}>
              <Search className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{isLoading ? 'جاري البحث...' : 'استعلام عن حالة الطلب'}</span>
            </Button>
          </form>

          {/* Tracking Result Card */}
          {trackingResult && (
            <section
              data-testid="tracking-result-card"
              aria-live="polite"
              className="bg-white rounded-2xl border border-[#C5E5FF] p-6 sm:p-8 space-y-6 shadow-[0_10px_28px_-8px_rgba(22,26,141,0.07)]"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#E8EDF4]">
                <div>
                  <span className="text-xs font-semibold text-[#5A657D] block">
                    رقم المرجع الرسمي
                  </span>
                  <h2
                    className="text-xl font-extrabold text-[#161A8D] font-en tabular-nums text-right mt-0.5"
                    dir="ltr"
                  >
                    {trackingResult.referenceId}
                  </h2>
                </div>
                <ApplicationStatusBadge
                  status={trackingResult.status as ApplicationRecordStatus}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="p-4 rounded-xl bg-[#F4F8FC] border border-[#E8EDF4]">
                  <span className="text-xs text-[#5A657D] block">اسم المتقدم</span>
                  <span className="font-bold text-[#0B0B0D] block mt-1">
                    {trackingResult.fullName}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-[#F4F8FC] border border-[#E8EDF4]">
                  <span className="text-xs text-[#5A657D] block">تاريخ السفر المتوقع</span>
                  <span className="font-bold text-[#0B0B0D] font-en tabular-nums block text-right mt-1" dir="ltr">
                    {trackingResult.expectedTravelDate}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-[#F4F8FC] border border-[#E8EDF4]">
                  <span className="text-xs text-[#5A657D] block">الأفراد وإجمالي الباقة</span>
                  <span className="font-bold text-[#161A8D] tabular-nums block mt-1">
                    {formatApplicantsLabel(trackingResult.applicantsCount)} ·{' '}
                    {formatEgpAmount(trackingResult.totalAmountEgp)} ج.م
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#0B0B0D] mb-3 flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-[#D6AD55]" aria-hidden="true" />
                  <span>حالة فحص المستندات المرفوعة</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {trackingResult.documents.map((doc) => (
                    <div
                      key={doc.type}
                      className="p-3.5 rounded-xl border border-[#E8EDF4] flex items-center justify-between gap-3"
                    >
                      <span className="text-sm font-semibold text-[#0B0B0D]">{doc.labelAr}</span>
                      <DocumentStatusBadge
                        status={doc.verificationStatus as DocumentVerificationStatus}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </section>
    </CustomerLayout>
  );
}
