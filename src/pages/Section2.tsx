import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Dictionary from '../components/Dictionary';
import SettingsPanel from '../components/Settings';

const Section2 = () => {
  const [dictionaryMode, setDictionaryMode] = useState<'all' | 'hiragana' | 'katakana' | 'kanji'>('all');

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link to="/" className="text-blue-600 hover:text-blue-800 mr-4">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Japanese Dictionary</h1>
        </div>
        <div className="flex gap-4">
          {(['all', 'hiragana', 'katakana', 'kanji'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setDictionaryMode(mode)}
              className={`px-4 py-2 rounded-lg ${
                dictionaryMode === mode
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 mb-8">
              Search and learn Japanese vocabulary. Filter by category and difficulty level.
            </p>
            <Dictionary mode={dictionaryMode} />
          </div>
        </div>
        <div>
          <SettingsPanel />
        </div>
      </div>
    </div>
  );
};

export default Section2; 