import React, { useEffect, useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProgressProvider } from './context/ProgressContext';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { SoundProvider } from './context/SoundContext';
import { initializeSecurity } from './utils/security';
import { initializeApp } from './utils/firebase';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Signup from './components/Signup';
import ResetPassword from './components/ResetPassword';
import UpdatePassword from './components/UpdatePassword';
import ProtectedRoute from './components/ProtectedRoute';
import SessionWarning from './components/SessionWarning';
import EmailVerification from './components/EmailVerification';
import GuestBanner from './components/GuestBanner';

// Lazy load route components
const Home = lazy(() => import('./pages/Home'));
const Section1 = lazy(() => import('./pages/Section1'));
const Section2 = lazy(() => import('./pages/Section2'));
const Section3 = lazy(() => import('./pages/Section3'));
const Section4 = lazy(() => import('./pages/Section4'));
const Section5 = lazy(() => import('./pages/Section5'));
const Section6 = lazy(() => import('./pages/Section6'));
const Section7 = lazy(() => import('./pages/Section7'));
const Section8 = lazy(() => import('./pages/Section8'));
const AnimeSection = lazy(() => import('./pages/AnimeSection'));
const ProgressPage = lazy(() => import('./pages/ProgressPage'));
const ProgressSection = lazy(() => import('./pages/ProgressSection'));
const SettingsPage = lazy(() => import('./pages/Settings'));
const WritingPracticePage = lazy(() => import('./pages/WritingPracticePage'));

// Loading component for Suspense fallback
const RouteLoadingFallback = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
);

const LoadingScreen = () => {
  console.log('Rendering loading screen');
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Initializing application...</p>
      </div>
    </div>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error Boundary caught an error:', {
      error,
      errorInfo,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center p-6 bg-red-50 dark:bg-red-900 rounded-lg max-w-2xl mx-4">
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Something went wrong</h2>
            <p className="text-red-500 dark:text-red-300 mb-4">{this.state.error?.message}</p>
            <pre className="text-left bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto text-sm mb-4">
              {this.state.error?.stack}
            </pre>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const App = () => {
  console.log('App component rendering');
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('App useEffect running');
    const initialize = async () => {
      try {
        setIsLoading(true);
        console.log('Starting initialization process');
        // Log environment variables (without sensitive values)
        console.log('Environment check:', {
          NODE_ENV: process.env.NODE_ENV,
          hasFirebaseConfig: {
            apiKey: !!process.env.REACT_APP_FIREBASE_API_KEY,
            authDomain: !!process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
            projectId: !!process.env.REACT_APP_FIREBASE_PROJECT_ID,
            storageBucket: !!process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: !!process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
            appId: !!process.env.REACT_APP_FIREBASE_APP_ID
          },
          timestamp: new Date().toISOString()
        });

        // Initialize Firebase first
        console.log('Calling Firebase initializeApp');
        await initializeApp();
        console.log('Firebase initialization complete');
        
        // Then initialize security measures
        console.log('Initializing security measures');
        initializeSecurity();
        console.log('Security initialization complete');
        
        console.log('All initialization complete, setting isInitialized to true');
        setIsInitialized(true);
      } catch (error) {
        console.error('Initialization failed:', {
          error,
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          timestamp: new Date().toISOString()
        });
        setInitError(error instanceof Error ? error : new Error('Unknown initialization error'));
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  if (isLoading) {
    console.log('App is loading, rendering loading screen');
    return <LoadingScreen />;
  }

  if (initError) {
    console.error('Rendering error state:', initError);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-6 bg-red-50 dark:bg-red-900 rounded-lg max-w-2xl mx-4">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Initialization Error</h2>
          <p className="text-red-500 dark:text-red-300 mb-4">{initError.message}</p>
          <pre className="text-left bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto text-sm mb-4">
            {initError.stack}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    console.log('App not initialized, rendering loading screen');
    return <LoadingScreen />;
  }

  console.log('App initialized, rendering main application');
  return (
    <Router>
      <ErrorBoundary>
        <ThemeProvider>
          <AppProvider>
            <AuthProvider>
              <SettingsProvider>
                <ProgressProvider>
                  <SoundProvider>
                    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                      <Navigation />
                      <SessionWarning />
                      <GuestBanner />
                      <main className="container mx-auto px-4 py-8">
                        <Suspense fallback={<LoadingScreen />}>
                          <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/reset-password" element={<ResetPassword />} />
                            <Route path="/update-password" element={<UpdatePassword />} />
                            <Route path="/verify-email" element={<EmailVerification />} />
                            <Route path="/section1" element={<ProtectedRoute><Section1 /></ProtectedRoute>} />
                            <Route path="/section2" element={<ProtectedRoute><Section2 /></ProtectedRoute>} />
                            <Route path="/section3" element={<ProtectedRoute><Section3 /></ProtectedRoute>} />
                            <Route path="/section4" element={<ProtectedRoute><Section4 /></ProtectedRoute>} />
                            <Route path="/section5" element={<ProtectedRoute><Section5 /></ProtectedRoute>} />
                            <Route path="/section6" element={<ProtectedRoute><Section6 /></ProtectedRoute>} />
                            <Route path="/section7" element={<ProtectedRoute><Section7 /></ProtectedRoute>} />
                            <Route path="/section8" element={<ProtectedRoute><Section8 /></ProtectedRoute>} />
                            <Route path="/anime" element={<ProtectedRoute><AnimeSection /></ProtectedRoute>} />
                            <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
                            <Route path="/progress/:sectionId" element={<ProtectedRoute><ProgressSection /></ProtectedRoute>} />
                            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                            <Route path="/writing-practice" element={<ProtectedRoute><WritingPracticePage /></ProtectedRoute>} />
                          </Routes>
                        </Suspense>
                      </main>
                    </div>
                  </SoundProvider>
                </ProgressProvider>
              </SettingsProvider>
            </AuthProvider>
          </AppProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </Router>
  );
};

export default App; 