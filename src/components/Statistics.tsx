import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
  }[];
}

const Statistics: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  const { progress } = useProgress();

  const getThemeClasses = () => {
    if (isDarkMode) {
      return {
        container: 'bg-dark-card',
        text: 'text-dark-text',
        card: 'bg-dark-hover',
        border: 'border-dark-border',
        chart: {
          background: 'bg-dark-bg',
          text: 'text-dark-text',
          grid: 'border-dark-border',
        },
      };
    }

    switch (theme) {
      case 'blue':
        return {
          container: 'bg-blue-card',
          text: 'text-blue-text',
          card: 'bg-blue-hover',
          border: 'border-blue-border',
          chart: {
            background: 'bg-white',
            text: 'text-blue-text',
            grid: 'border-blue-border',
          },
        };
      case 'green':
        return {
          container: 'bg-green-card',
          text: 'text-green-text',
          card: 'bg-green-hover',
          border: 'border-green-border',
          chart: {
            background: 'bg-white',
            text: 'text-green-text',
            grid: 'border-green-border',
          },
        };
      default:
        return {
          container: 'bg-white',
          text: 'text-gray-800',
          card: 'bg-gray-50',
          border: 'border-gray-200',
          chart: {
            background: 'bg-white',
            text: 'text-gray-800',
            grid: 'border-gray-200',
          },
        };
    }
  };

  const themeClasses = getThemeClasses();

  const calculateAccuracy = (section: any): number => {
    if (section.totalQuestions === 0) return 0;
    return Math.round((section.correctAnswers / section.totalQuestions) * 100);
  };

  const getAccuracyData = (): ChartData => ({
    labels: ['Word Practice', 'Sentence Practice', 'Kanji Practice'],
    datasets: [
      {
        label: 'Accuracy (%)',
        data: [
          calculateAccuracy(progress.wordPractice),
          calculateAccuracy(progress.sentencePractice),
          calculateAccuracy(progress.kanji),
        ],
        backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)',
        borderColor: isDarkMode ? 'rgb(34, 197, 94)' : 'rgb(22, 163, 74)',
      },
    ],
  });

  const getQuestionsData = (): ChartData => ({
    labels: ['Word Practice', 'Sentence Practice', 'Kanji Practice'],
    datasets: [
      {
        label: 'Questions Answered',
        data: [
          progress.wordPractice.totalQuestions,
          progress.sentencePractice.totalQuestions,
          progress.kanji.totalQuestions,
        ],
        backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
        borderColor: isDarkMode ? 'rgb(59, 130, 246)' : 'rgb(37, 99, 235)',
      },
    ],
  });

  const getStreakData = (): ChartData => ({
    labels: ['Word Practice', 'Sentence Practice', 'Kanji Practice'],
    datasets: [
      {
        label: 'Best Streak',
        data: [
          progress.wordPractice.bestStreak,
          progress.sentencePractice.bestStreak,
          progress.kanji.bestStreak,
        ],
        backgroundColor: isDarkMode ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.1)',
        borderColor: isDarkMode ? 'rgb(245, 158, 11)' : 'rgb(217, 119, 6)',
      },
    ],
  });

  const renderStatCard = (title: string, value: string | number, icon: string) => (
    <div className={`p-4 rounded-lg border ${themeClasses.border} ${themeClasses.card}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className={`mb-8 ${themeClasses.container} rounded-lg shadow-md p-6`}>
        <h2 className="text-2xl font-bold mb-6">Detailed Statistics</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {renderStatCard(
            'Total Questions',
            progress.wordPractice.totalQuestions + progress.sentencePractice.totalQuestions + progress.kanji.totalQuestions,
            '📊'
          )}
          {renderStatCard(
            'Average Accuracy',
            `${Math.round(
              (calculateAccuracy(progress.wordPractice) +
                calculateAccuracy(progress.sentencePractice) +
                calculateAccuracy(progress.kanji)) /
                3
            )}%`,
            '🎯'
          )}
          {renderStatCard(
            'Best Overall Streak',
            Math.max(
              progress.wordPractice.bestStreak,
              progress.sentencePractice.bestStreak,
              progress.kanji.bestStreak
            ),
            '🔥'
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-4 rounded-lg border ${themeClasses.border} ${themeClasses.chart.background}`}>
            <h3 className="text-lg font-semibold mb-4">Accuracy by Section</h3>
            <div className="h-64">
              {/* Add chart component here */}
              <div className="flex flex-col space-y-2">
                {getAccuracyData().labels.map((label, index) => (
                  <div key={label} className="flex items-center">
                    <div className="w-32">{label}</div>
                    <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${getAccuracyData().datasets[0].data[index]}%` }}
                      />
                    </div>
                    <div className="w-16 text-right">
                      {getAccuracyData().datasets[0].data[index]}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${themeClasses.border} ${themeClasses.chart.background}`}>
            <h3 className="text-lg font-semibold mb-4">Questions Answered</h3>
            <div className="h-64">
              {/* Add chart component here */}
              <div className="flex flex-col space-y-2">
                {getQuestionsData().labels.map((label, index) => (
                  <div key={label} className="flex items-center">
                    <div className="w-32">{label}</div>
                    <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{
                          width: `${
                            (getQuestionsData().datasets[0].data[index] /
                              Math.max(...getQuestionsData().datasets[0].data)) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                    <div className="w-16 text-right">
                      {getQuestionsData().datasets[0].data[index]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics; 