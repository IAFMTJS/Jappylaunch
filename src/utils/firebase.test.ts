/// <reference types="jest" />

// Mock Firebase modules before any imports
jest.mock('firebase/app', () => {
  const mockApp = { name: 'test-app' };
  const mockAuth = { auth: 'test-auth' };
  const mockDb = { db: 'test-db' };
  const mockFunctions = { functions: 'test-functions' };

  return {
    initializeApp: jest.fn(() => {
      console.log('Mock: firebase/app.initializeApp called');
      return mockApp;
    }),
    getApp: jest.fn(() => {
      console.log('Mock: firebase/app.getApp called');
      throw new Error('No Firebase App [DEFAULT] has been created');
    }),
    getAuth: jest.fn(() => {
      console.log('Mock: firebase/app.getAuth called');
      return mockAuth;
    }),
    getFirestore: jest.fn(() => {
      console.log('Mock: firebase/app.getFirestore called');
      return mockDb;
    }),
    getFunctions: jest.fn(() => {
      console.log('Mock: firebase/app.getFunctions called');
      return mockFunctions;
    })
  };
});

jest.mock('firebase/auth', () => {
  const mockAuth = {
    auth: 'test-auth',
    useDeviceLanguage: jest.fn(() => {
      console.log('Mock: firebase/auth.useDeviceLanguage called');
    }),
    settings: {
      appVerificationDisabledForTesting: false
    }
  };
  return {
    getAuth: jest.fn(() => {
      console.log('Mock: firebase/auth.getAuth called');
      return mockAuth;
    }),
    connectAuthEmulator: jest.fn(() => {
      console.log('Mock: firebase/auth.connectAuthEmulator called');
    })
  };
});

jest.mock('firebase/firestore', () => {
  const mockDb = { db: 'test-db' };
  return {
    getFirestore: jest.fn(() => {
      console.log('Mock: firebase/firestore.getFirestore called');
      return mockDb;
    }),
    connectFirestoreEmulator: jest.fn(() => {
      console.log('Mock: firebase/firestore.connectFirestoreEmulator called');
    }),
    enableIndexedDbPersistence: jest.fn(() => {
      console.log('Mock: firebase/firestore.enableIndexedDbPersistence called');
      return Promise.resolve();
    })
  };
});

jest.mock('firebase/functions', () => {
  const mockFunctions = { functions: 'test-functions' };
  return {
    getFunctions: jest.fn(() => {
      console.log('Mock: firebase/functions.getFunctions called');
      return mockFunctions;
    }),
    connectFunctionsEmulator: jest.fn(() => {
      console.log('Mock: firebase/functions.connectFunctionsEmulator called');
    })
  };
});

// Import after mocks are set up
import { initializeApp, getAuthInstance, getFirestoreInstance, getAppInstance, getInitializationStatus } from './firebase';

