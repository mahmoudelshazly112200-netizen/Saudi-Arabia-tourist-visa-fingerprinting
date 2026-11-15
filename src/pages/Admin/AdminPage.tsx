import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  Database,
  Download,
  Eye,
  FileText,
  FolderOpen,
  Lock,
  LogIn,
  LogOut,
  Search,
  ShieldAlert,
  X,
} from 'lucide-react';
import { AdminLayout, AdminTabKey } from '../../components/layout/AdminLayout';
import { FirestoreErrorBoundary } from '../../components/common/FirestoreErrorBoundary';
import { ADMIN_ROLES_MATRIX } from '../../constants/content';
import {
  FirebaseAdminAuthProvider,
  useAdminAuth,
} from '../../context/AdminAuthContext';
import { BOOTSTRAPPED_SUPER_ADMIN_EMAIL } from '../../firebase';
import {
  deriveAdminCustomers,
  fetchProtectedAdminDocumentBlob,
  subscribeToAdminApplications,
  updateCloudApplicationStatus,
  updateCloudDocumentStatus,
} from '../../services/applicationService';
import {
  AdminApplicationRecord,
  ApplicationRecordStatus,
  DocumentVerificationStatus,
} from '../../types/admin';
import {
  formatEgpAmount,
  formatFileSize,
  getApplicationStatusLabel,
  getBankStatementStatusLabel,
} from '../../utils/formatters';
import {
  ApplicationStatusBadge,
  DocumentStatusBadge,
} from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { NashkaLogo } from '../../components/ui/NashkaLogo';
import { usePageMeta } from '../../hooks/usePageMeta';

const STATUS_FILTER_OPTIONS: { value: 'all' | ApplicationRecordStatus; label: string }[] = [
  { value: 'all', label: 'جميع الحالات' },
  { value: ApplicationRecordStatus.NEW_SUBMISSION, label: 'طلب جديد' },
  { value: ApplicationRecordStatus.DOCUMENTS_UNDER_REVIEW, label: 'قيد المراجعة' },
  { value: ApplicationRecordStatus.ADDITIONAL_INFO_NEEDED, label: 'استكمال بيانات' },
  { value: ApplicationRecordStatus.READY_FOR_PROCESSING, label: 'جاهز للتنفيذ' },
  { value: ApplicationRecordStatus.VISA_ISSUED, label: 'صدرت التأشيرة' },
  { value: ApplicationRecordStatus.REJECTED, label: 'مرفوض / مغلق' },
];

const PRODUCTION_READINESS_ITEMS = [
  {
    key: 'cloud_db',
    titleAr: 'قاعدة البيانات السحابية (Firebase Cloud Firestore)',
    status: 'configured' as const,
    requirementAr:
      'مفعّلة ونشطة مع قواعد حماية صارمة (Zero-Trust Security Rules) وفصل كامل لبيانات التتبع العامة عن البيانات الشخصية للعملاء.',
  },
  {
    key: 'staff_auth',
    titleAr: 'مصادقة الإدارة وحماية الصلاحيات (Google Sign-In RBAC)',
    status: 'configured' as const,
    requirementAr:
      'مفعّلة ومقصورة على البريد الإلكتروني المعتمد للإدارة (nashkatourism@gmail.com) مع التحقق التشفيري من رموز الهوية على الخادم.',
  },
  {
    key: 'express_storage',
    titleAr: 'فحص وحفظ ملفات المستندات (Express + Magic Bytes)',
    status: 'configured' as const,
    requirementAr:
      'التحقق من البصمة الثنائية لملفات جواز السفر والصورة الشخصية وحمايتها خلف مصادقة الإدارة المعتمدة.',
  },
  {
    key: 'notifications',
    titleAr: 'إشعارات البريد والرسائل التلقائية (اختياري)',
    status: 'pending_external' as const,
    requirementAr:
      'يمكن مستقبلاً ربط مزود SMTP أو WhatsApp Business API لإرسال إشعارات تلقائية عند تحديث الحالة.',
  },
];

