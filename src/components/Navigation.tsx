import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const sections = [
    // Core Features
    { path: '/section1', name: 'Hiragana & Katakana Quiz' },
    { path: '/section2', name: 'Dictionary' },
    { path: '/section3', name: 'Writing Practice' },
    { path: '/section4', name: 'Cultural Context' },
    { path: '/section5', name: 'Vocabulary Builder' },
    
    // Additional Features
    { path: '/section6', name: 'Reading Practice' },
    { path: '/section7', name: 'JLPT Preparation' },
    { path: '/section8', name: 'Interactive Games' }
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">
              JapVoc
            </Link>
            <Link
              to="/progress"
              className={`ml-4 px-4 py-2 rounded-lg hidden sm:block ${
                location.pathname === '/progress'
                  ? 'bg-blue-100 text-blue-800'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Progress
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {sections.map((section) => (
              <Link
                key={section.path}
                to={section.path}
                className={`px-4 py-2 rounded-lg ${
                  location.pathname === section.path
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {section.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/progress"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              location.pathname === '/progress'
                ? 'bg-blue-100 text-blue-800'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Progress
          </Link>
          {sections.map((section) => (
            <Link
              key={section.path}
              to={section.path}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === section.path
                  ? 'bg-blue-100 text-blue-800'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {section.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 