describe('Firebase Initialization', () => {
  const requiredEnvVars = [
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_AUTH_DOMAIN',
    'REACT_APP_FIREBASE_PROJECT_ID',
    'REACT_APP_FIREBASE_STORAGE_BUCKET',
    'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
    'REACT_APP_FIREBASE_APP_ID'
  ];

  let originalEnv: NodeJS.ProcessEnv;

  beforeAll(() => {
    console.log('Test suite: Setting up test environment');
    originalEnv = { ...process.env };
  });

  afterAll(() => {
    console.log('Test suite: Cleaning up test environment');
    process.env = originalEnv;
  });

  beforeEach(() => {
    console.log('\nTest: Setting up test case');
    // Reset environment variables
    process.env = {
      ...originalEnv,
      REACT_APP_FIREBASE_API_KEY: 'test-api-key',
      REACT_APP_FIREBASE_AUTH_DOMAIN: 'test-auth-domain',
      REACT_APP_FIREBASE_PROJECT_ID: 'test-project-id',
      REACT_APP_FIREBASE_STORAGE_BUCKET: 'test-storage-bucket',
      REACT_APP_FIREBASE_MESSAGING_SENDER_ID: 'test-sender-id',
      REACT_APP_FIREBASE_APP_ID: 'test-app-id',
      NODE_ENV: 'test',
      REACT_APP_USE_EMULATORS: 'false'
    };

    // Clear all mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    console.log('Test: Cleaning up test case');
    // Reset module state
    jest.resetModules();
  });

  test('should initialize Firebase successfully', async () => {
    console.log('Running test: should initialize Firebase successfully');
    const app = await initializeApp();
    const { getAuth, getFirestore, getFunctions } = require('firebase/app');
    
    expect(app).toBeDefined();
    expect(app.name).toBe('test-app');
    
    // Verify Firebase services were initialized
    expect(getAuth).toHaveBeenCalledWith(app);
    expect(getFirestore).toHaveBeenCalledWith(app);
    expect(getFunctions).toHaveBeenCalledWith(app);
    console.log('Test passed: should initialize Firebase successfully');
  });

  test('should return existing app instance on subsequent calls', async () => {
    const app1 = await initializeApp();
    const app2 = await initializeApp();
    
    expect(app1).toBe(app2);
    expect(app1.name).toBe('test-app');
    
    // Verify initializeApp was only called once
    const { initializeApp: firebaseInitializeApp } = require('firebase/app');
    expect(firebaseInitializeApp).toHaveBeenCalledTimes(1);
  });

  test('should get auth instance after initialization', async () => {
    const auth = await getAuthInstance();
    
    expect(auth).toBeDefined();
    expect(auth.auth).toBe('test-auth');
    expect(auth.useDeviceLanguage).toBeDefined();
    expect(auth.settings).toBeDefined();
    expect(auth.settings.appVerificationDisabledForTesting).toBe(false);
  });

  test('should get firestore instance after initialization', async () => {
    const db = await getFirestoreInstance();
    
    expect(db).toBeDefined();
    expect(db.db).toBe('test-db');
    
    // Verify persistence was enabled
    const { enableIndexedDbPersistence } = require('firebase/firestore');
    expect(enableIndexedDbPersistence).toHaveBeenCalledWith(db);
  });

  test('should get app instance after initialization', async () => {
    const app = await getAppInstance();
    
    expect(app).toBeDefined();
    expect(app.name).toBe('test-app');
    
    // Verify app was initialized
    const { initializeApp: firebaseInitializeApp } = require('firebase/app');
    expect(firebaseInitializeApp).toHaveBeenCalledTimes(1);
  });

  test('should track initialization status correctly', async () => {
    // Check initial state
    expect(getInitializationStatus().isInitialized).toBe(false);
    expect(getInitializationStatus().isInitializing).toBe(false);

    // Start initialization
    const initPromise = initializeApp();
    expect(getInitializationStatus().isInitializing).toBe(true);

    // Wait for initialization
    await initPromise;
    expect(getInitializationStatus().isInitialized).toBe(true);
    expect(getInitializationStatus().isInitializing).toBe(false);
  });

  test('should throw error when required environment variables are missing', async () => {
    console.log('Running test: should throw error when required environment variables are missing');
    // Clear all environment variables
    process.env = {};

    // Re-import the module to ensure it picks up the new environment
    await jest.isolateModules(async () => {
      const { initializeApp } = require('./firebase');
      try {
        await initializeApp();
        throw new Error('Expected initializeApp to throw but it did not');
      } catch (error: any) {
        expect(error.message.startsWith('Missing required environment variables')).toBe(true);
        console.log('Test passed: should throw error when required environment variables are missing');
      }
    });
  });

  test('should connect to emulators in development environment', async () => {
    process.env.NODE_ENV = 'development';
    process.env.REACT_APP_USE_EMULATORS = 'true';

    const { connectAuthEmulator } = require('firebase/auth');
    const { connectFirestoreEmulator } = require('firebase/firestore');
    const { connectFunctionsEmulator } = require('firebase/functions');

    await initializeApp();

    expect(connectAuthEmulator).toHaveBeenCalledWith(expect.any(Object), 'http://localhost:9099');
    expect(connectFirestoreEmulator).toHaveBeenCalledWith(expect.any(Object), 'localhost', 8080);
    expect(connectFunctionsEmulator).toHaveBeenCalledWith(expect.any(Object), 'localhost', 5001);
  });
}); 