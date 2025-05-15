import Kuroshiro from 'kuroshiro';
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';

// Global cache for romaji conversions
const romajiCache: Record<string, string> = {};

// Initialize kuroshiro with kuromoji analyzer
const kuroshiro = new Kuroshiro();
let initialized = false;
let initPromise: Promise<void> | null = null;
let preloadedData: Record<string, string> | null = null;

// Load pre-cached romaji data
const loadPrecachedData = async (): Promise<void> => {
  try {
    console.log('[Kuroshiro] Attempting to load pre-cached romaji data...');
    // Try to load from cache first
    const cachedResponse = await caches.match('/romaji-data.json');
    if (cachedResponse) {
      console.log('[Kuroshiro] Found romaji data in cache');
      preloadedData = await cachedResponse.json();
    } else {
      console.log('[Kuroshiro] No cached data found, fetching from network');
      const response = await fetch('/romaji-data.json', {
        // Add cache control headers
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        console.warn('[Kuroshiro] Failed to load pre-cached data, will use analyzer only');
        return;
      }
      
      preloadedData = await response.json();
      console.log('[Kuroshiro] Successfully loaded romaji data from network');
    }
    
    if (!preloadedData || Object.keys(preloadedData).length === 0) {
      throw new Error('Pre-cached data is empty');
    }
    
    console.log('[Kuroshiro] Pre-cached romaji data loaded successfully with', Object.keys(preloadedData).length, 'entries');
    
    // Update the cache with preloaded data
    Object.assign(romajiCache, preloadedData);
    
    // Verify some common words are present
    const testWords = ['猫', '犬', '鳥', '魚', '本'];
    const missingWords = testWords.filter(word => !preloadedData![word]);
    if (missingWords.length > 0) {
      console.warn('[Kuroshiro] Some common words are missing from pre-cached data:', missingWords);
    }
  } catch (error) {
    console.error('[Kuroshiro] Error loading pre-cached data:', error);
    // Don't throw, but log a warning
    console.warn('[Kuroshiro] Continuing without pre-cached data');
  }
};

// Initialize the analyzer (lazy initialization)
const initKuroshiro = async () => {
  console.log('[Kuroshiro] initKuroshiro called, current state:', { 
    initialized, 
    hasInitPromise: !!initPromise,
    hasPreloadedData: !!preloadedData,
    cacheSize: Object.keys(romajiCache).length
  });
  
  if (!initPromise) {
    console.log('[Kuroshiro] Creating new initialization promise');
    initPromise = (async () => {
      if (!initialized) {
        try {
          // Always initialize the analyzer first
          console.log('[Kuroshiro] Initializing KuromojiAnalyzer...');
          const analyzer = new KuromojiAnalyzer({
            dictPath: '/dict'
          });
          await kuroshiro.init(analyzer);
          console.log('[Kuroshiro] Kuroshiro initialization successful');

          // Then try to load pre-cached data
          await loadPrecachedData();
          
          initialized = true;
        } catch (error) {
          console.error('[Kuroshiro] Initialization failed:', error);
          // Reset initialization state on failure
          initialized = false;
          initPromise = null;
          throw error;
        }
      } else {
        console.log('[Kuroshiro] Already initialized');
      }
    })();
  } else {
    console.log('[Kuroshiro] Using existing initialization promise');
  }
  
  try {
    await initPromise;
    console.log('[Kuroshiro] Initialization promise resolved successfully');
  } catch (error) {
    console.error('[Kuroshiro] Initialization promise failed:', error);
    throw error;
  }
  
  return initPromise;
};

// Convert multiple texts to romaji in batches
export const convertBatchToRomaji = async (texts: string[], batchSize: number = 20): Promise<Record<string, string>> => {
  console.log('convertBatchToRomaji called with', texts.length, 'texts');
  
  // Initialize if needed
  if (!initialized) {
    console.log('Kuroshiro not initialized, initializing...');
    await initKuroshiro();
  }

  const results: Record<string, string> = {};
  
  // First, check preloaded data
  if (preloadedData) {
    texts.forEach(text => {
      if (preloadedData![text]) {
        results[text] = preloadedData![text];
        romajiCache[text] = preloadedData![text];
      }
    });
  }

  // Then check memory cache
  const textsToConvert = texts.filter(text => !romajiCache[text]);
  console.log('Found', textsToConvert.length, 'texts that need conversion');

  if (textsToConvert.length === 0) {
    console.log('All texts found in cache');
    return results;
  }

  // Process remaining texts in batches
  for (let i = 0; i < textsToConvert.length; i += batchSize) {
    const batch = textsToConvert.slice(i, i + batchSize);
    console.log('Processing batch', i / batchSize + 1, 'of', Math.ceil(textsToConvert.length / batchSize));
    
    try {
      // Process batch in parallel with a concurrency limit
      const batchResults = await Promise.all(
        batch.map(async (text) => {
          try {
            const romaji = await kuroshiro.convert(text, { to: 'romaji', mode: 'spaced' });
            romajiCache[text] = romaji;
            return [text, romaji] as [string, string];
          } catch (error) {
            console.error('Error converting text to romaji:', text, error);
            romajiCache[text] = text;
            return [text, text] as [string, string];
          }
        })
      );

      // Update results with batch conversions
      batchResults.forEach(([text, romaji]) => {
        results[text] = romaji;
      });
    } catch (error) {
      console.error('Error processing batch:', error);
    }
  }

  // Add cached results
  texts.forEach(text => {
    if (romajiCache[text]) {
      results[text] = romajiCache[text];
    }
  });

  console.log('Batch conversion complete, returning', Object.keys(results).length, 'results');
  return results;
};

// Convert single text to romaji with caching
export const convertToRomaji = async (text: string): Promise<string> => {
  // Check preloaded data first
  if (preloadedData && preloadedData[text]) {
    romajiCache[text] = preloadedData[text];
    return preloadedData[text];
  }

  // Check memory cache
  if (romajiCache[text]) {
    return romajiCache[text];
  }

  // Initialize if needed
  if (!initialized) {
    await initKuroshiro();
  }

  try {
    const romaji = await kuroshiro.convert(text, { to: 'romaji', mode: 'spaced' });
    // Cache the result
    romajiCache[text] = romaji;
    return romaji;
  } catch (error) {
    console.error('Error converting to romaji:', error);
    romajiCache[text] = text;
    return text;
  }
};

// Pre-initialize with common words
const commonWords = [
  // Basic words
  '猫', '犬', '鳥', '魚', '本', '水', '山', '川', '空', '海',
  '花', '木', 'あめ', 'くも', 'かみ', 'みず', 'テレビ', 'ラジオ',
  'パソコン', 'カメラ', 'ピアノ', 'ギター', 'コーヒー', 'ジュース',
  // Numbers
  'いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう', 'じゅう',
  // Colors
  'あか', 'あお', 'きいろ', 'しろ', 'くろ', 'みどり', 'むらさき', 'オレンジ', 'ちゃいろ', 'ピンク',
  // Common verbs
  'する', 'なる', 'ある', 'いる', '行く', '来る', '食べる', '飲む', '見る', '聞く',
  // Common adjectives
  '大きい', '小さい', '新しい', '古い', '高い', '安い', '良い', '悪い', '難しい', '易しい',
  // Common phrases
  'こんにちは', 'さようなら', 'ありがとう', 'すみません', 'おはよう', 'おやすみ',
  // JLPT N5 common words
  '私', 'あなた', '彼', '彼女', '先生', '学生', '会社', '学校', '家', '部屋',
  '時間', '今日', '明日', '昨日', '年', '月', '日', '時', '分', '秒',
  // Additional common words
  '日本語', '英語', '中国語', '韓国語', 'フランス語', 'ドイツ語', 'スペイン語',
  '大学', '高校', '中学校', '小学校', '幼稚園',
  '電車', 'バス', 'タクシー', '自転車', '車', '飛行機', '船',
  '駅', '空港', '港', '病院', '銀行', '郵便局', 'コンビニ',
  '朝', '昼', '夜', '午前', '午後', '夕方', '夜中',
  '春', '夏', '秋', '冬', '季節', '天気', '気温',
  '家族', '父', '母', '兄', '姉', '弟', '妹', '祖父', '祖母',
  '友達', '恋人', '先生', '生徒', '医者', '看護師', '警察官',
  '食べ物', '飲み物', '料理', '果物', '野菜', '肉', '魚',
  '趣味', 'スポーツ', '音楽', '映画', '本', 'ゲーム', '旅行',
  // Common verbs (additional)
  '話す', '書く', '読む', '勉強する', '働く', '遊ぶ', '寝る', '起きる',
  // Common adjectives (additional)
  '忙しい', '暇', '楽しい', '悲しい', '面白い', 'つまらない', '暑い', '寒い',
  '暖かい', '涼しい', '甘い', '辛い', '苦い', '酸っぱい', '美味しい', 'まずい'
];

// Initialize with common words in the background with larger batch size
initKuroshiro().then(() => {
  convertBatchToRomaji(commonWords, 30)
    .catch(error => console.error('Error pre-initializing common words:', error));
});

// Export a singleton instance with enhanced functionality
export const kuroshiroInstance = {
  convert: convertToRomaji,
  convertBatch: convertBatchToRomaji,
  getCache: () => ({ ...romajiCache }),
  clearCache: () => {
    Object.keys(romajiCache).forEach(key => delete romajiCache[key]);
  },
  isInitialized: () => initialized,
  hasPreloadedData: () => !!preloadedData
}; 