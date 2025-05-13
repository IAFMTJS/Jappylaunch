import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  sendEmailVerification,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { getAuthInstance, getFirestoreInstance } from '../utils/firebase';
import type { AuthContextType, AuthErrorResponse, User } from '../types/auth';

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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthErrorResponse | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [sessionWarning, setSessionWarning] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);
  const MAX_LOGIN_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
  const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(null);

  // Initialize Firebase first
  useEffect(() => {
    console.log('AuthProvider: Starting Firebase initialization check...');
    const checkFirebaseInitialization = async () => {
      try {
        // Try to get auth instance - this will throw if Firebase is not initialized
        const auth = getAuthInstance();
        console.log('AuthProvider: Firebase is initialized, auth instance:', auth);
        setFirebaseInitialized(true);
      } catch (error) {
        console.error('AuthProvider: Firebase not initialized yet:', error);
        setFirebaseInitialized(false);
        // Retry after a short delay
        setTimeout(checkFirebaseInitialization, 100);
      }
    };

    checkFirebaseInitialization();
  }, []);

  // Only set up auth state listener after Firebase is initialized
  useEffect(() => {
    if (!firebaseInitialized) {
      console.log('AuthProvider: Waiting for Firebase initialization...');
      return;
    }

    console.log('AuthProvider: Firebase initialized, setting up auth state listener...');
    let unsubscribe: (() => void) | undefined;

    const setupAuth = async () => {
      try {
        const auth = getAuthInstance();
        unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
          console.log('AuthProvider: Auth state changed:', {
            hasUser: !!user,
            email: user?.email,
            emailVerified: user?.emailVerified,
            timestamp: new Date().toISOString()
          });
          setCurrentUser(user);
          setLoading(false);
          setIsInitialized(true);
        }, (error: unknown) => {
          console.error('AuthProvider: Firebase auth initialization error:', {
            error,
            code: (error as { code?: string })?.code,
            message: (error as Error)?.message,
            timestamp: new Date().toISOString()
          });
          setError(handleAuthError(error));
          setLoading(false);
          setIsInitialized(true);
        });

        console.log('AuthProvider: Auth state listener set up successfully');
      } catch (error) {
        console.error('AuthProvider: Critical error setting up auth state listener:', {
          error,
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          timestamp: new Date().toISOString()
        });
        setError(handleAuthError(error));
        setLoading(false);
        setIsInitialized(true);
      }
    };

    setupAuth();

    return () => {
      console.log('AuthProvider: Cleaning up auth state listener');
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [firebaseInitialized]); // Only run when firebaseInitialized changes

  const handleAuthError = (error: unknown): AuthErrorResponse => {
    if (error instanceof Error) {
      const errorCode = (error as { code?: string })?.code;
      const errorName = error.name || 'FirebaseError';
      switch (errorCode) {
        case 'auth/invalid-email':
          return { code: 'auth/invalid-email', message: 'Invalid email address', name: errorName };
        case 'auth/user-disabled':
          return { code: 'auth/user-disabled', message: 'This account has been disabled', name: errorName };
        case 'auth/user-not-found':
          return { code: 'auth/user-not-found', message: 'No account found with this email', name: errorName };
        case 'auth/wrong-password':
          return { code: 'auth/wrong-password', message: 'Incorrect password', name: errorName };
        case 'auth/too-many-requests':
          return { code: 'auth/too-many-requests', message: 'Too many failed attempts. Please try again later', name: errorName };
        default:
          return { code: 'unknown', message: error.message || 'An error occurred during authentication', name: errorName };
      }
    }
    return { code: 'unknown', message: 'An unexpected error occurred', name: 'UnknownError' };
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

      const auth = getAuthInstance();
      await signInWithEmailAndPassword(auth, email, password);
      setLoginAttempts(0);
      setLockoutEndTime(null);
    } catch (err) {
      const errorMessage = handleAuthError(err);
      setError(errorMessage);
      
      if (errorMessage.code === 'auth/wrong-password') {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        
        if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
          const endTime = Date.now() + LOCKOUT_DURATION;
          setLockoutEndTime(endTime);
          throw new Error(`Too many failed attempts. Account locked for 15 minutes`);
        }
      }
      
      throw new Error(errorMessage.message);
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      clearError();
      const auth = getAuthInstance();
      const db = getFirestoreInstance();
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
      const auth = getAuthInstance();
      await signOut(auth);
    } catch (err) {
      const errorMessage = handleAuthError(err);
      setError(errorMessage);
      throw new Error(errorMessage.message);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      clearError();
      const auth = getAuthInstance();
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      const errorMessage = handleAuthError(err);
      setError(errorMessage);
      throw new Error(errorMessage.message);
    }
  };

  const updateUserPassword = async (_actionCode: string, newPassword: string) => {
    try {
      clearError();
      if (!currentUser) {
        throw new Error('No user is currently signed in');
      }
      await updatePassword(currentUser, newPassword);
    } catch (error: unknown) {
      handleAuthError(error);
    }
  };

  const sendVerificationEmail = async () => {
    try {
      clearError();
      if (!currentUser) {
        throw new Error('No user is currently signed in');
      }
      await sendEmailVerification(currentUser);
    } catch (error: unknown) {
      handleAuthError(error);
    }
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    error,
    login,
    logout,
    resetPassword,
    updateUserPassword,
    sendVerificationEmail,
    isEmailVerified: currentUser?.emailVerified ?? false,
    sessionWarning,
    resetSessionTimer,
    signup,
    clearError
  };

  if (!firebaseInitialized || !isInitialized || loading) {
    console.log('AuthProvider: Not ready, rendering loading screen', {
      firebaseInitialized,
      isInitialized,
      loading
    });
    return <LoadingScreen />;
  }

  if (error && !currentUser) {
    console.error('AuthProvider: Error state with no user, rendering error screen');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-6 bg-red-50 dark:bg-red-900 rounded-lg max-w-2xl mx-4">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Authentication Error</h2>
          <p className="text-red-500 dark:text-red-300 mb-4">{error.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  console.log('AuthProvider: Rendering children with auth context');
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 