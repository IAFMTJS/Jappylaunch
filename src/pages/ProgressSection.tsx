import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';

const ProgressSection: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  const { progress: progressData } = useProgress();

  const getThemeClasses = () => {
    return {
      container: isDarkMode ? 'bg-gray-800' : 'bg-white',
      text: isDarkMode ? 'text-gray-100' : 'text-gray-900',
      subtext: isDarkMode ? 'text-gray-300' : 'text-gray-600',
      border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
      card: isDarkMode ? 'bg-gray-700' : 'bg-gray-50',
    };
  };
  const themeClasses = getThemeClasses();

  const formatPercent = (num: number) => `${Math.round(num * 100)}%`;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link to="/" className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline mr-4`}>
              ← Back to Home
            </Link>
            <h1 className={`text-3xl font-bold ${themeClasses.text}`}>Progress</h1>
          </div>
        </div>
        <div className={`rounded-lg shadow-md p-6 ${themeClasses.container}`}>
          <h2 className={`text-xl font-semibold mb-6 ${themeClasses.text}`}>Your Progress</h2>
          <div className="space-y-6">
            {progressData && Object.entries(progressData).length > 0 ? (
              Object.entries(progressData).map(([section, stats]) => {
                if (!stats || typeof stats !== 'object') return null;
                const percent = stats.totalItems > 0 ? stats.masteredIds.length / stats.totalItems : 0;
                return (
                  <div key={section} className="border-b pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium ${themeClasses.text}`}>{section.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                      <span className={`text-xs ${themeClasses.subtext}`}>Last Attempt: {stats.lastAttempt ? new Date(stats.lastAttempt).toLocaleString() : 'Never'}</span>
                    </div>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percent * 100}%` }}
                        />
                      </div>
                      <span className={`text-sm font-semibold ${themeClasses.text}`}>{formatPercent(percent)} mastered</span>
                      <span className="text-xs text-gray-400">({stats.masteredIds?.length || 0} / {stats.totalItems || 0})</span>
                    </div>
                    <div className="flex flex-wrap gap-6 mt-2 text-sm">
                      <div>
                        <span className={`block font-semibold ${themeClasses.text}`}>Best Streak</span>
                        <span>{stats.bestStreak ?? 0}</span>
                      </div>
                      <div>
                        <span className={`block font-semibold ${themeClasses.text}`}>High Score</span>
                        <span>{stats.highScore ?? 0}</span>
                      </div>
                      <div>
                        <span className={`block font-semibold ${themeClasses.text}`}>Avg. Time</span>
                        <span>{stats.averageTime ? stats.averageTime.toFixed(2) : 0}s</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-red-600 font-semibold">No progress data available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressSection; 