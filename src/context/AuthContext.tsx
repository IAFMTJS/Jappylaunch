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
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { getAuthInstance, getFirestoreInstance } from '../utils/firebase';
import { checkPasswordStrength, isValidEmail } from '../utils/security';
import { AUTH_CONSTANTS } from '../types/auth';
import type { 
  AuthContextType, 
  AuthErrorResponse, 
  AuthErrorCode,
  User,
  SessionState,
  SessionConfig
} from '../types/auth';

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
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);
  const [sessionState, setSessionState] = useState<SessionState>({
    lastActivity: Date.now(),
    warningShown: false,
    expiresAt: Date.now() + AUTH_CONSTANTS.SESSION_TIMEOUT,
    isActive: true
  });

  // Initialize Firebase first
  useEffect(() => {
    console.log('AuthProvider: Starting Firebase initialization check...');
    const checkFirebaseInitialization = async () => {
      try {
        const auth = await getAuthInstance();
        console.log('AuthProvider: Firebase is initialized, auth instance:', auth);
        setFirebaseInitialized(true);
      } catch (error) {
        console.error('AuthProvider: Firebase initialization failed:', error);
        setFirebaseInitialized(false);
        setError(handleAuthError(error, 'Firebase initialization'));
      }
    };

    checkFirebaseInitialization();
  }, []);

  // Session management
  useEffect(() => {
    if (!currentUser) return;

    const updateSessionState = () => {
      const now = Date.now();
      setSessionState(prev => {
        const newState = {
          ...prev,
          lastActivity: now,
          expiresAt: now + AUTH_CONSTANTS.SESSION_TIMEOUT
        };

        // Show warning if approaching timeout
        if (!prev.warningShown && newState.expiresAt - now <= AUTH_CONSTANTS.WARNING_TIME) {
          setSessionWarning(true);
          newState.warningShown = true;
        }

        return newState;
      });
    };

    // Update session on user activity
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    activityEvents.forEach(event => {
      window.addEventListener(event, updateSessionState);
    });

    // Check session timeout
    const sessionCheck = setInterval(() => {
      const now = Date.now();
      if (now >= sessionState.expiresAt) {
        // Session expired
        logout();
      } else if (now >= sessionState.expiresAt - AUTH_CONSTANTS.WARNING_TIME && !sessionWarning) {
        // Show warning
        setSessionWarning(true);
      }
    }, 1000);

    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, updateSessionState);
      });
      clearInterval(sessionCheck);
    };
  }, [currentUser, sessionState.expiresAt, sessionWarning]);

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
        const auth = await getAuthInstance();
        const { onAuthStateChanged } = await import('firebase/auth');
        
        unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
          console.log('AuthProvider: Auth state changed:', {
            hasUser: !!user,
            email: user?.email,
            emailVerified: user?.emailVerified,
            timestamp: new Date().toISOString()
          });

          if (user) {
            // Update last login in Firestore
            try {
              const db = await getFirestoreInstance();
              await updateDoc(doc(db, 'users', user.uid), {
                lastLogin: new Date().toISOString()
              });
            } catch (err) {
              console.error('AuthProvider: Failed to update last login:', err);
            }
          }

          setCurrentUser(user);
          setLoading(false);
          setIsInitialized(true);
          setIsEmailVerified(user?.emailVerified || false);
        }, (error: unknown) => {
          console.error('AuthProvider: Firebase auth initialization error:', {
            error,
            code: (error as { code?: string })?.code,
            message: (error as Error)?.message,
            timestamp: new Date().toISOString()
          });
          setError(handleAuthError(error, 'Firebase auth initialization'));
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
        setError(handleAuthError(error, 'Firebase auth initialization'));
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
  }, [firebaseInitialized]);

  const handleAuthError = useCallback((error: any, context: string): AuthErrorResponse => {
    const errorResponse: AuthErrorResponse = {
      code: (error.code as AuthErrorCode) || 'auth/unknown-error',
      message: error.message || 'An unknown error occurred',
      details: context,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    console.error('Auth Error:', {
      ...errorResponse,
      context,
      originalError: error
    });

    setError(errorResponse);
    return errorResponse;
  }, []);

  const clearError = () => setError(null);

  const resetSessionTimer = useCallback(() => {
    setSessionState(prev => ({
      ...prev,
      lastActivity: Date.now(),
      expiresAt: Date.now() + AUTH_CONSTANTS.SESSION_TIMEOUT,
      warningShown: false
    }));
    setSessionWarning(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      if (!isValidEmail(email)) {
        throw new Error('Invalid email address');
      }

      if (sessionState.expiresAt && Date.now() < sessionState.expiresAt) {
        const remainingTime = Math.ceil((sessionState.expiresAt - Date.now()) / 60000);
        throw new Error(`Account is locked. Please try again in ${remainingTime} minutes`);
      }

      const auth = await getAuthInstance();
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      await signInWithEmailAndPassword(auth, email, password);
      
      // Reset session state on successful login
      resetSessionTimer();
      setLoginAttempts(0);
    } catch (err) {
      const errorMessage = handleAuthError(err, 'login');
      setError(errorMessage);
      
      if (errorMessage.code === 'auth/wrong-password') {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        
        if (newAttempts >= AUTH_CONSTANTS.MAX_LOGIN_ATTEMPTS) {
          const endTime = Date.now() + AUTH_CONSTANTS.LOCKOUT_DURATION;
          setSessionState(prev => ({ ...prev, expiresAt: endTime }));
          throw new Error(`Too many failed attempts. Account locked for ${AUTH_CONSTANTS.LOCKOUT_DURATION / 60000} minutes`);
        }
      }
      
      throw new Error(errorMessage.message);
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      if (!isValidEmail(email)) {
        throw new Error('Invalid email address');
      }

      const { score, feedback } = checkPasswordStrength(password);
      if (score < AUTH_CONSTANTS.PASSWORD_REQUIREMENTS.minScore) {
        throw new Error(feedback.join('. '));
      }

      clearError();
      const auth = await getAuthInstance();
      const db = await getFirestoreInstance();
      const { createUserWithEmailAndPassword, sendEmailVerification } = await import('firebase/auth');
      const { doc, setDoc } = await import('firebase/firestore');
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create a user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        settings: {
          theme: 'system',
          notifications: true,
          sessionTimeout: AUTH_CONSTANTS.SESSION_TIMEOUT
        }
      });

      // Send email verification
      await sendEmailVerification(user);
      
      // Reset session state on successful signup
      resetSessionTimer();
    } catch (error) {
      const errorMessage = handleAuthError(error, 'signup');
      setError(errorMessage);
      throw new Error(errorMessage.message);
    }
  };

  const logout = async () => {
    try {
      clearError();
      const auth = await getAuthInstance();
      const { signOut } = await import('firebase/auth');
      await signOut(auth);
      
      // Reset session state
      setSessionState({
        lastActivity: Date.now(),
        warningShown: false,
        expiresAt: Date.now() + AUTH_CONSTANTS.SESSION_TIMEOUT,
        isActive: true
      });
      setSessionWarning(false);
    } catch (err) {
      const errorMessage = handleAuthError(err, 'logout');
      setError(errorMessage);
      throw new Error(errorMessage.message);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      if (!isValidEmail(email)) {
        throw new Error('Invalid email address');
      }

      clearError();
      const auth = await getAuthInstance();
      const { sendPasswordResetEmail } = await import('firebase/auth');
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      const errorMessage = handleAuthError(err, 'resetPassword');
      setError(errorMessage);
      throw new Error(errorMessage.message);
    }
  };

  const updateUserPassword = async (newPassword: string): Promise<void> => {
    try {
      if (!currentUser) {
        throw new Error('No user is currently signed in');
      }

      if (!checkPasswordStrength(newPassword)) {
        throw new Error('Password does not meet security requirements');
      }

      const auth = await getAuthInstance();
      await updatePassword(auth.currentUser!, newPassword);
      
      // Update the user's password in Firestore
      const userRef = doc(getFirestoreInstance(), 'users', currentUser.uid);
      await updateDoc(userRef, {
        passwordUpdatedAt: new Date().toISOString()
      });

      // Reset session timer after password update
      resetSessionTimer();
    } catch (err) {
      const errorMessage = handleAuthError(err, 'updateUserPassword');
      setError(errorMessage);
      throw new Error(errorMessage.message);
    }
  };

  const sendVerificationEmail = async () => {
    try {
      if (!currentUser) {
        throw new Error('No user is currently signed in');
      }

      clearError();
      const auth = await getAuthInstance();
      const { sendEmailVerification } = await import('firebase/auth');
      await sendEmailVerification(auth.currentUser!);
    } catch (err) {
      const errorMessage = handleAuthError(err, 'sendVerificationEmail');
      setError(errorMessage);
      throw new Error(errorMessage.message);
    }
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    error,
    loginAttempts,
    sessionWarning,
    isInitialized,
    isEmailVerified,
    login,
    signup,
    logout,
    resetPassword,
    updateUserPassword,
    sendVerificationEmail,
    resetSessionTimer
  };

  if (loading) {
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