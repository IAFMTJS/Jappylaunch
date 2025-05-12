import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  sendEmailVerification,
  type User as FirebaseUser,
  type AuthError as FirebaseAuthError,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import type { AuthContextType, AuthErrorResponse } from '../types/auth';

// Initialize Firebase auth
const app = getApp();
const auth = getAuth(app);

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  </div>
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const MAX_LOGIN_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
  const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(null);

  useEffect(() => {
    console.log('AuthProvider: Starting authentication state listener...');
    try {
      const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
        console.log('AuthProvider: Auth state changed:', {
          hasUser: !!user,
          email: user?.email,
          emailVerified: user?.emailVerified,
          timestamp: new Date().toISOString()
        });
        setUser(user);
        setLoading(false);
      }, (error: unknown) => {
        console.error('AuthProvider: Firebase auth initialization error:', {
          error,
          code: (error as { code?: string })?.code,
          message: (error as Error)?.message,
          timestamp: new Date().toISOString()
        });
        setError(handleAuthError(error));
        setLoading(false);
      });

      console.log('AuthProvider: Auth state listener set up successfully');
      return () => {
        console.log('AuthProvider: Cleaning up auth state listener');
        unsubscribe();
      };
    } catch (error) {
      console.error('AuthProvider: Critical error setting up auth state listener:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      });
      setError(handleAuthError(error));
      setLoading(false);
    }
  }, []);

  const handleAuthError = (error: unknown): string => {
    if (error instanceof Error) {
      const errorCode = (error as { code?: string })?.code;
      switch (errorCode) {
        case 'auth/invalid-email':
          return 'Invalid email address';
        case 'auth/user-disabled':
          return 'This account has been disabled';
        case 'auth/user-not-found':
          return 'No account found with this email';
        case 'auth/wrong-password':
          return 'Incorrect password';
        case 'auth/too-many-requests':
          return 'Too many failed attempts. Please try again later';
        default:
          return error.message || 'An error occurred during authentication';
      }
    }
    return 'An unexpected error occurred';
  };

  const clearError = () => setError(null);

  const resetSessionTimer = () => {
    setLockoutEndTime(null);
    setLoginAttempts(0);
    // Additional session management logic can be added here
  };

  const login = async (email: string, password: string) => {
    try {
      if (lockoutEndTime && Date.now() < lockoutEndTime) {
        const remainingTime = Math.ceil((lockoutEndTime - Date.now()) / 60000);
        throw new Error(`Account is locked. Please try again in ${remainingTime} minutes`);
      }

      await signInWithEmailAndPassword(auth, email, password);
      setLoginAttempts(0);
      setLockoutEndTime(null);
    } catch (err) {
      const errorMessage = handleAuthError(err);
      setError(errorMessage);
      
      if (errorMessage.includes('Incorrect password')) {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        
        if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
          const endTime = Date.now() + LOCKOUT_DURATION;
          setLockoutEndTime(endTime);
          throw new Error(`Too many failed attempts. Account locked for 15 minutes`);
        }
      }
      
      throw new Error(errorMessage);
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      clearError();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create a user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });

      // Send email verification
      await sendEmailVerification(user);
    } catch (error: unknown) {
      handleAuthError(error);
    }
  };

  const logout = async () => {
    try {
      clearError();
      await signOut(auth);
    } catch (err) {
      const errorMessage = handleAuthError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      clearError();
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      const errorMessage = handleAuthError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateUserPassword = async (_actionCode: string, newPassword: string) => {
    try {
      clearError();
      if (!user) {
        throw new Error('No user is currently signed in');
      }
      await updatePassword(user, newPassword);
    } catch (error: unknown) {
      handleAuthError(error);
    }
  };

  const sendVerificationEmail = async () => {
    try {
      clearError();
      if (!user) {
        throw new Error('No user is currently signed in');
      }
      await sendEmailVerification(user);
    } catch (error: unknown) {
      handleAuthError(error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    logout,
    resetPassword,
    updateUserPassword,
    sendVerificationEmail,
    resetSessionTimer
  };

  if (loading) {
    console.log('AuthProvider: Rendering loading screen');
    return <LoadingScreen />;
  }

  console.log('AuthProvider: Rendering children with auth context');
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 