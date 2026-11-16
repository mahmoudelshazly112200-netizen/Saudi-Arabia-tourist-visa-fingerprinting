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
  FileSpreadsheet,
  FileText,
  FolderOpen,
  Lock,
  LogIn,
  LogOut,
  MessageCircle,
  Search,
  ShieldAlert,
  Trash2,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { AdminLayout, AdminTabKey } from '../../components/layout/AdminLayout';
import { FirestoreErrorBoundary } from '../../components/common/FirestoreErrorBoundary';
import {
  buildCustomerWhatsappHref,
  getSiteOrigin,
  normalizeWhatsappDigits,
} from '../../constants/brand';
import { ADMIN_ROLES_MATRIX } from '../../constants/content';
import {
  FirebaseAdminAuthProvider,
  useAdminAuth,
} from '../../context/AdminAuthContext';
import { BOOTSTRAPPED_SUPER_ADMIN_EMAIL } from '../../firebase';
import {
  deleteStaffDirectoryEntry,
  deriveAdminCustomers,
  fetchProtectedAdminDocumentBlob,
  saveStaffDirectoryEntry,
  subscribeToAdminApplications,
  subscribeToStaffDirectory,
  updateCloudApplicationStatus,
  updateCloudDocumentStatus,
} from '../../services/applicationService';
import {
  AdminApplicationRecord,
  AdminRole,
  ApplicationRecordStatus,
  AssignableStaffRole,
  DocumentVerificationStatus,
  StaffDirectoryEntry,
} from '../../types/admin';
import { triggerCsvDownload } from '../../utils/csvExport';
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

const ASSIGNABLE_ROLE_OPTIONS: { value: AssignableStaffRole; labelAr: string }[] = [
  { value: AdminRole.VISA_OPERATIONS_MANAGER, labelAr: 'مدير عمليات التأشيرات' },
  { value: AdminRole.DOCUMENT_REVIEWER, labelAr: 'مسؤول فحص المستندات' },
  { value: AdminRole.CUSTOMER_SUPPORT, labelAr: 'مسؤول متابعة العملاء' },
];

function buildAdminStatusWhatsappHref(app: AdminApplicationRecord): string {
  const origin = getSiteOrigin();
  const trackLink = `${origin}/track?ref=${encodeURIComponent(app.referenceId)}&phone=${encodeURIComponent(app.phoneNumber)}`;
  const statusAr = getApplicationStatusLabel(app.status);
  const message = [
    `مرحباً ${app.fullName}، معك فريق شركة نشكا للسياحة.`,
    `تحديث حالة طلب التأشيرة السياحية السعودية رقم (${app.referenceId}):`,
    `- الحالة الحالية للطلب: ${statusAr}`,
    `- رابط المتابعة المباشر: ${trackLink}`,
  ].join('\n');
  return buildCustomerWhatsappHref(app.phoneNumber, message);
}

