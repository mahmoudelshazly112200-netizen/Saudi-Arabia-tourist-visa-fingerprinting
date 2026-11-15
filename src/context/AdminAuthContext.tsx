import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import {
  auth,
  BOOTSTRAPPED_SUPER_ADMIN_EMAIL,
  db,
  googleAuthProvider,
  handleFirestoreError,
  OperationType,
} from '../firebase';

interface AdminAuthContextValue {
  user: User | null;
  authReady: boolean;
  isSigningIn: boolean;
  isAuthorizedAdmin: boolean;
  adminRoleLabelAr: string;
  authError: string;
  signInWithGoogle: () => Promise<void>;
  signOutAdmin: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

const ROLE_LABELS_AR: Record<string, string> = {
  super_admin: 'المدير العام المعتمد (Super Admin)',
  visa_operations_manager: 'مدير عمليات التأشيرات',
  document_reviewer: 'مسؤول فحص المستندات',
  customer_support: 'مسؤول متابعة العملاء',
};

export function FirebaseAdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isAuthorizedAdmin, setIsAuthorizedAdmin] = useState(false);
  const [adminRoleLabelAr, setAdminRoleLabelAr] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      setAuthError('');

      if (!nextUser) {
        setIsAuthorizedAdmin(false);
        setAdminRoleLabelAr('');
        setAuthReady(true);
        return;
      }

      const normalizedEmail = (nextUser.email || '').trim().toLowerCase();
      if (nextUser.emailVerified && normalizedEmail === BOOTSTRAPPED_SUPER_ADMIN_EMAIL) {
        setIsAuthorizedAdmin(true);
        setAdminRoleLabelAr(ROLE_LABELS_AR.super_admin);
        setAuthReady(true);
        return;
      }

      if (!nextUser.emailVerified) {
        setIsAuthorizedAdmin(false);
        setAdminRoleLabelAr('');
        setAuthReady(true);
        return;
      }

      const adminDocPath = `admins/${nextUser.uid}`;
      try {
        const snap = await getDoc(doc(db, 'admins', nextUser.uid));
        if (snap.exists()) {
          const data = snap.data() as { role?: string };
          setIsAuthorizedAdmin(true);
          setAdminRoleLabelAr(ROLE_LABELS_AR[data.role || ''] || 'موظف إدارة معتمد');
        } else {
          setIsAuthorizedAdmin(false);
          setAdminRoleLabelAr('');
        }
      } catch (err) {
        setIsAuthorizedAdmin(false);
        setAdminRoleLabelAr('');
        try {
          handleFirestoreError(err, OperationType.GET, adminDocPath);
        } catch {
          // Error already logged in structured FirestoreErrorInfo format
        }
      } finally {
        setAuthReady(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setIsSigningIn(true);
    setAuthError('');
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (err) {
      const code =
        err && typeof err === 'object' && 'code' in err ? String(err.code) : '';
      if (code === 'auth/popup-closed-by-user') {
        setAuthError('تم إغلاق نافذة تسجيل الدخول قبل استكمال المصادقة.');
      } else if (code === 'auth/popup-blocked') {
        setAuthError('تم حظر نافذة تسجيل الدخول المنبثقة في المتصفح. يرجى السماح بالنوافذ المنبثقة والمحاولة مجدداً.');
      } else {
        setAuthError('تعذر إتمام تسجيل الدخول عبر Google حالياً. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setIsSigningIn(false);
    }
  }, []);

  const signOutAdmin = useCallback(async () => {
    setAuthError('');
    await signOut(auth);
  }, []);

  const getIdToken = useCallback(async (): Promise<string | null> => {
    if (!auth.currentUser) return null;
    return auth.currentUser.getIdToken();
  }, []);

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      user,
      authReady,
      isSigningIn,
      isAuthorizedAdmin,
      adminRoleLabelAr,
      authError,
      signInWithGoogle,
      signOutAdmin,
      getIdToken,
    }),
    [
      user,
      authReady,
      isSigningIn,
      isAuthorizedAdmin,
      adminRoleLabelAr,
      authError,
      signInWithGoogle,
      signOutAdmin,
      getIdToken,
    ]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error('useAdminAuth must be used inside FirebaseAdminAuthProvider');
  }
  return ctx;
}
