import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  const { updateProgress, getProgressStatus, syncProgress } = useProgress();
  const { playSound } = useSound();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [items, setItems] = useState<DictionaryItem[]>([]);
  const [sortBy, setSortBy] = useState<'japanese' | 'english' | 'progress'>('japanese');
  const [romajiMap, setRomajiMap] = useState<Record<string, string>>({});
  const [isRomajiLoading, setIsRomajiLoading] = useState(false);
  const [romajiError, setRomajiError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Load dictionary items based on mode
  useEffect(() => {
    const loadItems = async () => {
      try {
        let loadedItems: DictionaryItem[] = [];
        
        switch (mode) {
          case 'hiragana':
            loadedItems = quizWords.filter(item =>
              /[\u3040-\u309F]/.test(item.japanese)
            );
            break;
          case 'katakana':
            loadedItems = quizWords.filter(item =>
              /[\u30A0-\u30FF]/.test(item.japanese)
            );
            break;
          case 'kanji':
            loadedItems = kanjiList;
            break;
        }
        
        setItems(loadedItems);
      } catch (error) {
        console.error('Error loading items:', error);
      }
    };
    loadItems();
  }, [mode]);

  // Memoize the getProgressStatus function
  const getItemStatus = useCallback((itemId: string) => {
    try {
      return getProgressStatus(mode, itemId);
    } catch (error) {
      console.error('Error getting item status:', error);
      return { isMarked: false, lastAttempted: null };
    }
  }, [mode, getProgressStatus]);

  // Memoize filtered and sorted items
  const filteredAndSortedItems = useMemo(() => {
    if (!items) return [];

    try {
      let filtered = items.filter(item => {
        const itemText = 'japanese' in item ? item.japanese : (item as Kanji).character;
        const searchLower = searchTerm.toLowerCase().trim();
        
        // Search in all relevant fields
        const matchesSearch = 
          !searchLower ||
          itemText.toLowerCase().includes(searchLower) ||
          item.english.toLowerCase().includes(searchLower) ||
          ('romaji' in item && item.romaji?.toLowerCase().includes(searchLower)) ||
          ('onyomi' in item && (item as Kanji).onyomi.some(reading => reading.toLowerCase().includes(searchLower))) ||
          ('kunyomi' in item && (item as Kanji).kunyomi.some(reading => reading.toLowerCase().includes(searchLower)));

        if (!matchesSearch) return false;

        const status = getItemStatus(itemText);
        
        switch (filter) {
          case 'marked':
            return status.isMarked;
          case 'unmarked':
            return !status.isMarked;
          case 'mastered':
            return status.isMarked;
          default:
            return true;
        }
      });

      return filtered.sort((a, b) => {
        const aText = 'japanese' in a ? a.japanese : (a as Kanji).character;
        const bText = 'japanese' in b ? b.japanese : (b as Kanji).character;

        switch (sortBy) {
          case 'japanese':
            return aText.localeCompare(bText, 'ja');
          case 'english':
            return a.english.localeCompare(b.english);
          case 'progress': {
            const statusA = getItemStatus(aText);
            const statusB = getItemStatus(bText);
            if (statusA.isMarked === statusB.isMarked) {
              const timeA = statusA.lastAttempted ?? 0;
              const timeB = statusB.lastAttempted ?? 0;
              return timeB - timeA;
            }
            return statusA.isMarked ? -1 : 1;
          }
          default:
            return 0;
        }
      });
    } catch (error) {
      console.error('Error filtering/sorting items:', error);
      return items;
    }
  }, [items, searchTerm, filter, sortBy, getItemStatus]);

  // Memoize stats calculation
  const stats = useMemo(() => {
    if (!items) return { total: 0, marked: 0, mastered: 0 };
    
    try {
      return items.reduce((acc, item) => {
        const itemText = 'japanese' in item ? item.japanese : (item as Kanji).character;
        const status = getItemStatus(itemText);
        return {
          total: acc.total + 1,
          marked: acc.marked + (status.isMarked ? 1 : 0),
          mastered: acc.mastered + (status.isMarked ? 1 : 0)
        };
      }, { total: 0, marked: 0, mastered: 0 });
    } catch (error) {
      console.error('Error calculating stats:', error);
      return { total: items.length, marked: 0, mastered: 0 };
    }
  }, [items, getItemStatus]);

  const toggleMarked = useCallback(async (itemId: string) => {
    try {
      const currentStatus = getItemStatus(itemId);
      await updateProgress(mode, itemId, !currentStatus.isMarked);
      playSound(!currentStatus.isMarked ? 'correct' : 'incorrect');
      
      if (isOnline) {
        await syncProgress();
      }
    } catch (error) {
      console.error('Error toggling marked status:', error);
    }
  }, [mode, updateProgress, syncProgress, isOnline, getItemStatus, playSound]);

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

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Stats section */}
      <div className="mb-6 flex flex-wrap gap-4 text-sm">
        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
          Total: {stats.total}
        </span>
        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
          Marked: {stats.marked}
        </span>
        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
          Mastered: {stats.mastered}
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
        {filteredAndSortedItems.map((item, index) => {
          const itemId = 'japanese' in item ? item.japanese : (item as Kanji).character;
          const itemText = 'japanese' in item ? item.japanese : (item as Kanji).character;
          const { isMarked } = getItemStatus(itemId);
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
                  onClick={() => toggleMarked(itemId)}
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