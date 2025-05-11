import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, AuthError, UserCredential } from 'firebase/auth';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  sendEmailVerification
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../utils/firebase';
import type { AuthContextType, AuthErrorResponse } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthErrorResponse | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [sessionWarning, setSessionWarning] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setCurrentUser(user);
      setIsEmailVerified(user?.emailVerified ?? false);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleError = (error: unknown): never => {
    if (error instanceof AuthError) {
      const errorResponse: AuthErrorResponse = {
        code: error.code,
        message: error.message,
        name: error.name
      };
      setError(errorResponse);
      throw error;
    }
    if (error instanceof Error) {
      const errorResponse: AuthErrorResponse = {
        code: 'unknown',
        message: error.message,
        name: error.name
      };
      setError(errorResponse);
      throw error;
    }
    const defaultError: AuthErrorResponse = {
      code: 'unknown',
      message: 'An unknown error occurred',
      name: 'Error'
    };
    setError(defaultError);
    throw new Error(defaultError.message);
  };

  const clearError = () => setError(null);

  const resetSessionTimer = () => {
    setSessionWarning(false);
    // Additional session management logic can be added here
  };

  const login = async (email: string, password: string) => {
    try {
      clearError();
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: unknown) {
      handleError(error);
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
      handleError(error);
    }
  };

  const logout = async () => {
    try {
      clearError();
      await signOut(auth);
    } catch (error: unknown) {
      handleError(error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      clearError();
      await sendPasswordResetEmail(auth, email);
    } catch (error: unknown) {
      handleError(error);
    }
  };

  const updateUserPassword = async (actionCode: string, newPassword: string) => {
    try {
      clearError();
      if (!currentUser) {
        throw new Error('No user is currently signed in');
      }
      await updatePassword(currentUser, newPassword);
    } catch (error: unknown) {
      handleError(error);
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
      handleError(error);
    }
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    login,
    signup,
    logout,
    sendVerificationEmail,
    resetPassword,
    updateUserPassword,
    isEmailVerified,
    sessionWarning,
    resetSessionTimer,
    error,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 