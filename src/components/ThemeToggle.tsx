import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme, isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <label htmlFor="theme-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Theme:
        </label>
        <select
          id="theme-select"
          value={theme}
          onChange={(e) => setTheme(e.target.value as 'light' | 'blue' | 'green')}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
        >
          <option value="light">Light Theme</option>
          <option value="blue">Blue Theme</option>
          <option value="green">Green Theme</option>
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <label htmlFor="dark-mode" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Dark Mode:
        </label>
        <button
          id="dark-mode"
          onClick={toggleDarkMode}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isDarkMode ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default ThemeToggle; 