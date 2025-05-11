import React, { useState } from 'react';
import WritingPractice from '../components/WritingPractice';
import { useNavigate } from 'react-router-dom';

type WritingMode = 'hiragana' | 'katakana' | 'kanji';

const WritingPracticePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<WritingMode>('hiragana');

  const handleComplete = () => {
    // You can add any completion logic here, like showing a summary or returning to the main menu
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Writing Practice</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setSelectedMode('hiragana')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedMode === 'hiragana'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Hiragana
          </button>
          <button
            onClick={() => setSelectedMode('katakana')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedMode === 'katakana'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Katakana
          </button>
          <button
            onClick={() => setSelectedMode('kanji')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedMode === 'kanji'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Kanji
          </button>
        </div>
      </div>

      <WritingPractice mode={selectedMode} onComplete={handleComplete} />
    </div>
  );
};

export default WritingPracticePage; 