interface PreviewModalState {
  labelAr: string;
  fileName: string;
  blobUrl: string;
  mimeType: string;
}

function AdminWorkspaceContent() {
  const {
    user,
    authReady,
    isSigningIn,
    isAuthorizedAdmin,
    adminRoleLabelAr,
    authError,
    signInWithGoogle,
    signOutAdmin,
    getIdToken,
  } = useAdminAuth();

  const [activeTab, setActiveTab] = useState<AdminTabKey>('applications');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ApplicationRecordStatus>('all');
  const [records, setRecords] = useState<AdminApplicationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionError, setActionError] = useState('');
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<PreviewModalState | null>(null);
  const [isOpeningDoc, setIsOpeningDoc] = useState<string | null>(null);

  useEffect(() => {
    if (!authReady || !user || !isAuthorizedAdmin) {
      setRecords([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setActionError('');
    const unsubscribe = subscribeToAdminApplications(
      (nextRecords) => {
        setRecords(nextRecords);
        setIsLoading(false);
      },
      (errMessage) => {
        setActionError(errMessage);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [authReady, user, isAuthorizedAdmin]);

  useEffect(() => {
    return () => {
      if (previewDoc?.blobUrl) {
        URL.revokeObjectURL(previewDoc.blobUrl);
      }
    };
  }, [previewDoc]);

  const customers = useMemo(() => deriveAdminCustomers(records), [records]);

  const filteredApplications = useMemo(() => {
    return records.filter((rec) => {
      const matchesStatus = statusFilter === 'all' || rec.status === statusFilter;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesStatus;
      return (
        rec.referenceId.toLowerCase().includes(q) ||
        rec.fullName.toLowerCase().includes(q) ||
        rec.phoneNumber.toLowerCase().includes(q) ||
        rec.nationality.toLowerCase().includes(q)
      );
    });
  }, [records, searchQuery, statusFilter]);

  const selectedApplication = useMemo(
    () => records.find((item) => item.id === selectedApplicationId) || null,
    [records, selectedApplicationId]
  );

  const pendingReviewCount = useMemo(
    () => records.filter((r) => r.status === ApplicationRecordStatus.NEW_SUBMISSION).length,
    [records]
  );

  const closePreviewModal = () => {
    if (previewDoc?.blobUrl) {
      URL.revokeObjectURL(previewDoc.blobUrl);
    }
    setPreviewDoc(null);
  };

  const handleOpenDocument = async (
    storedFileName: string,
    labelAr: string,
    fileName: string
  ) => {
    setActionError('');
    setIsOpeningDoc(storedFileName);
    try {
      const token = await getIdToken();
      const { blobUrl, mimeType } = await fetchProtectedAdminDocumentBlob(
        storedFileName,
        token
      );
      if (previewDoc?.blobUrl) {
        URL.revokeObjectURL(previewDoc.blobUrl);
      }
      setPreviewDoc({
        labelAr,
        fileName,
        blobUrl,
        mimeType,
      });
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'تعذر فتح ملف المستند المرفوع.'
      );
    } finally {
      setIsOpeningDoc(null);
    }
  };

  const handleStatusUpdate = async (
    record: AdminApplicationRecord,
    nextStatus: ApplicationRecordStatus
  ) => {
    setActionError('');
    try {
      const token = await getIdToken();
      await updateCloudApplicationStatus(record, nextStatus, token);
    } catch {
      setActionError('تعذر تحديث حالة الطلب في قاعدة البيانات السحابية.');
    }
  };

  const handleDocumentReviewUpdate = async (
    record: AdminApplicationRecord,
    docId: string,
    verificationStatus: DocumentVerificationStatus
  ) => {
    setActionError('');
    try {
      const token = await getIdToken();
      await updateCloudDocumentStatus(record, docId, verificationStatus, token);
    } catch {
      setActionError('تعذر تحديث حالة فحص المستند في قاعدة البيانات السحابية.');
    }
  };

  // 1. Auth Loading State
  if (!authReady) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-[#0C0E52] text-white flex items-center justify-center p-6"
      >
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <NashkaLogo variant="dark" size="lg" />
          </div>
          <p className="text-sm font-semibold text-[#C5E5FF]">
            جاري التحقق من جلسة الإدارة المعتمدة...
          </p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Staff Gate
  if (!user) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-[#0C0E52] flex flex-col items-center justify-center px-4 py-12"
      >
        <div className="w-full max-w-md bg-white rounded-2xl border border-white/15 p-6 sm:p-8 shadow-2xl space-y-6 text-right">
          <div className="flex items-center justify-between gap-3">
            <NashkaLogo variant="light" size="md" />
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#EEF7FF] text-[#161A8D] text-xs font-bold">
              <Lock className="w-3.5 h-3.5" aria-hidden="true" />
              <span>بوابة داخلية محمية</span>
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#161A8D]">
              تسجيل دخول إدارة نشكا للسياحة
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              هذه البوابة مخصصة حصرياً لإدارة طلبات التأشيرة السياحية ومراجعة المستندات عبر الحساب
              الإداري المعتمد لدى الشركة.
            </p>
          </div>

          {authError && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-3.5 flex items-start gap-2.5 text-xs sm:text-sm font-medium text-red-800"
            >
              <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{authError}</span>
            </div>
          )}

          <Button
            type="button"
            variant="primary"
            size="md"
            fullWidth
            className="px-4 text-sm"
            isLoading={isSigningIn}
            onClick={() => void signInWithGoogle()}
          >
            <LogIn className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>
              {isSigningIn ? 'جاري فتح نافذة المصادقة...' : 'الدخول بحساب Google المعتمد'}
            </span>
          </Button>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 text-xs text-slate-500">
            <span>الوصول بالرابط المباشر فقط</span>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 font-bold text-[#161A8D] hover:underline min-h-[36px]"
            >
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              <span>العودة للصفحة الرئيسية</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Unauthorized Google Account Gate (Strict Email/RBAC Enforcement)
  if (!isAuthorizedAdmin) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-[#0C0E52] flex flex-col items-center justify-center px-4 py-12"
      >
        <div className="w-full max-w-md bg-white rounded-2xl border border-red-200 p-6 sm:p-8 shadow-2xl space-y-6 text-right">
          <div className="flex items-center justify-between gap-3">
            <NashkaLogo variant="light" size="sm" />
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-50 text-red-700 text-xs font-bold">
              <ShieldAlert className="w-4 h-4" aria-hidden="true" />
              <span>وصول مرفوض (403)</span>
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-extrabold text-slate-900">
              غير مصرح لهذا الحساب بالوصول
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              الحساب المسجل حالياً{' '}
              <span className="font-en font-bold text-slate-900" dir="ltr">
                ({user.email})
              </span>{' '}
              لا يمتلك صلاحية الدخول إلى لوحة إدارة طلبات نشكا للسياحة. يقتصر الوصول على البريد
              الإداري المعتمد{' '}
              <span className="font-en font-bold text-[#161A8D]" dir="ltr">
                {BOOTSTRAPPED_SUPER_ADMIN_EMAIL}
              </span>
              .
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              type="button"
              variant="primary"
              size="md"
              fullWidth
              onClick={() => void signOutAdmin()}
            >
              <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>تسجيل الخروج والتبديل للحساب المعتمد</span>
            </Button>

            <Link
              to="/"
              className="min-h-[44px] rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
              <span>العودة لواجهة العملاء</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. Verified Authorized Admin Workspace
  return (
    <AdminLayout
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      sessionCount={records.length}
      adminEmail={user.email || BOOTSTRAPPED_SUPER_ADMIN_EMAIL}
      adminRoleLabelAr={adminRoleLabelAr}
      onSignOut={() => void signOutAdmin()}
    >
      <div className="space-y-6">
        {actionError && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-center gap-3 text-sm font-medium text-red-800"
          >
            <AlertCircle className="w-5 h-5 text-red-700 shrink-0" aria-hidden="true" />
            <span>{actionError}</span>
          </div>
        )}

        {/* Summary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
            <p className="text-xs font-semibold text-slate-500">إجمالي الطلبات السحابية</p>
            <p className="mt-2 text-2xl font-extrabold text-[#161A8D] tabular-nums">
              {records.length}
            </p>
            <p className="mt-1 text-xs text-slate-500">مزامنة فورية عبر Cloud Firestore</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
            <p className="text-xs font-semibold text-slate-500">طلبات جديدة بانتظار المراجعة</p>
            <p className="mt-2 text-2xl font-extrabold text-slate-900 tabular-nums">
              {pendingReviewCount}
            </p>
            <p className="mt-1 text-xs text-slate-500">تحتاج تدقيق المستندات المرفوعة</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
            <p className="text-xs font-semibold text-slate-500">السعر المعتمد للباقة الفردية</p>
            <p className="mt-2 text-2xl font-extrabold text-[#161A8D] tabular-nums">
              9,500 <span className="text-xs font-bold text-slate-600">ج.م</span>
            </p>
            <p className="mt-1 text-xs text-slate-500">شامل خدمات الباقة الست المعتمدة</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
            <p className="text-xs font-semibold text-slate-500">حالة الحماية والتخزين</p>
            <p className="mt-2 text-base font-extrabold text-emerald-800">
              Firebase Cloud نشط
            </p>
            <p className="mt-1 text-xs text-slate-500 truncate font-en" dir="ltr">
              {user.email}
            </p>
          </div>
        </div>

        {/* TAB 1: APPLICATIONS MANAGEMENT */}
        {activeTab === 'applications' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h1 className="text-lg sm:text-xl font-extrabold text-[#161A8D]">
                  سجل طلبات التأشيرة السياحية
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  تحديث فوري مباشر من قاعدة البيانات السحابية مع مزامنة تلقائية لصفحة متابعة العميل.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative">
                  <Search
                    className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث بالمرجع أو الاسم أو الهاتف..."
                    aria-label="البحث في الطلبات"
                    className="w-full sm:w-64 min-h-[44px] pr-10 pl-3.5 py-2 rounded-xl border border-slate-300 text-base sm:text-sm focus:outline-none focus:border-[#161A8D]"
                  />
                </div>

                <select
                  aria-label="تصفية حسب حالة الطلب"
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as 'all' | ApplicationRecordStatus)
                  }
                  className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-base sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#161A8D]"
                >
                  {STATUS_FILTER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="p-10 text-center text-sm text-slate-500">
                جاري مزامنة الطلبات من Cloud Firestore...
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="p-10 sm:p-14 text-center max-w-lg mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-[#F1F8FF] text-[#161A8D] flex items-center justify-center mx-auto mb-4">
                  <FolderOpen className="w-6 h-6" aria-hidden="true" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  لا توجد طلبات مطابقة للعرض حالياً
                </h2>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  لا يتم عرض أي سجلات عملاء وهمية. بمجرد إرسال طلب جديد من صفحة التقديم، يُحفظ في
                  قاعدة البيانات السحابية ويظهر هنا لحظياً برقم مرجعه الرسمي.
                </p>
                <div className="mt-6">
                  <Button to="/apply" variant="primary" size="sm">
                    الانتقال إلى نموذج التقديم
                  </Button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="bg-[#F7F9FC] border-b border-slate-200 text-xs font-bold text-slate-600">
                    <tr>
                      <th className="py-3.5 px-4">رقم المرجع</th>
                      <th className="py-3.5 px-4">اسم المتقدم</th>
                      <th className="py-3.5 px-4">رقم الهاتف</th>
                      <th className="py-3.5 px-4">تاريخ السفر</th>
                      <th className="py-3.5 px-4">الأفراد</th>
                      <th className="py-3.5 px-4">الإجمالي (ج.م)</th>
                      <th className="py-3.5 px-4">الحالة</th>
                      <th className="py-3.5 px-4">الإجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                        <td
                          className="py-3.5 px-4 text-xs font-extrabold text-[#161A8D] font-en tabular-nums whitespace-nowrap text-right"
                          dir="ltr"
                        >
                          {app.referenceId}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                          {app.fullName}
                        </td>
                        <td
                          className="py-3.5 px-4 font-en tabular-nums text-slate-700 whitespace-nowrap text-right"
                          dir="ltr"
                        >
                          {app.phoneNumber}
                        </td>
                        <td
                          className="py-3.5 px-4 font-en tabular-nums text-slate-700 whitespace-nowrap text-right"
                          dir="ltr"
                        >
                          {app.expectedTravelDate}
                        </td>
                        <td className="py-3.5 px-4 tabular-nums font-bold text-slate-800">
                          {app.applicantsCount}
                        </td>
                        <td className="py-3.5 px-4 tabular-nums font-bold text-[#161A8D] whitespace-nowrap">
                          {formatEgpAmount(app.totalAmountEgp)}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <ApplicationStatusBadge status={app.status} />
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setSelectedApplicationId(app.id)}
                            className="min-h-[44px] sm:min-h-[38px] px-3.5 py-1.5 rounded-lg bg-[#F1F8FF] text-[#161A8D] hover:bg-[#C5E5FF] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>التفاصيل</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Selected Application Detail Panel */}
            {selectedApplication && (
              <div className="border-t border-slate-200 bg-[#F7F9FC] p-5 sm:p-6 space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p
                      className="text-xs font-bold text-[#8B6918] font-en tabular-nums text-right"
                      dir="ltr"
                    >
                      {selectedApplication.referenceId}
                    </p>
                    <h3 className="text-lg font-extrabold text-[#161A8D]">
                      {selectedApplication.fullName}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedApplicationId(null)}
                    aria-label="إغلاق تفاصيل الطلب"
                    className="w-11 h-11 sm:w-9 sm:h-9 rounded-lg border border-slate-300 bg-white flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-slate-200 text-sm">
                  <div>
                    <span className="text-xs text-slate-500 block">الجنسية والمهنة</span>
                    <span className="font-bold text-slate-900">
                      {selectedApplication.nationality} · {selectedApplication.currentProfession}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">حالة كشف الحساب البنكي</span>
                    <span className="font-bold text-slate-900">
                      {getBankStatementStatusLabel(selectedApplication.bankStatementStatus)}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">تحديث حالة الطلب</span>
                    <select
                      aria-label="تحديث حالة الطلب"
                      value={selectedApplication.status}
                      onChange={(e) =>
                        void handleStatusUpdate(
                          selectedApplication,
                          e.target.value as ApplicationRecordStatus
                        )
                      }
                      className="mt-1 w-full min-h-[44px] sm:min-h-[38px] px-2.5 py-1 rounded-lg border border-slate-300 text-base sm:text-xs font-bold text-slate-900 bg-white"
                    >
                      {Object.values(ApplicationRecordStatus).map((st) => (
                        <option key={st} value={st}>
                          {getApplicationStatusLabel(st)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">ملاحظات المتقدم</span>
                    <span className="text-slate-800">
                      {selectedApplication.explanatoryNotes || 'لا توجد ملاحظات إضافية'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CUSTOMERS MANAGEMENT */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-200">
              <h1 className="text-lg sm:text-xl font-extrabold text-[#161A8D]">
                سجل العملاء المسجلين
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                قائمة العملاء المشتقة تلقائياً من الطلبات المحفوظة في قاعدة البيانات السحابية.
              </p>
            </div>

            {customers.length === 0 ? (
              <div className="p-10 text-center text-sm text-slate-600">
                لا توجد سجلات عملاء محفوظة حالياً.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="bg-[#F7F9FC] border-b border-slate-200 text-xs font-bold text-slate-600">
                    <tr>
                      <th className="py-3.5 px-4">الاسم الكامل</th>
                      <th className="py-3.5 px-4">الهاتف / واتساب</th>
                      <th className="py-3.5 px-4">الجنسية</th>
                      <th className="py-3.5 px-4">المهنة</th>
                      <th className="py-3.5 px-4">عدد الطلبات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {customers.map((cust) => (
                      <tr key={cust.id}>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{cust.fullName}</td>
                        <td className="py-3.5 px-4 font-en tabular-nums text-right" dir="ltr">
                          {cust.phoneNumber}
                        </td>
                        <td className="py-3.5 px-4">{cust.nationality}</td>
                        <td className="py-3.5 px-4">{cust.currentProfession}</td>
                        <td className="py-3.5 px-4 tabular-nums font-bold">
                          {cust.applicationsCount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DOCUMENT REVIEW */}
        {activeTab === 'documents' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5">
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-[#161A8D]">
                وحدة فحص ومراجعة المستندات المرفوعة
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                مراجعة جواز السفر الساري والصورة الشخصية الحديثة لكل طلب محفوظ.
              </p>
            </div>

            {records.length === 0 ? (
              <div className="p-8 rounded-xl bg-[#F7F9FC] border border-slate-200 text-center text-sm text-slate-600">
                لا توجد مستندات مرفوعة للمراجعة حالياً.
              </div>
            ) : (
              <div className="space-y-4">
                {records.map((app) => (
                  <div
                    key={app.id}
                    className="rounded-xl border border-slate-200 p-4 sm:p-5 space-y-4"
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <span className="font-bold text-[#161A8D]">{app.fullName}</span>
                      <span
                        className="text-xs font-bold text-[#8B6918] font-en tabular-nums"
                        dir="ltr"
                      >
                        {app.referenceId}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {app.documents.map((docItem) => (
                        <div
                          key={docItem.id}
                          className="p-4 rounded-xl bg-[#F7F9FC] border border-slate-200 flex flex-col justify-between gap-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <FileText
                                className="w-5 h-5 text-[#161A8D] shrink-0"
                                aria-hidden="true"
                              />
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-slate-900">
                                  {docItem.labelAr}
                                </p>
                                <p
                                  className="text-xs text-slate-500 font-en truncate text-right"
                                  dir="ltr"
                                >
                                  {docItem.fileName} ({formatFileSize(docItem.fileSizeBytes)})
                                </p>
                              </div>
                            </div>
                            <DocumentStatusBadge status={docItem.verificationStatus} />
                          </div>

                          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/70">
                            {docItem.storedFileName && (
                              <button
                                type="button"
                                disabled={isOpeningDoc === docItem.storedFileName}
                                onClick={() =>
                                  void handleOpenDocument(
                                    docItem.storedFileName as string,
                                    docItem.labelAr,
                                    docItem.fileName
                                  )
                                }
                                className="min-h-[44px] sm:min-h-[38px] px-3.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 hover:border-[#161A8D] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                              >
                                <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>
                                  {isOpeningDoc === docItem.storedFileName
                                    ? 'جاري التحميل...'
                                    : 'معاينة المستند'}
                                </span>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() =>
                                void handleDocumentReviewUpdate(
                                  app,
                                  docItem.id,
                                  DocumentVerificationStatus.APPROVED
                                )
                              }
                              className="min-h-[44px] sm:min-h-[38px] px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 cursor-pointer"
                            >
                              اعتماد المستند
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                void handleDocumentReviewUpdate(
                                  app,
                                  docItem.id,
                                  DocumentVerificationStatus.REPLACEMENT_REQUIRED
                                )
                              }
                              className="min-h-[44px] sm:min-h-[38px] px-3.5 py-1.5 rounded-lg bg-white border border-red-300 text-red-700 text-xs font-bold hover:bg-red-50 cursor-pointer"
                            >
                              طلب استبدال
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ROLES & PERMISSIONS */}
        {activeTab === 'roles' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-200">
              <h1 className="text-lg sm:text-xl font-extrabold text-[#161A8D]">
                مصفوفة الأدوار والصلاحيات الإدارية (RBAC)
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                الهيكل المعتمد لصلاحيات فريق نشكا للسياحة بقيادة الحساب الرئيسي ({BOOTSTRAPPED_SUPER_ADMIN_EMAIL}).
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="bg-[#F7F9FC] border-b border-slate-200 text-xs font-bold text-slate-600">
                  <tr>
                    <th className="py-3.5 px-4">الدور الوظيفي</th>
                    <th className="py-3.5 px-4">عرض الطلبات</th>
                    <th className="py-3.5 px-4">تحديث الحالة</th>
                    <th className="py-3.5 px-4">مراجعة المستندات</th>
                    <th className="py-3.5 px-4">إدارة العملاء</th>
                    <th className="py-3.5 px-4">المدفوعات</th>
                    <th className="py-3.5 px-4">إدارة الصلاحيات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {ADMIN_ROLES_MATRIX.map((item) => (
                    <tr key={item.role}>
                      <td className="py-4 px-4">
                        <p className="font-bold text-slate-900">{item.titleAr}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{item.descriptionAr}</p>
                      </td>
                      {Object.values(item.permissions).map((allowed, idx) => (
                        <td key={idx} className="py-4 px-4">
                          {allowed ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                              <Check className="w-4 h-4" aria-hidden="true" />
                              <span>مسموح</span>
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">غير مصرح</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: BACKEND INTEGRATION STATUS */}
        {activeTab === 'integrations' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5">
            <div className="flex items-start gap-3">
              <Database className="w-6 h-6 text-[#161A8D] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h1 className="text-lg sm:text-xl font-extrabold text-[#161A8D]">
                  حالة البنية السحابية والتكاملات الإنتاجية
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  ملخص حالة قواعد البيانات السحابية ومصادقة الموظفين وحماية الملفات المرفوعة.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PRODUCTION_READINESS_ITEMS.map((item) => (
                <div
                  key={item.key}
                  className="rounded-xl border border-slate-200 p-4 sm:p-5 bg-[#F7F9FC] flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h2 className="text-sm sm:text-base font-bold text-slate-900">
                        {item.titleAr}
                      </h2>
                      {item.status === 'configured' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 whitespace-nowrap">
                          <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                          <span>مفعّل ونشط</span>
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-amber-800 whitespace-nowrap">
                          اختياري مستقبلاً
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.requirementAr}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Secure Protected Document Preview Modal */}
      {previewDoc && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`معاينة ${previewDoc.labelAr}`}
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl border border-slate-200 max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-base font-extrabold text-[#161A8D]">
                  {previewDoc.labelAr}
                </h2>
                <p className="text-xs text-slate-500 font-en truncate text-right" dir="ltr">
                  {previewDoc.fileName}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={previewDoc.blobUrl}
                  download={previewDoc.fileName}
                  className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#EEF7FF] text-[#161A8D] hover:bg-[#C5E5FF] text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>تنزيل</span>
                </a>
                <button
                  type="button"
                  onClick={closePreviewModal}
                  aria-label="إغلاق المعاينة"
                  className="w-9 h-9 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-slate-100 flex-1 overflow-auto flex items-center justify-center min-h-[300px]">
              {previewDoc.mimeType === 'application/pdf' ? (
                <iframe
                  src={previewDoc.blobUrl}
                  title={previewDoc.labelAr}
                  className="w-full h-[65vh] rounded-lg border border-slate-300 bg-white"
                />
              ) : (
                <img
                  src={previewDoc.blobUrl}
                  alt={previewDoc.labelAr}
                  className="max-w-full max-h-[65vh] object-contain rounded-lg shadow-sm bg-white"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export function AdminPage() {
  usePageMeta({
    title: 'لوحة إدارة الطلبات | نشكا للسياحة',
    robots: 'noindex, nofollow',
  });

  return (
    <FirestoreErrorBoundary>
      <FirebaseAdminAuthProvider>
        <AdminWorkspaceContent />
      </FirebaseAdminAuthProvider>
    </FirestoreErrorBoundary>
  );
}
