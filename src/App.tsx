import React, { useEffect, useState } from 'react';
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
import Home from './pages/Home';
import Section1 from './pages/Section1';
import Section2 from './pages/Section2';
import Section3 from './pages/Section3';
import Section4 from './pages/Section4';
import Section5 from './pages/Section5';
import Section6 from './pages/Section6';
import Section7 from './pages/Section7';
import Section8 from './pages/Section8';
import AnimeSection from './pages/AnimeSection';
import ProgressPage from './pages/ProgressPage';
import SettingsPage from './pages/Settings';
import WritingPracticePage from './pages/WritingPracticePage';
import Login from './components/Login';
import Signup from './components/Signup';
import ResetPassword from './components/ResetPassword';
import UpdatePassword from './components/UpdatePassword';
import ProtectedRoute from './components/ProtectedRoute';
import SessionWarning from './components/SessionWarning';
import EmailVerification from './components/EmailVerification';
import GuestBanner from './components/GuestBanner';
import ProgressSection from './pages/ProgressSection';

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

const App = () => {
  console.log('App component rendering');
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<Error | null>(null);

  useEffect(() => {
    console.log('App useEffect running');
    const initialize = async () => {
      try {
        console.log('Starting initialization process');
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
        console.error('Initialization failed:', error);
        setInitError(error instanceof Error ? error : new Error('Unknown initialization error'));
      }
    };

    initialize();
  }, []);

  if (initError) {
    console.error('Rendering error state:', initError);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-6 bg-red-50 dark:bg-red-900 rounded-lg">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Initialization Error</h2>
          <p className="text-red-500 dark:text-red-300">{initError.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
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
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <ProgressProvider>
            <SettingsProvider>
              <SoundProvider>
                <Router>
                  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
                    <GuestBanner />
                    <Navigation />
                    <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                      <div className="max-w-7xl mx-auto">
                        <EmailVerification />
                        <Routes>
                          <Route path="/login" element={<Login />} />
                          <Route path="/signup" element={<Signup />} />
                          <Route path="/reset-password" element={<ResetPassword />} />
                          <Route path="/update-password" element={<UpdatePassword />} />
                          <Route path="/" element={<Home />} />
                          <Route path="/progress" element={<ProgressPage />} />
                          <Route path="/progress-section" element={<ProgressSection />} />
                          <Route path="/settings" element={<SettingsPage />} />
                          <Route path="/section1" element={<Section1 />} />
                          <Route path="/section2" element={<Section2 />} />
                          <Route path="/section3" element={<Section3 />} />
                          <Route path="/section4" element={<Section4 />} />
                          <Route path="/section5" element={<Section5 />} />
                          <Route path="/section6" element={<Section6 />} />
                          <Route path="/section7" element={<Section7 />} />
                          <Route path="/section8" element={<Section8 />} />
                          <Route path="/anime" element={<AnimeSection />} />
                          <Route path="/writing-practice" element={<WritingPracticePage />} />
                        </Routes>
                      </div>
                    </main>
                    <SessionWarning />
                  </div>
                </Router>
              </SoundProvider>
            </SettingsProvider>
          </ProgressProvider>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App; 