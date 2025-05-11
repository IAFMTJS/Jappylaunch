import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import type { AuthError } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import type { FirestoreError } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// Export types at the top level
export type FirebaseError = AuthError | FirestoreError;

// Your web app's Firebase configuration
// Replace these with your Firebase project configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Debug log to check if environment variables are loaded
console.log('Firebase Config Status:', {
  hasApiKey: !!firebaseConfig.apiKey,
  hasAuthDomain: !!firebaseConfig.authDomain,
  hasProjectId: !!firebaseConfig.projectId,
  hasStorageBucket: !!firebaseConfig.storageBucket,
  hasMessagingSenderId: !!firebaseConfig.messagingSenderId,
  hasAppId: !!firebaseConfig.appId,
  environment: process.env.NODE_ENV
});

// Validate required config
const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'];
const missingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig]);

if (missingFields.length > 0) {
  console.error('Missing required Firebase configuration:', missingFields);
  throw new Error(`Missing required Firebase configuration: ${missingFields.join(', ')}`);
}

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
    .catch((err: FirestoreError) => {
      if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
      } else if (err.code === 'unimplemented') {
        console.warn('The current browser does not support persistence.');
      } else {
        console.error('Error enabling persistence:', err);
      }
    });

  // Security rules for Firestore
  // These should be set in the Firebase Console, but here's what they should look like:
  /*
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      // User profiles
      match /users/{userId} {
        allow read: if request.auth != null && request.auth.uid == userId;
        allow write: if request.auth != null && request.auth.uid == userId;
      }
      
      // User progress
      match /progress/{userId} {
        allow read: if request.auth != null && request.auth.uid == userId;
        allow write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Public data (read-only)
      match /public/{document=**} {
        allow read: if request.auth != null;
        allow write: if false;
      }
    }
  }
  */

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