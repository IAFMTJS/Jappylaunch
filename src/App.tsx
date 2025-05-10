import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProgressProvider } from './context/ProgressContext';
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
import ProgressPage from './pages/ProgressPage';

const App = () => {
  return (
    <ThemeProvider>
      <AppProvider>
        <ProgressProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
              <Navigation />
              <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="max-w-7xl mx-auto">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/progress" element={<ProgressPage />} />
                    <Route path="/section1" element={<Section1 />} />
                    <Route path="/section2" element={<Section2 />} />
                    <Route path="/section3" element={<Section3 />} />
                    <Route path="/section4" element={<Section4 />} />
                    <Route path="/section5" element={<Section5 />} />
                    <Route path="/section6" element={<Section6 />} />
                    <Route path="/section7" element={<Section7 />} />
                    <Route path="/section8" element={<Section8 />} />
                  </Routes>
                </div>
              </main>
            </div>
          </Router>
        </ProgressProvider>
      </AppProvider>
    </ThemeProvider>
  );
};

export default App; 