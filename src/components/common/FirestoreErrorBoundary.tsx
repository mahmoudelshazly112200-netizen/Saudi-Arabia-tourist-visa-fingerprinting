import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface FirestoreErrorBoundaryProps {
  children: React.ReactNode;
}

interface FirestoreErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class FirestoreErrorBoundary extends React.Component<
  FirestoreErrorBoundaryProps,
  FirestoreErrorBoundaryState
> {
  public state: FirestoreErrorBoundaryState = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): FirestoreErrorBoundaryState {
    let friendly = 'حدث خطأ أثناء الاتصال بقاعدة البيانات السحابية.';
    try {
      const parsed = JSON.parse(error.message) as { error?: string };
      if (parsed.error && parsed.error.includes('Quota exceeded')) {
        friendly = 'تم تجاوز الحصة اليومية المجانية لقاعدة البيانات السحابية. يتم تجديد الحصة تلقائياً في اليوم التالي.';
      } else if (parsed.error && parsed.error.includes('Missing or insufficient permissions')) {
        friendly = 'غير مصرح بتنفيذ هذه العملية وفق قواعد الحماية الأمنية المعتمدة.';
      }
    } catch {
      // Non-JSON error message
    }
    return {
      hasError: true,
      errorMessage: friendly,
    };
  }

  public render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div
          dir="rtl"
          className="min-h-[50vh] flex items-center justify-center p-6 bg-[#F7F9FC]"
        >
          <div className="max-w-md w-full bg-white rounded-2xl border border-red-200 p-6 space-y-4 text-right shadow-sm">
            <div className="flex items-center gap-3 text-red-700">
              <AlertCircle className="w-6 h-6 shrink-0" aria-hidden="true" />
              <h2 className="text-base font-extrabold">تنبيه من نظام الحماية والبيانات</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {this.state.errorMessage}
            </p>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false, errorMessage: '' })}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-[#161A8D] text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              <span>إعادة المحاولة</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
