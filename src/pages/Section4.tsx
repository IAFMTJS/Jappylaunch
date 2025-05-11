import React from 'react';
import { Link } from 'react-router-dom';
import KanjiQuiz from '../components/KanjiQuiz';
import SettingsPanel from '../components/Settings';

const Section4 = () => {
  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link to="/" className="text-blue-600 hover:text-blue-800 mr-4">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Kanji Quiz</h1>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 mb-8">
              Practice Kanji characters with interactive quizzes. Learn meanings, readings, and example words.
              Choose between meaning, reading, and kanji practice modes.
            </p>
            <KanjiQuiz />
          </div>
        </div>
        <div>
          <SettingsPanel />
        </div>
      </div>
    </div>
  );
};

export default Section4; 