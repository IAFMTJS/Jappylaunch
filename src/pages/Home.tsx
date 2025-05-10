import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import Progress from '../components/Progress';

const Home: React.FC = () => {
  const { theme, isDarkMode } = useTheme();

  const getThemeClasses = () => {
    if (isDarkMode) {
      return {
        container: 'bg-gray-800',
        text: 'text-gray-100',
        card: 'bg-gray-700',
        border: 'border-gray-600',
        button: {
          primary: 'bg-blue-600 hover:bg-blue-700 text-white',
          secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
        },
      };
    }

    switch (theme) {
      case 'blue':
        return {
          container: 'bg-blue-50',
          text: 'text-blue-900',
          card: 'bg-white',
          border: 'border-blue-200',
          button: {
            primary: 'bg-blue-600 hover:bg-blue-700 text-white',
            secondary: 'bg-blue-100 hover:bg-blue-200 text-blue-900',
          },
        };
      case 'green':
        return {
          container: 'bg-green-50',
          text: 'text-green-900',
          card: 'bg-white',
          border: 'border-green-200',
          button: {
            primary: 'bg-green-600 hover:bg-green-700 text-white',
            secondary: 'bg-green-100 hover:bg-green-200 text-green-900',
          },
        };
      default:
        return {
          container: 'bg-white',
          text: 'text-gray-900',
          card: 'bg-gray-50',
          border: 'border-gray-200',
          button: {
            primary: 'bg-blue-600 hover:bg-blue-700 text-white',
            secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
          },
        };
    }
  };

  const themeClasses = getThemeClasses();

  const sections = [
    { id: 'section1', name: 'Hiragana & Katakana Quiz', icon: '🎯', path: '/section1' },
    { id: 'section2', name: 'Dictionary', icon: '📚', path: '/section2' },
    { id: 'section3', name: 'Writing Practice', icon: '✍️', path: '/section3' },
    { id: 'section4', name: 'Cultural Context', icon: '🎎', path: '/section4' },
    { id: 'section5', name: 'Vocabulary Builder', icon: '📝', path: '/section5' },
    { id: 'section6', name: 'Reading Practice', icon: '📖', path: '/section6' },
    { id: 'section7', name: 'JLPT Preparation', icon: '🎓', path: '/section7' },
    { id: 'section8', name: 'Interactive Games', icon: '🎮', path: '/section8' }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className={`text-3xl sm:text-4xl font-bold mb-4 ${themeClasses.text}`}>Welcome to JapVoc</h1>
        <p className={`text-base sm:text-lg ${themeClasses.text} opacity-75 max-w-2xl mx-auto`}>
          Your comprehensive Japanese learning companion
        </p>
      </div>

      <div className={`${themeClasses.container} rounded-lg shadow-md p-4 sm:p-6`}>
        <Progress detailed={false} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {sections.map((section) => (
          <Link
            key={section.id}
            to={section.path}
            className={`${themeClasses.card} rounded-lg shadow-md p-4 sm:p-6 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg`}
          >
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-2xl sm:text-3xl">{section.icon}</span>
              <h2 className={`text-base sm:text-lg font-semibold ${themeClasses.text}`}>{section.name}</h2>
            </div>
            <p className={`text-sm ${themeClasses.text} opacity-75`}>
              Click to start learning
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home; 