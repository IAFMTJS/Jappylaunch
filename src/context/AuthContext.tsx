import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  type User
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '../utils/firebase';
import {
  AuthContextType,
  AuthErrorResponse,
  AuthState,
  SessionState,
  RateLimitState,
  AUTH_CONSTANTS
} from '../types/auth';

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    session: {
      isActive: false,
      lastActivity: Date.now(),
      warningShown: false
    }
  });

  const [rateLimit, setRateLimit] = useState<RateLimitState>({
    attempts: 0,
    lastAttempt: 0,
    lockedUntil: null
  });

  const [sessionTimer, setSessionTimer] = useState<NodeJS.Timeout | null>(null);
  const [warningTimer, setWarningTimer] = useState<NodeJS.Timeout | null>(null);

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  const resetSessionTimer = useCallback(() => {
    if (sessionTimer) clearTimeout(sessionTimer);
    if (warningTimer) clearTimeout(warningTimer);

    setAuthState(prev => ({
      ...prev,
      session: {
        ...prev.session,
        lastActivity: Date.now(),
        warningShown: false
      }
    }));

    if (authState.user) {
      const warning = setTimeout(() => {
        setAuthState(prev => ({
          ...prev,
          session: { ...prev.session, warningShown: true }
        }));
      }, AUTH_CONSTANTS.SESSION_TIMEOUT - AUTH_CONSTANTS.WARNING_TIME);

      const timeout = setTimeout(async () => {
        try {
          await logout();
        } catch (error) {
          console.error('Session timeout logout failed:', error);
        }
      }, AUTH_CONSTANTS.SESSION_TIMEOUT);

      setWarningTimer(warning);
      setSessionTimer(timeout);
    }
  }, [authState.user]);

  // Reset session timer on user activity
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const handleUserActivity = () => {
      resetSessionTimer();
    };

    events.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [resetSessionTimer]);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (sessionTimer) clearTimeout(sessionTimer);
      if (warningTimer) clearTimeout(warningTimer);
    };
  }, [sessionTimer, warningTimer]);

  const handleAuthError = (error: unknown): AuthErrorResponse => {
    if (error instanceof Error) {
      if (error instanceof FirebaseError) {
        return {
          code: error.code,
          message: error.message,
          name: error.name
        };
      }
      return {
        code: 'unknown',
        message: error.message || 'An unknown error occurred',
        name: error.name || 'Error'
      };
    }
    return {
      code: 'unknown',
      message: 'An unknown error occurred',
      name: 'Error'
    };
  };

  async function signup(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      setAuthState(prev => ({ ...prev, user: userCredential.user, error: null }));
    } catch (error) {
      setAuthState(prev => ({ ...prev, error: handleAuthError(error) }));
      throw error;
    }
  }

  async function login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (!userCredential.user.emailVerified) {
        throw new Error('Please verify your email before logging in.');
      }

      setAuthState(prev => ({ ...prev, user: userCredential.user, error: null }));
      setRateLimit({ attempts: 0, lastAttempt: 0, lockedUntil: null });
    } catch (error) {
      const newAttempts = rateLimit.attempts + 1;
      const lockedUntil = newAttempts >= AUTH_CONSTANTS.MAX_LOGIN_ATTEMPTS
        ? Date.now() + AUTH_CONSTANTS.LOCKOUT_DURATION
        : null;

      setRateLimit({
        attempts: newAttempts,
        lastAttempt: Date.now(),
        lockedUntil
      });

      setAuthState(prev => ({ ...prev, error: handleAuthError(error) }));
      throw error;
    }
  }

  async function logout() {
    try {
      await signOut(auth);
      setAuthState({
        user: null,
        loading: false,
        error: null,
        session: {
          isActive: false,
          lastActivity: Date.now(),
          warningShown: false
        }
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, error: handleAuthError(error) }));
      throw error;
    }
  }

  async function sendVerificationEmail() {
    if (!authState.user) {
      throw new Error('No user is currently signed in');
    }
    try {
      await sendEmailVerification(authState.user);
      setAuthState(prev => ({ ...prev, error: null }));
    } catch (error) {
      setAuthState(prev => ({ ...prev, error: handleAuthError(error) }));
      throw error;
    }
  }

  async function resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
      setAuthState(prev => ({ ...prev, error: null }));
    } catch (error) {
      setAuthState(prev => ({ ...prev, error: handleAuthError(error) }));
      throw error;
    }
  }

  async function updateUserPassword(actionCode: string, newPassword: string) {
    if (!authState.user?.email) {
      throw new Error('No user is currently signed in');
    }

    try {
      const credential = EmailAuthProvider.credential(
        authState.user.email,
        actionCode
      );
      await reauthenticateWithCredential(authState.user, credential);
      await updatePassword(authState.user, newPassword);
      setAuthState(prev => ({ ...prev, error: null }));
    } catch (error) {
      setAuthState(prev => ({ ...prev, error: handleAuthError(error) }));
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setAuthState(prev => ({
        ...prev,
        user,
        loading: false,
        session: {
          ...prev.session,
          isActive: !!user,
          lastActivity: Date.now()
        }
      }));

      if (user) {
        resetSessionTimer();
      } else {
        if (sessionTimer) clearTimeout(sessionTimer);
        if (warningTimer) clearTimeout(warningTimer);
      }
    });

    return unsubscribe;
  }, [resetSessionTimer]);

  const value: AuthContextType = {
    currentUser: authState.user,
    loading: authState.loading,
    signup,
    login,
    logout,
    sendVerificationEmail,
    resetPassword,
    updateUserPassword,
    isEmailVerified: authState.user?.emailVerified ?? false,
    sessionWarning: authState.session.warningShown,
    resetSessionTimer,
    error: authState.error,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {!authState.loading && children}
    </AuthContext.Provider>
  );
} 