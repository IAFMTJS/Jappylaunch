import type { User as FirebaseUser } from 'firebase/auth';
import type { FirebaseError } from 'firebase/app';

// Re-export the User type
export type User = FirebaseUser;

// Custom error types for better error handling
export interface AuthErrorResponse {
  code: AuthErrorCode;
  message: string;
  details: string;
  timestamp: number;
  userAgent?: string;
  url?: string;
}

// Session management types
export interface SessionState {
  lastActivity: number;
  warningShown: boolean;
  expiresAt: number;
  isActive: boolean;
}

// User profile types
export interface UserProfile {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  displayName: string | null;
  photoURL: string | null;
  createdAt: number;
  lastLoginAt: number;
}

// Auth state types
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: AuthErrorResponse | null;
  session: SessionState;
}

// Auth context types
export interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: AuthErrorResponse | null;
  loginAttempts: number;
  sessionWarning: boolean;
  isInitialized: boolean;
  isEmailVerified: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserPassword: (newPassword: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  resetSessionTimer: () => void;
}

// Form input types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData extends LoginFormData {
  confirmPassword: string;
}

export interface ResetPasswordFormData {
  email: string;
}

export interface UpdatePasswordFormData {
  password: string;
  confirmPassword: string;
}

// Validation types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface PasswordValidationResult extends ValidationResult {
  score: number;
  feedback: string[];
}

// Rate limiting types
export interface RateLimitState {
  attempts: number;
  lastAttempt: number;
  lockedUntil: number | null;
}

// Constants
export const AUTH_CONSTANTS = {
  MAX_LOGIN_ATTEMPTS: 5,
  MAX_RESET_ATTEMPTS: 3,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  RESET_COOLDOWN: 60 * 60 * 1000, // 1 hour
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  WARNING_TIME: 5 * 60 * 1000, // 5 minutes
  PASSWORD_REQUIREMENTS: {
    minLength: 8,
    minScore: 3,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxLength: 128,
    commonPatterns: [
      'password',
      '123456',
      'qwerty',
      'admin',
      'welcome',
      'letmein',
      'monkey',
      'dragon',
      'baseball',
      'football',
      'shadow',
      'master',
      'hello',
      'freedom',
      'whatever',
      'trustno1',
      'sunshine',
      'princess',
      'passw0rd',
      'login'
    ]
  }
} as const;

// Session types
export interface SessionConfig {
  timeout: number;
  warningTime: number;
  extendOnActivity: boolean;
}

// Auth error types
export type AuthErrorCode = 
  | 'auth/invalid-email'
  | 'auth/user-disabled'
  | 'auth/user-not-found'
  | 'auth/wrong-password'
  | 'auth/too-many-requests'
  | 'auth/email-already-in-use'
  | 'auth/weak-password'
  | 'auth/expired-action-code'
  | 'auth/invalid-action-code'
  | 'auth/network-request-failed'
  | 'unknown'; 