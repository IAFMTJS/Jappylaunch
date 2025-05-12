import { initializeApp as firebaseInitializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, enableIndexedDbPersistence } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAj3ekprS0FDdSKLvC1vmfY1J1nhF8k4pE",
  authDomain: "jappylaunch.firebaseapp.com",
  projectId: "jappylaunch",
  storageBucket: "jappylaunch.firebasestorage.app",
  messagingSenderId: "833726317843",
  appId: "1:833726317843:web:9dcf49af8b5cf5843946e6"
};

let app: ReturnType<typeof firebaseInitializeApp> | null = null;
let auth: ReturnType<typeof getAuth> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;

// Initialize Firebase and return the app instance
export const initializeApp = async () => {
  if (app) {
    console.log('Firebase already initialized, returning existing app');
    return app;
  }

  try {
    // Initialize Firebase
    console.log('Starting Firebase initialization...', {
      config: {
        ...firebaseConfig,
        apiKey: firebaseConfig.apiKey ? '***' : undefined // Hide API key in logs
      },
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });

    app = firebaseInitializeApp(firebaseConfig);
    console.log('Firebase app initialized successfully');

    // Initialize services
    console.log('Initializing Firebase services...');
    auth = getAuth(app);
    console.log('Firebase Auth initialized');
    
    db = getFirestore(app);
    console.log('Firestore initialized');
    
    const functions = getFunctions(app);
    console.log('Firebase Functions initialized');

    // Enable persistence for offline support
    console.log('Attempting to enable Firestore persistence...');
    try {
      await enableIndexedDbPersistence(db);
      console.log('Firestore persistence enabled successfully');
    } catch (err: unknown) {
      const code = typeof err === 'object' && err !== null && 'code' in err ? (err as any).code : undefined;
      const message = err instanceof Error ? err.message : undefined;
      const name = typeof err === 'object' && err !== null && 'name' in err ? (err as any).name : undefined;
      console.warn('Firestore persistence setup warning:', {
        code,
        message,
        name
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
        connectAuthEmulator(auth, 'http://localhost:9099');
        connectFirestoreEmulator(db, 'localhost', 8080);
        connectFunctionsEmulator(functions, 'localhost', 5001);
        console.log('Connected to Firebase emulators successfully');
      }
    }

    // Security settings for auth
    console.log('Configuring Firebase Auth settings...');
    auth.useDeviceLanguage();
    auth.settings.appVerificationDisabledForTesting = process.env.NODE_ENV === 'development';
    console.log('Firebase Auth settings configured');

    return app;
  } catch (error) {
    console.error('Critical error during Firebase initialization:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
};

// Export initialized services
export const getAuthInstance = () => {
  if (!auth) {
    throw new Error('Firebase Auth not initialized. Call initializeApp() first.');
  }
  return auth;
};

export const getFirestoreInstance = () => {
  if (!db) {
    throw new Error('Firestore not initialized. Call initializeApp() first.');
  }
  return db;
};

export default app; 