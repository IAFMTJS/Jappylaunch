import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, AuthError } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, FirestoreError } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

// Enable persistence for offline support
db.enablePersistence()
  .catch((err: FirestoreError) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support persistence.');
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
  }
}

// Security settings for auth
auth.useDeviceLanguage();
auth.settings.appVerificationDisabledForTesting = process.env.NODE_ENV === 'development';

export default app; 