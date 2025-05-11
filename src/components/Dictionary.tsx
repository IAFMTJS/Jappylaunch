import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';
import { QuizWord, quizWords } from '../data/quizData';
import { Kanji, kanjiList } from '../data/kanjiData';
import { useSound } from '../context/SoundContext';
import { kuroshiroInstance } from '../utils/kuroshiro';
import { romajiCache } from '../utils/romajiCache';

type DictionaryItem = QuizWord | Kanji;
type FilterType = 'all' | 'unmarked' | 'marked' | 'mastered';

interface DictionaryProps {
  mode: 'hiragana' | 'katakana' | 'kanji';
}

const Dictionary: React.FC<DictionaryProps> = ({ mode }) => {
  const { isDarkMode } = useTheme();
  const { progress, updateProgress, getProgressStatus } = useProgress();
  const { playSound } = useSound();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [items, setItems] = useState<DictionaryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<DictionaryItem[]>([]);
  const [sortBy, setSortBy] = useState<'japanese' | 'english' | 'progress'>('japanese');
  const [romajiMap, setRomajiMap] = useState<Record<string, string>>({});
  const [isRomajiLoading, setIsRomajiLoading] = useState(false);
  const [romajiError, setRomajiError] = useState<string | null>(null);

  // Load dictionary items based on mode
  useEffect(() => {
    const loadItems = async () => {
      let loadedItems: DictionaryItem[] = [];
      
      switch (mode) {
        case 'hiragana':
          loadedItems = quizWords.filter(item =>
            /[\u3040-\u309F]/.test(item.japanese) // Contains any hiragana
          );
          break;
        case 'katakana':
          loadedItems = quizWords.filter(item =>
            /[\u30A0-\u30FF]/.test(item.japanese) // Contains any katakana
          );
          break;
        case 'kanji':
          loadedItems = kanjiList;
          break;
      }
      
      setItems(loadedItems);
    };
    loadItems();
  }, [mode]);

  // Initialize romaji conversion for all items with improved caching
  const initializeRomaji = useCallback(async (itemsToConvert: DictionaryItem[]) => {
    if (itemsToConvert.length === 0) return;

    setIsRomajiLoading(true);
    setRomajiError(null);

    try {
      console.log('Starting romaji initialization for', itemsToConvert.length, 'items');
      
      // Get all texts that need conversion
      const textsToConvert = itemsToConvert
        .map(item => 'japanese' in item ? item.japanese : item.character);

      // Try to get cached romaji first
      console.log('Fetching cached romaji...');
      const cachedRomaji = await romajiCache.getBatch(textsToConvert);
      console.log('Found', Object.keys(cachedRomaji).length, 'cached items');
      
      // Update state with cached values immediately
      if (Object.keys(cachedRomaji).length > 0) {
        console.log('Updating state with cached values');
        setRomajiMap(prev => ({ ...prev, ...cachedRomaji }));
      }

      // Find texts that weren't in cache
      const uncachedTexts = textsToConvert.filter(text => !cachedRomaji[text]);
      console.log('Found', uncachedTexts.length, 'uncached items');

      if (uncachedTexts.length === 0) {
        console.log('All items were cached, finishing initialization');
        setIsRomajiLoading(false);
        return;
      }

      // Process uncached texts in smaller batches
      const batchSize = 5;
      const newRomajiMap = { ...romajiMap, ...cachedRomaji };

      for (let i = 0; i < uncachedTexts.length; i += batchSize) {
        const batch = uncachedTexts.slice(i, i + batchSize);
        console.log('Converting batch', i / batchSize + 1, 'of', Math.ceil(uncachedTexts.length / batchSize));
        
        const batchResults = await kuroshiroInstance.convertBatch(batch);
        console.log('Batch conversion complete, caching results');
        
        // Cache the new conversions
        await romajiCache.setBatch(batchResults);
        
        // Update the map with new conversions
        Object.entries(batchResults).forEach(([text, romaji]) => {
          newRomajiMap[text] = romaji;
        });

        // Update state after each batch to show progress
        setRomajiMap(newRomajiMap);
      }

      console.log('Romaji initialization complete');
    } catch (error) {
      console.error('Error initializing romaji:', error);
      setRomajiError('Failed to load romaji. Please try refreshing the page.');
    } finally {
      setIsRomajiLoading(false);
    }
  }, [romajiMap]);

  // Preload romaji for all items when the component mounts or items change
  useEffect(() => {
    let isMounted = true;

    const preloadRomaji = async () => {
      if (items.length > 0 && isMounted) {
        console.log('Starting romaji preload for', items.length, 'items');
        await initializeRomaji(items);
      }
    };

    preloadRomaji();

    return () => {
      isMounted = false;
    };
  }, [items, initializeRomaji]);

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
      const key = `${mode}-${itemId}`;
      const itemProgress = progress[key]?.correct > 0;

      switch (filter) {
        case 'unmarked':
          return !itemProgress;
        case 'marked':
          return itemProgress;
        case 'mastered':
          return itemProgress && progress[key]?.correct > 0;
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
          const aProgress = progress[`${mode}-${aId}`]?.correct > 0 ? 1 : 0;
          const bProgress = progress[`${mode}-${bId}`]?.correct > 0 ? 1 : 0;
          return bProgress - aProgress;
        default:
          return 0;
      }
    });

    setFilteredItems(filtered);
  }, [items, searchTerm, filter, sortBy, progress, mode]);

  const toggleMarked = (item: DictionaryItem) => {
    const itemId = 'japanese' in item ? item.japanese : item.character;
    const { isMarked } = getProgressStatus(mode, itemId);

    updateProgress(mode, itemId, !isMarked)
      .then(() => {
        playSound(isMarked ? 'incorrect' : 'correct');
        console.log(isMarked ? 'Unmarked as read' : 'Marked as read');
      })
      .catch((err) => {
        console.error('Failed to update progress:', err);
      });
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Stats section */}
      <div className="mb-6 flex flex-wrap gap-4 text-sm">
        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
          Total: {items.length}
        </span>
        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
          Marked: {items.filter(item => {
            const itemId = 'japanese' in item ? item.japanese : item.character;
            return getProgressStatus(mode, itemId).isMarked;
          }).length}
        </span>
        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
          Mastered: {items.filter(item => progress[`${mode}-${'japanese' in item ? item.japanese : item.character}`]?.correct > 0).length}
        </span>
        {isRomajiLoading && (
          <span className="text-blue-500">
            Loading romaji... {Object.keys(romajiMap).length}/{items.length} cached
            {Object.keys(romajiMap).length > 0 && ` (${Math.round((Object.keys(romajiMap).length / items.length) * 100)}%)`}
          </span>
        )}
        {romajiError && (
          <span className="text-red-500">
            {romajiError}
          </span>
        )}
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
          const itemText = 'japanese' in item ? item.japanese : item.character;
          const key = `${mode}-${itemId}`;
          const isMarked = progress[key]?.correct > 0;
          const romaji = romajiMap[itemText] || (isRomajiLoading ? 'Loading...' : itemText);

          return (
            <div
              key={itemId}
              className={`p-4 rounded-lg shadow-sm transition-colors ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-700' 
                  : 'bg-white hover:bg-gray-50'
              } ${isMarked ? 'border-2 border-green-500' : 'border border-gray-200'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {itemText}
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {romaji}
                  </p>
                </div>
                <button
                  onClick={() => toggleMarked(item)}
                  className={`p-2 rounded-full ${
                    isMarked 
                      ? 'bg-green-500 text-white' 
                      : isDarkMode 
                        ? 'bg-gray-700 text-gray-300' 
                        : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {isMarked ? '✓' : '○'}
                </button>
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {'english' in item ? item.english : (item as Kanji).english}
              </div>
              {'readings' in item && (
                <div className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <div>音読み: {(item as Kanji).onyomi.join(', ')}</div>
                  <div>訓読み: {(item as Kanji).kunyomi.join(', ')}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dictionary; 