import React from 'react';
import { WritingMode, PracticeType, InputMode, DisplayMode } from '../types/writing';

interface WritingControlsProps {
  mode: WritingMode;
  practiceType: PracticeType;
  inputMode: InputMode;
  displayMode: DisplayMode;
  difficulty: 'easy' | 'medium' | 'hard';
  showStrokeGuide: boolean;
  requireTranslation: boolean;
  onModeChange: (mode: WritingMode) => void;
  onPracticeTypeChange: (type: PracticeType) => void;
  onInputModeChange: (mode: InputMode) => void;
  onDisplayModeChange: (mode: DisplayMode) => void;
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void;
  onStrokeGuideToggle: () => void;
  onTranslationToggle: () => void;
  onClear: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isDarkMode: boolean;
}

const WritingControls: React.FC<WritingControlsProps> = ({
  mode,
  practiceType,
  inputMode,
  displayMode,
  difficulty,
  showStrokeGuide,
  requireTranslation,
  onModeChange,
  onPracticeTypeChange,
  onInputModeChange,
  onDisplayModeChange,
  onDifficultyChange,
  onStrokeGuideToggle,
  onTranslationToggle,
  onClear,
  onNext,
  onSubmit,
  isDarkMode
}) => {
  const buttonClass = (isActive: boolean) => `
    px-4 py-2 rounded-lg transition-colors
    ${isActive 
      ? 'bg-blue-600 text-white' 
      : `${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'} hover:bg-gray-300`
    }
  `;

  return (
    <div className="space-y-4">
      {/* Mode Selection */}
      <div className="flex flex-wrap gap-2">
        {(['hiragana', 'katakana'] as WritingMode[]).map(m => (
          <button
            key={m}
            onClick={() => onModeChange(m)}
            className={buttonClass(mode === m)}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      {/* Practice Type */}
      <div className="flex flex-wrap gap-2">
        {(['copy', 'convert', 'translate'] as PracticeType[]).map(type => (
          <button
            key={type}
            onClick={() => onPracticeTypeChange(type)}
            className={buttonClass(practiceType === type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Input Mode */}
      <div className="flex flex-wrap gap-2">
        {(['draw', 'type'] as InputMode[]).map(m => (
          <button
            key={m}
            onClick={() => onInputModeChange(m)}
            className={buttonClass(inputMode === m)}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      {/* Display Mode */}
      <div className="flex flex-wrap gap-2">
        {(['japanese', 'romaji', 'english'] as DisplayMode[]).map(m => (
          <button
            key={m}
            onClick={() => onDisplayModeChange(m)}
            className={buttonClass(displayMode === m)}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      {/* Difficulty */}
      <div className="flex flex-wrap gap-2">
        {(['easy', 'medium', 'hard'] as const).map(d => (
          <button
            key={d}
            onClick={() => onDifficultyChange(d)}
            className={buttonClass(difficulty === d)}
          >
            {d.charAt(0).toUpperCase() + d.slice(1)}
          </button>
        ))}
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showStrokeGuide}
            onChange={onStrokeGuideToggle}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>
            Show Stroke Guide
          </span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={requireTranslation}
            onChange={onTranslationToggle}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>
            Require Translation
          </span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={onClear}
          className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'} hover:bg-gray-300`}
        >
          Clear
        </button>
        <button
          onClick={onSubmit}
          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
        >
          Submit
        </button>
        <button
          onClick={onNext}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default WritingControls; 