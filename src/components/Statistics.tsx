import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';
import { ProgressItem } from '../types';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
  }[];
}

interface SectionProgress {
  totalQuestions: number;
  correctAnswers: number;
  bestStreak: number;
  lastAttempt?: number;
}

interface ProgressData {
  wordPractice: SectionProgress;
  sentencePractice: SectionProgress;
  kanji: SectionProgress;
  hiragana: SectionProgress;
  katakana: SectionProgress;
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
        stat: {
          label: 'text-gray-400',
          value: 'text-gray-100',
          highlight: 'text-blue-400'
        }
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
          stat: {
            label: 'text-blue-600',
            value: 'text-blue-900',
            highlight: 'text-blue-600'
          }
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
          stat: {
            label: 'text-green-600',
            value: 'text-green-900',
            highlight: 'text-green-600'
          }
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
          stat: {
            label: 'text-gray-600',
            value: 'text-gray-900',
            highlight: 'text-blue-600'
          }
        };
    }
  };

  const themeClasses = getThemeClasses();

  const calculateAccuracy = (section: SectionProgress): number => {
    if (!section?.totalQuestions) return 0;
    return Math.round((section.correctAnswers / section.totalQuestions) * 100);
  };

  const getProgressData = (): ProgressData => {
    const defaultSection: SectionProgress = {
      totalQuestions: 0,
      correctAnswers: 0,
      bestStreak: 0
    };

    const convertToSectionProgress = (item: ProgressItem | undefined): SectionProgress => ({
      totalQuestions: item?.totalQuestions ?? 0,
      correctAnswers: item?.correctAnswers ?? 0,
      bestStreak: item?.bestStreak ?? 0,
      lastAttempt: item?.lastAttempt
    });

    return {
      wordPractice: convertToSectionProgress(progress.wordPractice),
      sentencePractice: convertToSectionProgress(progress.sentencePractice),
      kanji: convertToSectionProgress(progress.kanji),
      hiragana: convertToSectionProgress(progress.hiragana),
      katakana: convertToSectionProgress(progress.katakana)
    };
  };

  const progressData = getProgressData();

  const getAccuracyData = (): ChartData => ({
    labels: ['Word Practice', 'Sentence Practice', 'Kanji Practice'],
    datasets: [
      {
        label: 'Accuracy (%)',
        data: [
          calculateAccuracy(progressData.wordPractice),
          calculateAccuracy(progressData.sentencePractice),
          calculateAccuracy(progressData.kanji),
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
          progressData.wordPractice.totalQuestions,
          progressData.sentencePractice.totalQuestions,
          progressData.kanji.totalQuestions,
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
          progressData.wordPractice.bestStreak,
          progressData.sentencePractice.bestStreak,
          progressData.kanji.bestStreak,
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

  const renderSectionStats = (title: string, section: SectionProgress, icon: string) => (
    <div className={`p-4 rounded-lg border ${themeClasses.border} ${themeClasses.card}`}>
      <div className="flex items-center space-x-3 mb-4">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className={`text-sm ${themeClasses.stat.label}`}>Total Questions</p>
          <p className={`text-xl font-medium ${themeClasses.stat.value}`}>
            {section.totalQuestions}
          </p>
        </div>
        <div>
          <p className={`text-sm ${themeClasses.stat.label}`}>Accuracy</p>
          <p className={`text-xl font-medium ${themeClasses.stat.value}`}>
            {calculateAccuracy(section)}%
          </p>
        </div>
        <div>
          <p className={`text-sm ${themeClasses.stat.label}`}>Best Streak</p>
          <p className={`text-xl font-medium ${themeClasses.stat.highlight}`}>
            {section.bestStreak}
          </p>
        </div>
        <div>
          <p className={`text-sm ${themeClasses.stat.label}`}>Last Practice</p>
          <p className={`text-sm ${themeClasses.stat.value}`}>
            {section.lastAttempt ? new Date(section.lastAttempt).toLocaleDateString() : 'Never'}
          </p>
        </div>
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
            progressData.wordPractice.totalQuestions + 
            progressData.sentencePractice.totalQuestions + 
            progressData.kanji.totalQuestions +
            progressData.hiragana.totalQuestions +
            progressData.katakana.totalQuestions,
            '📊'
          )}
          {renderStatCard(
            'Average Accuracy',
            `${Math.round(
              (calculateAccuracy(progressData.wordPractice) +
                calculateAccuracy(progressData.sentencePractice) +
                calculateAccuracy(progressData.kanji) +
                calculateAccuracy(progressData.hiragana) +
                calculateAccuracy(progressData.katakana)) /
                5
            )}%`,
            '🎯'
          )}
          {renderStatCard(
            'Best Overall Streak',
            Math.max(
              progressData.wordPractice.bestStreak,
              progressData.sentencePractice.bestStreak,
              progressData.kanji.bestStreak,
              progressData.hiragana.bestStreak,
              progressData.katakana.bestStreak
            ),
            '🔥'
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Section Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderSectionStats('Hiragana', progressData.hiragana, 'あ')}
            {renderSectionStats('Katakana', progressData.katakana, 'ア')}
            {renderSectionStats('Word Practice', progressData.wordPractice, '📚')}
            {renderSectionStats('Sentence Practice', progressData.sentencePractice, '📝')}
            {renderSectionStats('Kanji', progressData.kanji, '🖋️')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics; 