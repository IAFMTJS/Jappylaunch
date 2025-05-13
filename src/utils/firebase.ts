import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Constants for initialization
const INIT_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Required environment variables
const requiredEnvVars = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_FIREBASE_STORAGE_BUCKET',
  'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
  'REACT_APP_FIREBASE_APP_ID'
];

// Private variables for initialized services
let _app: any = null;
let _auth: any = null;
let _db: any = null;
let _initializing = false;
let _initializationPromise: Promise<any> | null = null;
let _retryCount = 0;
let _lastError: Error | null = null;

// Helper function to check environment variables
const checkEnvironmentVariables = () => {
  const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  }
};

// Initialize Firebase and return the app instance
export const initializeApp = async () => {
  console.log('Firebase initializeApp called');
  
  // Check environment variables first
  checkEnvironmentVariables();
  
  // If already initializing, return the existing promise
  if (_initializing) {
    console.log('Firebase initialization already in progress, returning existing promise');
    return _initializationPromise;
  }

  // If already initialized, return the app
  if (_app) {
    console.log('Firebase already initialized, returning existing app');
    return _app;
  }

  _initializing = true;
  _initializationPromise = (async () => {
    try {
      // Dynamically import Firebase modules
      const [
        { initializeApp: firebaseInitializeApp, getApp },
        { getAuth, connectAuthEmulator },
        { getFirestore, connectFirestoreEmulator, enableIndexedDbPersistence },
        { getFunctions, connectFunctionsEmulator }
      ] = await Promise.all([
        import('firebase/app'),
        import('firebase/auth'),
        import('firebase/firestore'),
        import('firebase/functions')
      ]);

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

      // Initialize services
      _auth = getAuth(_app);
      _db = getFirestore(_app);
      const functions = getFunctions(_app);

      // Enable persistence for offline support
      try {
        await enableIndexedDbPersistence(_db);
        console.log('Firestore persistence enabled successfully');
      } catch (err: any) {
        if (err.code === 'failed-precondition') {
          console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code === 'unimplemented') {
          console.warn('The current browser does not support persistence.');
        } else {
          console.error('Error enabling persistence:', err);
        }
      }

      // Development environment setup
      if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_EMULATORS === 'true') {
        connectAuthEmulator(_auth, 'http://localhost:9099');
        connectFirestoreEmulator(_db, 'localhost', 8080);
        connectFunctionsEmulator(functions, 'localhost', 5001);
        console.log('Connected to Firebase emulators');
      }

      // Configure auth settings
      _auth.useDeviceLanguage();
      _auth.settings.appVerificationDisabledForTesting = process.env.NODE_ENV === 'development';

      console.log('Firebase initialization completed successfully');
      return _app;
    } catch (error) {
      console.error('Firebase initialization failed:', error);
      throw error;
    } finally {
      _initializing = false;
    }
  })();

  return _initializationPromise;
};

// Export initialized services
export const getAuthInstance = async () => {
  if (!_auth) {
    await initializeApp();
  }
  return _auth;
};

export const getFirestoreInstance = async () => {
  if (!_db) {
    await initializeApp();
  }
  return _db;
};

export const getAppInstance = async () => {
  if (!_app) {
    await initializeApp();
  }
  return _app;
};

// Export initialization status
export const getInitializationStatus = () => ({
  isInitialized: !!_app,
  isInitializing: _initializing
}); 