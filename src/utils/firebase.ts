import { initializeApp as firebaseInitializeApp, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, enableIndexedDbPersistence } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Validate required environment variables
const requiredEnvVars = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_FIREBASE_STORAGE_BUCKET',
  'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
  'REACT_APP_FIREBASE_APP_ID'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

// Private variables for initialized services
let _app: ReturnType<typeof firebaseInitializeApp> | null = null;
let _auth: ReturnType<typeof getAuth> | null = null;
let _db: ReturnType<typeof getFirestore> | null = null;

// Initialize Firebase and return the app instance
export const initializeApp = async () => {
  console.log('Firebase initializeApp called');
  
  try {
    // Try to get existing app first
    try {
      _app = getApp();
      console.log('Found existing Firebase app instance');
    } catch (e) {
      // No existing app, initialize new one
      console.log('No existing Firebase app, initializing new one');
      _app = firebaseInitializeApp(firebaseConfig);
    }

    if (!_app) {
      throw new Error('Failed to initialize Firebase app');
    }

    console.log('Firebase app initialized successfully, app instance:', _app);

    // Initialize services
    console.log('Initializing Firebase services...');
    console.log('Getting Auth instance');
    _auth = getAuth(_app);
    console.log('Firebase Auth initialized, auth instance:', _auth);
    
    console.log('Getting Firestore instance');
    _db = getFirestore(_app);
    console.log('Firestore initialized, db instance:', _db);
    
    console.log('Getting Functions instance');
    const functions = getFunctions(_app);
    console.log('Firebase Functions initialized, functions instance:', functions);

    // Enable persistence for offline support
    console.log('Attempting to enable Firestore persistence...');
    try {
      console.log('Calling enableIndexedDbPersistence');
      await enableIndexedDbPersistence(_db);
      console.log('Firestore persistence enabled successfully');
    } catch (err: unknown) {
      const code = typeof err === 'object' && err !== null && 'code' in err ? (err as any).code : undefined;
      const message = err instanceof Error ? err.message : undefined;
      const name = typeof err === 'object' && err !== null && 'name' in err ? (err as any).name : undefined;
      console.warn('Firestore persistence setup warning:', {
        code,
        message,
        name,
        error: err
      });
      if (code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
      } else if (code === 'unimplemented') {
        console.warn('The current browser does not support persistence.');
      } else {
        console.error('Error enabling persistence:', err);
      }
    }

    // Development environment setup
    if (process.env.NODE_ENV === 'development') {
      console.log('Development environment detected');
      // Connect to emulators if running locally
      if (process.env.REACT_APP_USE_EMULATORS === 'true') {
        console.log('Connecting to Firebase emulators...');
        connectAuthEmulator(_auth, 'http://localhost:9099');
        connectFirestoreEmulator(_db, 'localhost', 8080);
        connectFunctionsEmulator(functions, 'localhost', 5001);
        console.log('Connected to Firebase emulators successfully');
      }
    }

    // Security settings for auth
    console.log('Configuring Firebase Auth settings...');
    _auth.useDeviceLanguage();
    _auth.settings.appVerificationDisabledForTesting = process.env.NODE_ENV === 'development';
    console.log('Firebase Auth settings configured');

    console.log('Firebase initialization completed successfully');
    return _app;
  } catch (error) {
    console.error('Critical error during Firebase initialization:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      window: typeof window !== 'undefined' ? 'available' : 'unavailable',
      document: typeof document !== 'undefined' ? 'available' : 'unavailable'
    });
    throw error;
  }
};

// Export initialized services
export const getAuthInstance = () => {
  if (!_auth) {
    throw new Error('Firebase Auth not initialized. Call initializeApp() first.');
  }
  return _auth;
};

export const getFirestoreInstance = () => {
  if (!_db) {
    throw new Error('Firestore not initialized. Call initializeApp() first.');
  }
  return _db;
};

// Export a function to get the app instance instead of exporting it directly
export const getAppInstance = () => {
  if (!_app) {
    throw new Error('Firebase app not initialized. Call initializeApp() first.');
  }
  return _app;
}; 