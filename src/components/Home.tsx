import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { theme, isDarkMode } = useTheme();

  const getThemeClasses = () => {
    if (isDarkMode) {
      return {
        container: 'bg-dark-card',
        text: 'text-dark-text',
        card: 'bg-dark-hover hover:bg-dark-border',
        button: {
          primary: 'bg-primary hover:bg-primary-dark text-white',
          secondary: 'bg-secondary hover:bg-secondary-dark text-white',
        },
      };
    }

    switch (theme) {
      case 'blue':
        return {
          container: 'bg-blue-card',
          text: 'text-blue-text',
          card: 'bg-blue-hover hover:bg-blue-border',
          button: {
            primary: 'bg-primary hover:bg-primary-dark text-white',
            secondary: 'bg-secondary hover:bg-secondary-dark text-white',
          },
        };
      case 'green':
        return {
          container: 'bg-green-card',
          text: 'text-green-text',
          card: 'bg-green-hover hover:bg-green-border',
          button: {
            primary: 'bg-primary hover:bg-primary-dark text-white',
            secondary: 'bg-secondary hover:bg-secondary-dark text-white',
          },
        };
      default:
        return {
          container: 'bg-white',
          text: 'text-gray-800',
          card: 'bg-gray-50 hover:bg-gray-100',
          button: {
            primary: 'bg-primary hover:bg-primary-dark text-white',
            secondary: 'bg-secondary hover:bg-secondary-dark text-white',
          },
        };
    }
  };

  const themeClasses = getThemeClasses();

  return (
    <div className="max-w-4xl mx-auto">
      <div className={`${themeClasses.container} rounded-lg shadow-md p-8 mb-8`}>
        <h1 className={`text-4xl font-bold mb-6 ${themeClasses.text}`}>
          Japanese Vocabulary Practice
        </h1>
        <p className={`text-xl mb-8 ${themeClasses.text}`}>
          Choose a practice mode to get started:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/word-practice"
            className={`${themeClasses.card} p-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105`}
          >
            <h2 className={`text-2xl font-bold mb-4 ${themeClasses.text}`}>
              Word Practice
            </h2>
            <p className={`mb-4 ${themeClasses.text}`}>
              Practice vocabulary words with multiple choice or writing exercises.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                Multiple Choice
              </span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                Writing
              </span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                Flashcards
              </span>
            </div>
          </Link>

          <Link
            to="/sentence-practice"
            className={`${themeClasses.card} p-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105`}
          >
            <h2 className={`text-2xl font-bold mb-4 ${themeClasses.text}`}>
              Sentence Practice
            </h2>
            <p className={`mb-4 ${themeClasses.text}`}>
              Practice grammar patterns and sentence construction.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                Translation
              </span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                Fill in the Blank
              </span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                Pattern Practice
              </span>
            </div>
          </Link>

          <Link
            to="/kanji-practice"
            className={`${themeClasses.card} p-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105`}
          >
            <h2 className={`text-2xl font-bold mb-4 ${themeClasses.text}`}>
              Kanji Practice
            </h2>
            <p className={`mb-4 ${themeClasses.text}`}>
              Learn and practice kanji characters.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                Flashcards
              </span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                Writing
              </span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                Reading
              </span>
            </div>
          </Link>

          <Link
            to="/progress"
            className={`${themeClasses.card} p-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105`}
          >
            <h2 className={`text-2xl font-bold mb-4 ${themeClasses.text}`}>
              Progress Tracking
            </h2>
            <p className={`mb-4 ${themeClasses.text}`}>
              View your learning progress and statistics.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                Statistics
              </span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                Streaks
              </span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                Achievements
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home; 