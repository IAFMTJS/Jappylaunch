import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import type { AuthError } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import type { FirestoreError } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// Export types at the top level
export type FirebaseError = AuthError | FirestoreError;

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAj3ekprS0FDdSKLvC1vmfY1J1nhF8k4pE",
  authDomain: "jappylaunch.firebaseapp.com",
  projectId: "jappylaunch",
  storageBucket: "jappylaunch.firebasestorage.app",
  messagingSenderId: "833726317843",
  appId: "1:833726317843:web:9dcf49af8b5cf5843946e6"
};

// Debug log to check configuration
console.log('Starting Firebase initialization...', {
  config: {
    ...firebaseConfig,
    apiKey: firebaseConfig.apiKey ? '***' : undefined // Hide API key in logs
  },
  environment: process.env.NODE_ENV,
  timestamp: new Date().toISOString()
});

let app;
let auth;
let db;

try {
  // Initialize Firebase
  console.log('Attempting to initialize Firebase app...');
  app = initializeApp(firebaseConfig);
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
  db.enablePersistence()
    .then(() => console.log('Firestore persistence enabled successfully'))
    .catch((err) => {
      console.warn('Firestore persistence setup warning:', {
        code: err.code,
        message: err.message,
        name: err.name
      });
      if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
      } else if (err.code === 'unimplemented') {
        console.warn('The current browser does not support persistence.');
      } else {
        console.error('Error enabling persistence:', err);
      }
    });

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

} catch (error) {
  console.error('Critical error during Firebase initialization:', {
    error,
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString()
  });
  throw error;
}

export const isFirebaseError = (error: unknown): error is FirebaseError => {
  return error instanceof Error && (
    'code' in error && 
    typeof (error as FirebaseError).code === 'string'
  );
};

export { auth, db };
export default app; 