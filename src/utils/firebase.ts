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
  apiKey: "AIzaSyDxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx",
  authDomain: "japvoc-app.firebaseapp.com",
  projectId: "japvoc-app",
  storageBucket: "japvoc-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Debug log to check configuration
console.log('Firebase Config Status:', {
  hasApiKey: !!firebaseConfig.apiKey,
  hasAuthDomain: !!firebaseConfig.authDomain,
  hasProjectId: !!firebaseConfig.projectId,
  hasStorageBucket: !!firebaseConfig.storageBucket,
  hasMessagingSenderId: !!firebaseConfig.messagingSenderId,
  hasAppId: !!firebaseConfig.appId,
  environment: process.env.NODE_ENV
});

let app;
let auth;
let db;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');

  // Initialize services
  auth = getAuth(app);
  db = getFirestore(app);
  const functions = getFunctions(app);

  // Enable persistence for offline support
  db.enablePersistence()
    .then(() => console.log('Firestore persistence enabled'))
    .catch((err) => {
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
    // Connect to emulators if running locally
    if (process.env.REACT_APP_USE_EMULATORS === 'true') {
      connectAuthEmulator(auth, 'http://localhost:9099');
      connectFirestoreEmulator(db, 'localhost', 8080);
      connectFunctionsEmulator(functions, 'localhost', 5001);
      console.log('Connected to Firebase emulators');
    }
  }

  // Security settings for auth
  auth.useDeviceLanguage();
  auth.settings.appVerificationDisabledForTesting = process.env.NODE_ENV === 'development';

} catch (error) {
  console.error('Error initializing Firebase:', error);
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