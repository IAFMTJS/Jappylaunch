import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';
import { QuizWord, quizWords } from '../data/quizData';
import { Kanji, kanjiList } from '../data/kanjiData';
import { useSound } from '../context/SoundContext';

type DictionaryItem = QuizWord | Kanji;
type FilterType = 'all' | 'unmarked' | 'marked' | 'mastered';

interface DictionaryProps {
  mode: 'hiragana' | 'katakana' | 'kanji';
}

const Dictionary: React.FC<DictionaryProps> = ({ mode }) => {
  const { isDarkMode } = useTheme();
  const { progress, updateProgress, setTotalItems } = useProgress();
  const { playSound } = useSound();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [items, setItems] = useState<DictionaryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<DictionaryItem[]>([]);
  const [sortBy, setSortBy] = useState<'japanese' | 'english' | 'progress'>('japanese');
  const [romajiMap, setRomajiMap] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load dictionary items based on mode
    const loadItems = async () => {
      let loadedItems: DictionaryItem[] = [];
      
      switch (mode) {
        case 'hiragana':
          loadedItems = quizWords.filter(item => 
            item.isHiragana && 
            item.japanese.match(/^[\u3040-\u309F]+$/) // Only hiragana characters
          );
          break;
        case 'katakana':
          loadedItems = quizWords.filter(item => 
            item.isKatakana && 
            item.japanese.match(/^[\u30A0-\u30FF]+$/) // Only katakana characters
          );
          break;
        case 'kanji':
          loadedItems = kanjiList;
          break;
      }
      
      setItems(loadedItems);
      setTotalItems(mode, loadedItems.length);
    };
    loadItems();
  }, [mode, setTotalItems]);

  useEffect(() => {
    // Filter and sort items
    let filtered = items.filter(item => {
      const searchLower = searchTerm.toLowerCase().trim();
      if (!searchLower) return true;

      // Search in Japanese text
      const japaneseText = 'japanese' in item ? item.japanese : item.character;
      if (japaneseText.toLowerCase().includes(searchLower)) return true;

      // Search in English text
      if ('english' in item && item.english.toLowerCase().includes(searchLower)) return true;

      // Search in romaji
      if ('romaji' in item && item.romaji?.toLowerCase().includes(searchLower)) return true;

      // Search in meanings for kanji
      if ('meanings' in item && Array.isArray(item.meanings) && 
          item.meanings.some((meaning: string) => meaning.toLowerCase().includes(searchLower))) {
        return true;
      }

      // Search in readings for kanji
      if ('readings' in item && Array.isArray(item.readings) && 
          item.readings.some((reading: string) => reading.toLowerCase().includes(searchLower))) {
        return true;
      }

      return false;
    });

    // Apply filter after search
    filtered = filtered.filter(item => {
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
          const aText = 'japanese' in a ? a.japanese : a.character;
          const bText = 'japanese' in b ? b.japanese : b.character;
          return aText.localeCompare(bText, 'ja');
        case 'english':
          const aEng = 'english' in a ? a.english : '';
          const bEng = 'english' in b ? b.english : '';
          return aEng.localeCompare(bEng);
        case 'progress':
          const aId = 'japanese' in a ? a.japanese : a.character;
          const bId = 'japanese' in b ? b.japanese : b.character;
          const aProgress = progress[mode]?.masteredIds?.has(aId) ? 1 : 0;
          const bProgress = progress[mode]?.masteredIds?.has(bId) ? 1 : 0;
          return bProgress - aProgress;
        default:
          return 0;
      }
    });

    setFilteredItems(filtered);
  }, [items, searchTerm, filter, sortBy, progress, mode]);

  // Initialize romaji conversion for all items
  useEffect(() => {
    const initializeRomaji = async () => {
      const textsToConvert = items
        .filter(item => {
          const text = 'japanese' in item ? item.japanese : item.character;
          return !romajiMap[text];
        })
        .map(item => 'japanese' in item ? item.japanese : item.character);

      if (textsToConvert.length > 0) {
        try {
          const { convertBatchToRomaji } = await import('../utils/kuroshiro');
          const newRomajiMap = await convertBatchToRomaji(textsToConvert);
          setRomajiMap(prev => ({ ...prev, ...newRomajiMap }));
        } catch (error) {
          console.error('Error initializing romaji:', error);
        }
      }
    };

    initializeRomaji();
  }, [items]);

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
      {/* Stats section */}
      <div className="mb-6 flex flex-wrap gap-4 text-sm">
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

      {/* Filters section */}
      <div className="mb-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Filters</h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Japanese, romaji, or English..."
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-700 text-white border-gray-600' 
                  : 'bg-white text-gray-800 border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <div className="w-48">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Filter by Status
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className={`w-full px-4 py-2 rounded-lg border ${
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
          </div>

          <div className="w-48">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sort by
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'japanese' | 'english' | 'progress')}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-700 text-white border-gray-600' 
                  : 'bg-white text-gray-800 border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="japanese">Japanese</option>
              <option value="english">English</option>
              <option value="progress">Progress</option>
            </select>
          </div>
        </div>
      </div>

      {/* Word list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item, index) => {
          const itemId = 'japanese' in item ? item.japanese : item.character;
          const isMarked = progress[mode]?.masteredIds?.has(itemId);
          const itemText = 'japanese' in item ? item.japanese : item.character;

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
                    {itemText}
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {romajiMap[itemText] || 'Loading...'}
                  </p>
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