import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';
import { QuizWord } from '../data/quizData';
import { Kanji } from '../data/kanjiData';
import { useSound } from '../context/SoundContext';

type DictionaryItem = QuizWord | Kanji;
type FilterType = 'all' | 'unmarked' | 'marked' | 'mastered';

interface DictionaryProps {
  mode: 'hiragana' | 'katakana' | 'kanji';
}

const Dictionary: React.FC<DictionaryProps> = ({ mode }) => {
  const { isDarkMode } = useTheme();
  const { progress, updateProgress } = useProgress();
  const { playSound } = useSound();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [items, setItems] = useState<DictionaryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<DictionaryItem[]>([]);
  const [sortBy, setSortBy] = useState<'japanese' | 'english' | 'progress'>('japanese');

  useEffect(() => {
    // Load dictionary items based on mode
    const loadItems = async () => {
      // This would be replaced with actual data loading
      const loadedItems: DictionaryItem[] = [];
      setItems(loadedItems);
    };
    loadItems();
  }, [mode]);

  useEffect(() => {
    // Filter and sort items
    let filtered = items.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        ('japanese' in item ? item.japanese : item.character).toLowerCase().includes(searchLower) ||
        ('english' in item ? item.english.toLowerCase().includes(searchLower) : false) ||
        ('romaji' in item ? item.romaji?.toLowerCase().includes(searchLower) : false);

      if (!matchesSearch) return false;

      const itemId = 'japanese' in item ? item.japanese : item.character;
      const itemProgress = progress[mode]?.masteredIds?.has(itemId);

      switch (filter) {
        case 'unmarked':
          return !itemProgress;
        case 'marked':
          return itemProgress;
        case 'mastered':
          return itemProgress && progress[mode]?.masteredIds?.has(itemId);
        default:
          return true;
      }
    });

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'japanese':
          return ('japanese' in a ? a.japanese : a.character)
            .localeCompare('japanese' in b ? b.japanese : b.character);
        case 'english':
          return ('english' in a ? a.english : '')
            .localeCompare('english' in b ? b.english : '');
        case 'progress':
          const aProgress = progress[mode]?.masteredIds?.has('japanese' in a ? a.japanese : a.character) ? 1 : 0;
          const bProgress = progress[mode]?.masteredIds?.has('japanese' in b ? b.japanese : b.character) ? 1 : 0;
          return bProgress - aProgress;
        default:
          return 0;
      }
    });

    setFilteredItems(filtered);
  }, [items, searchTerm, filter, sortBy, progress, mode]);

  const toggleMarked = (item: DictionaryItem) => {
    const itemId = 'japanese' in item ? item.japanese : item.character;
    const isMarked = progress[mode]?.masteredIds?.has(itemId);

    updateProgress(mode, {
      masteredIds: isMarked 
        ? new Set([...Array.from(progress[mode]?.masteredIds || []).filter(id => id !== itemId)])
        : new Set([...Array.from(progress[mode]?.masteredIds || []), itemId]),
      lastAttempt: new Date().toISOString()
    });

    playSound(isMarked ? 'incorrect' : 'correct');
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Japanese, romaji, or English..."
            className={`flex-1 min-w-[200px] px-4 py-2 rounded-lg border ${
              isDarkMode 
                ? 'bg-gray-700 text-white border-gray-600' 
                : 'bg-white text-gray-800 border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
            className={`px-4 py-2 rounded-lg border ${
              isDarkMode 
                ? 'bg-gray-700 text-white border-gray-600' 
                : 'bg-white text-gray-800 border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="all">All Items</option>
            <option value="unmarked">Unmarked</option>
            <option value="marked">Marked</option>
            <option value="mastered">Mastered</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'japanese' | 'english' | 'progress')}
            className={`px-4 py-2 rounded-lg border ${
              isDarkMode 
                ? 'bg-gray-700 text-white border-gray-600' 
                : 'bg-white text-gray-800 border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="japanese">Sort by Japanese</option>
            <option value="english">Sort by English</option>
            <option value="progress">Sort by Progress</option>
          </select>
        </div>

        <div className="flex gap-2 text-sm">
          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
            Total Items: {items.length}
          </span>
          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
            Marked: {items.filter(item => 
              progress[mode]?.masteredIds?.has('japanese' in item ? item.japanese : item.character)
            ).length}
          </span>
          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
            Mastered: {items.filter(item => 
              progress[mode]?.masteredIds?.has('japanese' in item ? item.japanese : item.character)
            ).length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item, index) => {
          const itemId = 'japanese' in item ? item.japanese : item.character;
          const isMarked = progress[mode]?.masteredIds?.has(itemId);

          return (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              } shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className={`text-xl font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    {'japanese' in item ? item.japanese : item.character}
                  </h3>
                  {'romaji' in item && item.romaji && (
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {item.romaji}
                    </p>
                  )}
                  {'english' in item && (
                    <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {item.english}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => toggleMarked(item)}
                  className={`p-2 rounded-full ${
                    isMarked
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-gray-200 hover:bg-gray-300'
                  } transition-colors`}
                  title={isMarked ? 'Mark as unlearned' : 'Mark as learned'}
                >
                  <svg
                    className={`w-5 h-5 ${isMarked ? 'text-white' : 'text-gray-600'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dictionary; 