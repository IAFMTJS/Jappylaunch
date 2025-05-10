import React from 'react';
import { useTheme } from '../context/ThemeContext';

export type QuizMode = 'multiple-choice' | 'writing' | 'flashcards';

interface QuizModeSelectorProps {
  selectedMode: QuizMode;
  onModeSelect: (mode: QuizMode) => void;
  availableModes?: QuizMode[];
}

const QuizModeSelector: React.FC<QuizModeSelectorProps> = ({
  selectedMode,
  onModeSelect,
  availableModes = ['multiple-choice', 'writing', 'flashcards'],
}) => {
  const { theme, isDarkMode } = useTheme();

  const getThemeClasses = () => {
    if (isDarkMode) {
      return {
        container: 'bg-dark-card',
        text: 'text-dark-text',
        button: {
          active: 'bg-primary text-white',
          inactive: 'bg-dark-hover text-dark-text hover:bg-dark-border',
        },
      };
    }

    switch (theme) {
      case 'blue':
        return {
          container: 'bg-blue-card',
          text: 'text-blue-text',
          button: {
            active: 'bg-primary text-white',
            inactive: 'bg-blue-hover text-blue-text hover:bg-blue-border',
          },
        };
      case 'green':
        return {
          container: 'bg-green-card',
          text: 'text-green-text',
          button: {
            active: 'bg-primary text-white',
            inactive: 'bg-green-hover text-green-text hover:bg-green-border',
          },
        };
      default:
        return {
          container: 'bg-white',
          text: 'text-gray-800',
          button: {
            active: 'bg-primary text-white',
            inactive: 'bg-gray-50 text-gray-800 hover:bg-gray-100',
          },
        };
    }
  };

  const themeClasses = getThemeClasses();

  const getModeLabel = (mode: QuizMode): string => {
    switch (mode) {
      case 'multiple-choice':
        return 'Multiple Choice';
      case 'writing':
        return 'Writing';
      case 'flashcards':
        return 'Flashcards';
      default:
        return mode;
    }
  };

  return (
    <div className={`${themeClasses.container} p-4 rounded-lg shadow-md mb-6`}>
      <h3 className={`text-lg font-semibold mb-4 ${themeClasses.text}`}>
        Select Practice Mode:
      </h3>
      <div className="flex flex-wrap gap-2">
        {availableModes.map((mode) => (
          <button
            key={mode}
            onClick={() => onModeSelect(mode)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedMode === mode
                ? themeClasses.button.active
                : themeClasses.button.inactive
            }`}
          >
            {getModeLabel(mode)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizModeSelector; 