function AdminWorkspaceContent() {
  const {
    user,
    authReady,
    isSigningIn,
    isAuthorizedAdmin,
    isSuperAdmin,
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

  const [staffEntries, setStaffEntries] = useState<StaffDirectoryEntry[]>([]);
  const [staffEmailInput, setStaffEmailInput] = useState('');
  const [staffNameInput, setStaffNameInput] = useState('');
  const [staffRoleInput, setStaffRoleInput] = useState<AssignableStaffRole>(
    AdminRole.DOCUMENT_REVIEWER
  );
  const [isSavingStaff, setIsSavingStaff] = useState(false);
  const [staffFeedback, setStaffFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(
    null
  );

  useEffect(() => {
    if (!authReady || !user || !isAuthorizedAdmin) {
      setRecords([]);
      setStaffEntries([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setActionError('');
    const unsubscribeApps = subscribeToAdminApplications(
      (nextRecords) => {
        setRecords(nextRecords);
        setIsLoading(false);
      },
      (errMessage) => {
        setActionError(errMessage);
        setIsLoading(false);
      }
    );

    const unsubscribeStaff = isSuperAdmin
      ? subscribeToStaffDirectory(
          (entries) => setStaffEntries(entries),
          (errMessage) => setStaffFeedback({ type: 'err', text: errMessage })
        )
      : () => {};

    return () => {
      unsubscribeApps();
      unsubscribeStaff();
    };
  }, [authReady, user, isAuthorizedAdmin, isSuperAdmin]);

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
    appId: string,
    docType: 'passport' | 'personal_photo',
    storedFileName: string | undefined,
    labelAr: string,
    fileName: string
  ) => {
    setActionError('');
    const docKey = `${appId}-${docType}`;
    setIsOpeningDoc(docKey);
    try {
      const token = await getIdToken();
      const { blobUrl, mimeType } = await fetchProtectedAdminDocumentBlob(
        appId,
        docType,
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

  const handleExportApplicationsCsv = () => {
    const todayStamp = new Date().toISOString().slice(0, 10);
    const headers = [
      'رقم المرجع',
      'الاسم الكامل',
      'رقم الهاتف / واتساب',
      'الجنسية',
      'المهنة الحالية',
      'تاريخ السفر المتوقع',
      'عدد الأفراد',
      'الإجمالي (ج.م)',
      'حالة كشف الحساب',
      'حالة الطلب',
      'تاريخ التسجيل',
      'الملاحظات',
    ];
    const rows = filteredApplications.map((app) => [
      app.referenceId,
      app.fullName,
      app.phoneNumber,
      app.nationality,
      app.currentProfession,
      app.expectedTravelDate,
      app.applicantsCount,
      app.totalAmountEgp,
      getBankStatementStatusLabel(app.bankStatementStatus),
      getApplicationStatusLabel(app.status),
      app.createdAt.slice(0, 10),
      app.explanatoryNotes,
    ]);
    triggerCsvDownload(`nashka-visa-applications-${todayStamp}.csv`, headers, rows);
  };

  const handleExportCustomersCsv = () => {
    const todayStamp = new Date().toISOString().slice(0, 10);
    const headers = [
      'معرف العميل',
      'الاسم الكامل',
      'رقم الهاتف / واتساب',
      'الجنسية',
      'المهنة',
      'عدد الطلبات',
      'آخر نشاط',
    ];
    const rows = customers.map((cust) => [
      cust.id,
      cust.fullName,
      cust.phoneNumber,
      cust.nationality,
      cust.currentProfession,
      cust.applicationsCount,
      cust.lastActivityAt.slice(0, 10),
    ]);
    triggerCsvDownload(`nashka-customers-${todayStamp}.csv`, headers, rows);
  };

  const handleSaveStaffMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const cleanEmail = staffEmailInput.trim().toLowerCase();
    const cleanName = staffNameInput.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setStaffFeedback({ type: 'err', text: 'يرجى إدخال بريد Google إلكتروني صحيح.' });
      return;
    }
    if (cleanEmail === BOOTSTRAPPED_SUPER_ADMIN_EMAIL) {
      setStaffFeedback({
        type: 'err',
        text: 'الحساب الرئيسي يمتلك صلاحية المدير العام تلقائياً ولا يحتاج لإضافته.',
      });
      return;
    }
    if (cleanName.length < 2) {
      setStaffFeedback({ type: 'err', text: 'يرجى إدخال الاسم الكامل للعضو (حرفان على الأقل).' });
      return;
    }

    setIsSavingStaff(true);
    setStaffFeedback(null);
    try {
      await saveStaffDirectoryEntry({
        email: cleanEmail,
        displayName: cleanName,
        role: staffRoleInput,
        addedByUid: user.uid,
      });
      setStaffEmailInput('');
      setStaffNameInput('');
      setStaffFeedback({ type: 'ok', text: `تم حفظ صلاحيات ${cleanEmail} في دليل الفريق بنجاح.` });
    } catch {
      setStaffFeedback({ type: 'err', text: 'تعذر حفظ بيانات العضو في قاعدة البيانات السحابية.' });
    } finally {
      setIsSavingStaff(false);
    }
  };

  const handleUpdateStaffRole = async (entry: StaffDirectoryEntry, nextRole: AssignableStaffRole) => {
    if (!user) return;
    setStaffFeedback(null);
    try {
      await saveStaffDirectoryEntry({
        email: entry.email,
        displayName: entry.displayName,
        role: nextRole,
        addedByUid: user.uid,
      });
      setStaffFeedback({ type: 'ok', text: `تم تحديث دور ${entry.displayName}.` });
    } catch {
      setStaffFeedback({ type: 'err', text: 'تعذر تحديث الدور الوظيفي.' });
    }
  };

  const handleRemoveStaffMember = async (entry: StaffDirectoryEntry) => {
    setStaffFeedback(null);
    try {
      await deleteStaffDirectoryEntry(entry.staffKey);
      setStaffFeedback({ type: 'ok', text: `تمت إزالة ${entry.email} من فريق العمل.` });
    } catch {
      setStaffFeedback({ type: 'err', text: 'تعذر إزالة عضو الفريق من قاعدة البيانات.' });
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
        className="min-h-screen bg-[#0D105A] text-white flex items-center justify-center p-6"
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
        className="min-h-screen bg-[#0D105A] flex flex-col items-center justify-center px-4 py-12"
      >
        <div className="w-full max-w-md bg-white rounded-2xl border border-[#E8EDF4] p-6 sm:p-8 shadow-2xl space-y-6 text-right">
          <div className="flex items-center justify-between gap-3">
            <NashkaLogo variant="light" size="md" />
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#EAF4FF] text-[#004AAD] text-xs font-bold">
              <Lock className="w-3.5 h-3.5" aria-hidden="true" />
              <span>بوابة داخلية محمية</span>
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B0B0D]">
              تسجيل دخول إدارة نشكا للسياحة
            </h1>
            <p className="text-sm text-[#5A657D] leading-relaxed">
              هذه البوابة مخصصة حصرياً لإدارة طلبات التأشيرة السياحية ومراجعة المستندات عبر الحساب
              الإداري المعتمد لدى الشركة.
            </p>
          </div>

          {authError && (
            <div
              role="alert"
              className="rounded-xl border border-[#DC3545]/35 bg-[#FDECEE] p-3.5 flex items-start gap-2.5 text-xs sm:text-sm font-medium text-[#DC3545]"
            >
              <AlertCircle className="w-4 h-4 text-[#DC3545] shrink-0 mt-0.5" aria-hidden="true" />
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

          <div className="pt-4 border-t border-[#E8EDF4] flex items-center justify-between gap-3 text-xs text-[#5A657D]">
            <span>الوصول بالرابط المباشر فقط</span>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 font-bold text-[#004AAD] hover:underline min-h-[36px]"
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
        className="min-h-screen bg-[#0D105A] flex flex-col items-center justify-center px-4 py-12"
      >
        <div className="w-full max-w-md bg-white rounded-2xl border border-[#DC3545]/35 p-6 sm:p-8 shadow-2xl space-y-6 text-right">
          <div className="flex items-center justify-between gap-3">
            <NashkaLogo variant="light" size="sm" />
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FDECEE] text-[#DC3545] text-xs font-bold">
              <ShieldAlert className="w-4 h-4" aria-hidden="true" />
              <span>وصول مرفوض (403)</span>
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-extrabold text-[#0B0B0D]">
              غير مصرح لهذا الحساب بالوصول
            </h1>
            <p className="text-sm text-[#5A657D] leading-relaxed">
              الحساب المسجل حالياً{' '}
              <span className="font-en font-bold text-[#0B0B0D]" dir="ltr">
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
              className="min-h-[44px] rounded-xl border border-[#E8EDF4] text-[#004AAD] hover:bg-[#EAF4FF] text-sm font-bold flex items-center justify-center gap-2 transition-colors"
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
            className="rounded-xl border border-[#DC3545]/35 bg-[#FDECEE] p-4 flex items-center gap-3 text-sm font-medium text-[#DC3545]"
          >
            <AlertCircle className="w-5 h-5 text-[#DC3545] shrink-0" aria-hidden="true" />
            <span>{actionError}</span>
          </div>
        )}

        {/* Summary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-[#E8EDF4] p-4 sm:p-5">
            <p className="text-xs font-semibold text-[#5A657D]">إجمالي الطلبات السحابية</p>
            <p className="mt-2 text-2xl font-extrabold text-[#161A8D] tabular-nums">
              {records.length}
            </p>
            <p className="mt-1 text-xs text-[#5A657D]">مزامنة فورية عبر Cloud Firestore</p>
          </div>

          <div className="bg-white rounded-xl border border-[#E8EDF4] p-4 sm:p-5">
            <p className="text-xs font-semibold text-[#5A657D]">طلبات جديدة بانتظار المراجعة</p>
            <p className="mt-2 text-2xl font-extrabold text-[#0B0B0D] tabular-nums">
              {pendingReviewCount}
            </p>
            <p className="mt-1 text-xs text-[#5A657D]">تحتاج تدقيق المستندات المرفوعة</p>
          </div>

          <div className="bg-white rounded-xl border border-[#E8EDF4] p-4 sm:p-5">
            <p className="text-xs font-semibold text-[#5A657D]">السعر المعتمد للباقة الفردية</p>
            <p className="mt-2 text-2xl font-extrabold text-[#161A8D] tabular-nums">
              9,500 <span className="text-xs font-bold text-[#8B6918]">ج.م</span>
            </p>
            <p className="mt-1 text-xs text-[#5A657D]">شامل خدمات الباقة الست المعتمدة</p>
          </div>

          <div className="bg-white rounded-xl border border-[#E8EDF4] p-4 sm:p-5">
            <p className="text-xs font-semibold text-[#5A657D]">حالة الحماية والتخزين</p>
            <p className="mt-2 text-base font-extrabold text-[#16A36A]">
              Firebase Cloud نشط
            </p>
            <p className="mt-1 text-xs text-[#5A657D] truncate font-en" dir="ltr">
              {user.email}
            </p>
          </div>
        </div>

        {/* TAB 1: APPLICATIONS MANAGEMENT */}
        {activeTab === 'applications' && (
          <div className="bg-white rounded-2xl border border-[#E8EDF4] overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-[#E8EDF4] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h1 className="text-lg sm:text-xl font-extrabold text-[#0B0B0D]">
                  سجل طلبات التأشيرة السياحية
                </h1>
                <p className="text-xs sm:text-sm text-[#5A657D] mt-0.5">
                  تحديث فوري مباشر من قاعدة البيانات السحابية مع مزامنة تلقائية لصفحة متابعة العميل.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative">
                  <Search
                    className="w-4 h-4 text-[#5A657D] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث بالمرجع أو الاسم أو الهاتف..."
                    aria-label="البحث في الطلبات"
                    className="w-full sm:w-64 min-h-[44px] pr-10 pl-3.5 py-2 rounded-xl border border-[#E8EDF4] text-base sm:text-sm text-[#0B0B0D] focus:outline-none focus:border-[#161A8D]"
                  />
                </div>

                <select
                  aria-label="تصفية حسب حالة الطلب"
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as 'all' | ApplicationRecordStatus)
                  }
                  className="min-h-[44px] px-3.5 py-2 rounded-xl border border-[#E8EDF4] bg-white text-base sm:text-sm font-semibold text-[#0B0B0D] focus:outline-none focus:border-[#161A8D]"
                >
                  {STATUS_FILTER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  disabled={filteredApplications.length === 0}
                  onClick={handleExportApplicationsCsv}
                  className="min-h-[44px] px-4 py-2 rounded-xl border border-[#C5E5FF] bg-[#EAF4FF] hover:bg-[#C5E5FF]/60 text-[#004AAD] text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  <FileSpreadsheet className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>تصدير CSV</span>
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="p-10 text-center text-sm text-[#5A657D]">
                جاري مزامنة الطلبات من Cloud Firestore...
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="p-10 sm:p-14 text-center max-w-lg mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-[#EAF4FF] text-[#004AAD] flex items-center justify-center mx-auto mb-4">
                  <FolderOpen className="w-6 h-6" aria-hidden="true" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[#0B0B0D]">
                  لا توجد طلبات مطابقة للعرض حالياً
                </h2>
                <p className="mt-2 text-sm text-[#5A657D] leading-relaxed">
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
                  <thead className="bg-[#F4F8FC] border-b border-[#E8EDF4] text-xs font-bold text-[#5A657D]">
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
                  <tbody className="divide-y divide-[#E8EDF4]">
                    {filteredApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-[#F4F8FC]/80 transition-colors">
                        <td
                          className="py-3.5 px-4 text-xs font-extrabold text-[#161A8D] font-en tabular-nums whitespace-nowrap text-right"
                          dir="ltr"
                        >
                          {app.referenceId}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[#0B0B0D] whitespace-nowrap">
                          {app.fullName}
                        </td>
                        <td
                          className="py-3.5 px-4 font-en tabular-nums text-[#334155] whitespace-nowrap text-right"
                          dir="ltr"
                        >
                          {app.phoneNumber}
                        </td>
                        <td
                          className="py-3.5 px-4 font-en tabular-nums text-[#334155] whitespace-nowrap text-right"
                          dir="ltr"
                        >
                          {app.expectedTravelDate}
                        </td>
                        <td className="py-3.5 px-4 tabular-nums font-bold text-[#0B0B0D]">
                          {app.applicantsCount}
                        </td>
                        <td className="py-3.5 px-4 tabular-nums font-bold text-[#161A8D] whitespace-nowrap">
                          {formatEgpAmount(app.totalAmountEgp)}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <ApplicationStatusBadge status={app.status} />
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedApplicationId(app.id)}
                              className="min-h-[44px] sm:min-h-[38px] px-3.5 py-1.5 rounded-lg bg-[#EAF4FF] text-[#004AAD] hover:bg-[#C5E5FF]/70 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>التفاصيل</span>
                            </button>
                            {normalizeWhatsappDigits(app.phoneNumber) && (
                              <a
                                href={buildAdminStatusWhatsappHref(app)}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`إرسال تحديث عبر واتساب للعميل ${app.fullName}`}
                                title="إرسال تحديث عبر واتساب"
                                className="min-h-[44px] sm:min-h-[38px] px-2.5 py-1.5 rounded-lg bg-[#E9F8F0] border border-[#16A36A]/25 text-[#16A36A] hover:bg-[#16A36A]/15 text-xs font-bold inline-flex items-center gap-1"
                              >
                                <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                                <span className="hidden xl:inline">واتساب</span>
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Selected Application Detail Panel */}
            {selectedApplication && (
              <div className="border-t border-[#E8EDF4] bg-[#F4F8FC] p-5 sm:p-6 space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p
                      className="text-xs font-bold text-[#8B6918] font-en tabular-nums text-right"
                      dir="ltr"
                    >
                      {selectedApplication.referenceId}
                    </p>
                    <h3 className="text-lg font-extrabold text-[#0B0B0D]">
                      {selectedApplication.fullName}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedApplicationId(null)}
                    aria-label="إغلاق تفاصيل الطلب"
                    className="w-11 h-11 sm:w-9 sm:h-9 rounded-lg border border-[#E8EDF4] bg-white flex items-center justify-center text-[#5A657D] hover:text-[#0B0B0D] cursor-pointer"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-[#E8EDF4] text-sm">
                  <div>
                    <span className="text-xs text-[#5A657D] block">الجنسية والمهنة</span>
                    <span className="font-bold text-[#0B0B0D]">
                      {selectedApplication.nationality} · {selectedApplication.currentProfession}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-[#5A657D] block">حالة كشف الحساب البنكي</span>
                    <span className="font-bold text-[#0B0B0D]">
                      {getBankStatementStatusLabel(selectedApplication.bankStatementStatus)}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-[#5A657D] block">تحديث حالة الطلب</span>
                    <select
                      aria-label="تحديث حالة الطلب"
                      value={selectedApplication.status}
                      onChange={(e) =>
                        void handleStatusUpdate(
                          selectedApplication,
                          e.target.value as ApplicationRecordStatus
                        )
                      }
                      className="mt-1 w-full min-h-[44px] sm:min-h-[38px] px-2.5 py-1 rounded-lg border border-[#E8EDF4] text-base sm:text-xs font-bold text-[#0B0B0D] bg-white focus:border-[#161A8D] focus:outline-none"
                    >
                      {Object.values(ApplicationRecordStatus).map((st) => (
                        <option key={st} value={st}>
                          {getApplicationStatusLabel(st)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <span className="text-xs text-[#5A657D] block">ملاحظات المتقدم</span>
                    <span className="text-[#334155] block">
                      {selectedApplication.explanatoryNotes || 'لا توجد ملاحظات إضافية'}
                    </span>
                  </div>
                </div>

                {normalizeWhatsappDigits(selectedApplication.phoneNumber) && (
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#16A36A]/30">
                    <div className="text-xs sm:text-sm text-[#334155]">
                      <strong className="text-[#16A36A] block">
                        إشعار العميل مباشرة عبر واتساب
                      </strong>
                      <span>
                        رسالة جاهزة تتضمن رقم المرجع ({selectedApplication.referenceId}) وحالة الطلب
                        الحالية ورابط التتبع المباشر.
                      </span>
                    </div>
                    <a
                      href={buildAdminStatusWhatsappHref(selectedApplication)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[42px] px-4 py-2 rounded-xl bg-[#16A36A] hover:bg-[#128656] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>إرسال تحديث عبر واتساب</span>
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CUSTOMERS MANAGEMENT */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-2xl border border-[#E8EDF4] overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-[#E8EDF4] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-lg sm:text-xl font-extrabold text-[#0B0B0D]">
                  سجل العملاء المسجلين
                </h1>
                <p className="text-xs sm:text-sm text-[#5A657D] mt-1">
                  قائمة العملاء المشتقة تلقائياً من الطلبات المحفوظة في قاعدة البيانات السحابية.
                </p>
              </div>
              <button
                type="button"
                disabled={customers.length === 0}
                onClick={handleExportCustomersCsv}
                className="min-h-[42px] px-4 py-2 rounded-xl border border-[#C5E5FF] bg-[#EAF4FF] hover:bg-[#C5E5FF]/60 text-[#004AAD] text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed self-start sm:self-auto whitespace-nowrap"
              >
                <FileSpreadsheet className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>تصدير CSV</span>
              </button>
            </div>

            {customers.length === 0 ? (
              <div className="p-10 text-center text-sm text-[#5A657D]">
                لا توجد سجلات عملاء محفوظة حالياً.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="bg-[#F4F8FC] border-b border-[#E8EDF4] text-xs font-bold text-[#5A657D]">
                    <tr>
                      <th className="py-3.5 px-4">الاسم الكامل</th>
                      <th className="py-3.5 px-4">الهاتف / واتساب</th>
                      <th className="py-3.5 px-4">الجنسية</th>
                      <th className="py-3.5 px-4">المهنة</th>
                      <th className="py-3.5 px-4">عدد الطلبات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8EDF4]">
                    {customers.map((cust) => (
                      <tr key={cust.id} className="hover:bg-[#F4F8FC]/60">
                        <td className="py-3.5 px-4 font-bold text-[#0B0B0D]">{cust.fullName}</td>
                        <td className="py-3.5 px-4 font-en tabular-nums text-right text-[#334155]" dir="ltr">
                          {cust.phoneNumber}
                        </td>
                        <td className="py-3.5 px-4 text-[#334155]">{cust.nationality}</td>
                        <td className="py-3.5 px-4 text-[#334155]">{cust.currentProfession}</td>
                        <td className="py-3.5 px-4 tabular-nums font-bold text-[#161A8D]">
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
          <div className="bg-white rounded-2xl border border-[#E8EDF4] p-5 sm:p-6 space-y-5">
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-[#0B0B0D]">
                وحدة فحص ومراجعة المستندات المرفوعة
              </h1>
              <p className="text-xs sm:text-sm text-[#5A657D] mt-1">
                مراجعة جواز السفر الساري والصورة الشخصية الحديثة لكل طلب محفوظ.
              </p>
            </div>

            {records.length === 0 ? (
              <div className="p-8 rounded-xl bg-[#F4F8FC] border border-[#E8EDF4] text-center text-sm text-[#5A657D]">
                لا توجد مستندات مرفوعة للمراجعة حالياً.
              </div>
            ) : (
              <div className="space-y-4">
                {records.map((app) => (
                  <div
                    key={app.id}
                    className="rounded-xl border border-[#E8EDF4] p-4 sm:p-5 space-y-4"
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-[#E8EDF4] pb-3">
                      <span className="font-bold text-[#0B0B0D]">{app.fullName}</span>
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
                          className="p-4 rounded-xl bg-[#F4F8FC] border border-[#E8EDF4] flex flex-col justify-between gap-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <FileText
                                className="w-5 h-5 text-[#161A8D] shrink-0"
                                aria-hidden="true"
                              />
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-[#0B0B0D]">
                                  {docItem.labelAr}
                                </p>
                                <p
                                  className="text-xs text-[#5A657D] font-en truncate text-right"
                                  dir="ltr"
                                >
                                  {docItem.fileName} ({formatFileSize(docItem.fileSizeBytes)})
                                </p>
                              </div>
                            </div>
                            <DocumentStatusBadge status={docItem.verificationStatus} />
                          </div>

                          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E8EDF4]">
                            <button
                              type="button"
                              disabled={isOpeningDoc === `${app.id}-${docItem.type}`}
                              onClick={() =>
                                void handleOpenDocument(
                                  app.id,
                                  docItem.type,
                                  docItem.storedFileName,
                                  docItem.labelAr,
                                  docItem.fileName
                                )
                              }
                              className="min-h-[44px] sm:min-h-[38px] px-3.5 py-1.5 rounded-lg bg-white border border-[#E8EDF4] text-[#004AAD] hover:border-[#004AAD] hover:bg-[#EAF4FF] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                            >
                              <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>
                                {isOpeningDoc === `${app.id}-${docItem.type}`
                                  ? 'جاري التحميل...'
                                  : 'معاينة المستند'}
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                void handleDocumentReviewUpdate(
                                  app,
                                  docItem.id,
                                  DocumentVerificationStatus.APPROVED
                                )
                              }
                              className="min-h-[44px] sm:min-h-[38px] px-3.5 py-1.5 rounded-lg bg-[#16A36A] text-white text-xs font-bold hover:bg-[#128656] cursor-pointer"
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
                              className="min-h-[44px] sm:min-h-[38px] px-3.5 py-1.5 rounded-lg bg-[#FDECEE] border border-[#DC3545]/30 text-[#DC3545] text-xs font-bold hover:bg-[#DC3545]/10 cursor-pointer"
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

        {/* TAB 4: ROLES & PERMISSIONS + STAFF DIRECTORY */}
        {activeTab === 'roles' && (
          <div className="space-y-6">
            {/* Staff Directory Management (Super Admin Controlled) */}
            <div className="bg-white rounded-2xl border border-[#E8EDF4] overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-[#E8EDF4] flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EAF4FF] text-[#004AAD] flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-[#0B0B0D]">
                      إدارة أعضاء فريق العمل المعتمد
                    </h2>
                    <p className="text-xs sm:text-sm text-[#5A657D] mt-1">
                      إضافة أو تعديل أو إزالة حسابات موظفي نشكا للسياحة في Cloud Firestore (محمية
                      حصرياً لحساب المدير العام {BOOTSTRAPPED_SUPER_ADMIN_EMAIL}).
                    </p>
                  </div>
                </div>
              </div>

              {isSuperAdmin ? (
                <div className="p-5 sm:p-6 space-y-6">
                  <form
                    onSubmit={(e) => void handleSaveStaffMember(e)}
                    className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end bg-[#F4F8FC] p-4 rounded-xl border border-[#E8EDF4]"
                  >
                    <div className="md:col-span-4">
                      <label className="block text-xs font-bold text-[#0B0B0D] mb-1.5">
                        البريد الإلكتروني (حساب Google)
                      </label>
                      <input
                        type="email"
                        dir="ltr"
                        required
                        value={staffEmailInput}
                        onChange={(e) => setStaffEmailInput(e.target.value)}
                        placeholder="staff@gmail.com"
                        className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#E8EDF4] bg-white text-sm text-[#0B0B0D] font-en text-right focus:outline-none focus:border-[#161A8D]"
                      />
                    </div>

                    <div className="md:col-span-4">
                      <label className="block text-xs font-bold text-[#0B0B0D] mb-1.5">
                        الاسم الكامل للموظف
                      </label>
                      <input
                        type="text"
                        required
                        value={staffNameInput}
                        onChange={(e) => setStaffNameInput(e.target.value)}
                        placeholder="مثال: أحمد مصطفى"
                        className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#E8EDF4] bg-white text-sm text-[#0B0B0D] focus:outline-none focus:border-[#161A8D]"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-[#0B0B0D] mb-1.5">
                        الدور الوظيفي
                      </label>
                      <select
                        value={staffRoleInput}
                        onChange={(e) => setStaffRoleInput(e.target.value as AssignableStaffRole)}
                        className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-[#E8EDF4] bg-white text-xs sm:text-sm font-semibold text-[#0B0B0D] focus:outline-none focus:border-[#161A8D]"
                      >
                        {ASSIGNABLE_ROLE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.labelAr}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        fullWidth
                        isLoading={isSavingStaff}
                        className="min-h-[44px]"
                      >
                        <UserPlus className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <span>إضافة عضو</span>
                      </Button>
                    </div>
                  </form>

                  {staffFeedback && (
                    <div
                      role="status"
                      className={[
                        'rounded-xl border p-3.5 text-xs sm:text-sm font-semibold flex items-center gap-2',
                        staffFeedback.type === 'ok'
                          ? 'bg-[#E9F8F0] border-[#16A36A]/30 text-[#16A36A]'
                          : 'bg-[#FDECEE] border-[#DC3545]/30 text-[#DC3545]',
                      ].join(' ')}
                    >
                      {staffFeedback.type === 'ok' ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                      ) : (
                        <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                      )}
                      <span>{staffFeedback.text}</span>
                    </div>
                  )}

                  {staffEntries.length === 0 ? (
                    <div className="p-6 rounded-xl bg-[#F4F8FC] border border-dashed border-[#E8EDF4] text-center text-xs sm:text-sm text-[#5A657D]">
                      لا يوجد أعضاء مضافون حالياً بخلاف حساب المدير العام ({BOOTSTRAPPED_SUPER_ADMIN_EMAIL}).
                    </div>
                  ) : (
                    <div className="overflow-x-auto border border-[#E8EDF4] rounded-xl">
                      <table className="w-full text-right text-sm">
                        <thead className="bg-[#F4F8FC] border-b border-[#E8EDF4] text-xs font-bold text-[#5A657D]">
                          <tr>
                            <th className="py-3 px-4">الاسم الكامل</th>
                            <th className="py-3 px-4">البريد الإلكتروني</th>
                            <th className="py-3 px-4">الدور الوظيفي</th>
                            <th className="py-3 px-4">الإجراء</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8EDF4]">
                          {staffEntries.map((entry) => (
                            <tr key={entry.staffKey}>
                              <td className="py-3 px-4 font-bold text-[#0B0B0D]">
                                {entry.displayName}
                              </td>
                              <td
                                className="py-3 px-4 font-en text-[#334155] text-right"
                                dir="ltr"
                              >
                                {entry.email}
                              </td>
                              <td className="py-3 px-4">
                                <select
                                  aria-label={`تغيير دور ${entry.displayName}`}
                                  value={entry.role}
                                  onChange={(e) =>
                                    void handleUpdateStaffRole(
                                      entry,
                                      e.target.value as AssignableStaffRole
                                    )
                                  }
                                  className="min-h-[38px] px-2.5 py-1 rounded-lg border border-[#E8EDF4] bg-white text-xs font-bold text-[#0B0B0D]"
                                >
                                  {ASSIGNABLE_ROLE_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                      {opt.labelAr}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="py-3 px-4">
                                <button
                                  type="button"
                                  onClick={() => void handleRemoveStaffMember(entry)}
                                  className="min-h-[38px] px-3 py-1 rounded-lg bg-[#FDECEE] hover:bg-[#DC3545]/15 text-[#DC3545] text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                                  <span>إزالة</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-5 sm:p-6 text-sm text-[#5A657D]">
                  تقتصر صلاحية إضافة أو تعديل أعضاء الفريق على حساب المدير العام المعتمد فقط.
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-[#E8EDF4] overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-[#E8EDF4]">
                <h1 className="text-lg sm:text-xl font-extrabold text-[#0B0B0D]">
                  مصفوفة الأدوار والصلاحيات الإدارية (RBAC)
                </h1>
                <p className="text-xs sm:text-sm text-[#5A657D] mt-1">
                  الهيكل المعتمد لصلاحيات فريق نشكا للسياحة بقيادة الحساب الرئيسي ({BOOTSTRAPPED_SUPER_ADMIN_EMAIL}).
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="bg-[#F4F8FC] border-b border-[#E8EDF4] text-xs font-bold text-[#5A657D]">
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
                  <tbody className="divide-y divide-[#E8EDF4]">
                    {ADMIN_ROLES_MATRIX.map((item) => (
                      <tr key={item.role}>
                        <td className="py-4 px-4">
                          <p className="font-bold text-[#0B0B0D]">{item.titleAr}</p>
                          <p className="text-xs text-[#5A657D] mt-0.5">{item.descriptionAr}</p>
                        </td>
                        {Object.values(item.permissions).map((allowed, idx) => (
                          <td key={idx} className="py-4 px-4">
                            {allowed ? (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#16A36A]">
                                <Check className="w-4 h-4" aria-hidden="true" />
                                <span>مسموح</span>
                              </span>
                            ) : (
                              <span className="text-xs text-[#5A657D]/65">غير مصرح</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: BACKEND INTEGRATION STATUS */}
        {activeTab === 'integrations' && (
          <div className="bg-white rounded-2xl border border-[#E8EDF4] p-5 sm:p-6 space-y-5">
            <div className="flex items-start gap-3">
              <Database className="w-6 h-6 text-[#161A8D] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h1 className="text-lg sm:text-xl font-extrabold text-[#0B0B0D]">
                  حالة البنية السحابية والتكاملات الإنتاجية
                </h1>
                <p className="text-xs sm:text-sm text-[#5A657D] mt-1">
                  ملخص حالة قواعد البيانات السحابية ومصادقة الموظفين وحماية الملفات المرفوعة.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PRODUCTION_READINESS_ITEMS.map((item) => (
                <div
                  key={item.key}
                  className="rounded-xl border border-[#E8EDF4] p-4 sm:p-5 bg-[#F4F8FC] flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h2 className="text-sm sm:text-base font-bold text-[#0B0B0D]">
                        {item.titleAr}
                      </h2>
                      {item.status === 'configured' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#E9F8F0] text-xs font-bold text-[#16A36A] whitespace-nowrap">
                          <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                          <span>مفعّل ونشط</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#FFF5E5] text-xs font-bold text-[#E99A28] whitespace-nowrap">
                          اختياري مستقبلاً
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-[#5A657D] leading-relaxed">
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
          className="fixed inset-0 z-50 bg-[#0B0B0D]/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl border border-[#E8EDF4] max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="px-5 py-4 border-b border-[#E8EDF4] flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-base font-extrabold text-[#0B0B0D]">
                  {previewDoc.labelAr}
                </h2>
                <p className="text-xs text-[#5A657D] font-en truncate text-right" dir="ltr">
                  {previewDoc.fileName}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={previewDoc.blobUrl}
                  download={previewDoc.fileName}
                  className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#EAF4FF] text-[#004AAD] hover:bg-[#C5E5FF]/70 text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>تنزيل</span>
                </a>
                <button
                  type="button"
                  onClick={closePreviewModal}
                  aria-label="إغلاق المعاينة"
                  className="w-9 h-9 rounded-lg border border-[#E8EDF4] text-[#5A657D] hover:text-[#0B0B0D] flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-[#F4F8FC] flex-1 overflow-auto flex items-center justify-center min-h-[300px]">
              {previewDoc.mimeType === 'application/pdf' ? (
                <iframe
                  src={previewDoc.blobUrl}
                  title={previewDoc.labelAr}
                  className="w-full h-[65vh] rounded-lg border border-[#E8EDF4] bg-white"
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
    robots: 'noindex, nofollow, noarchive',
  });

  return (
    <FirestoreErrorBoundary>
      <FirebaseAdminAuthProvider>
        <AdminWorkspaceContent />
      </FirebaseAdminAuthProvider>
    </FirestoreErrorBoundary>
  );
}
