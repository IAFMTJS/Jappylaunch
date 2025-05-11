import Kuroshiro from 'kuroshiro';
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';

// Global cache for romaji conversions
const romajiCache: Record<string, string> = {};

// Initialize kuroshiro with kuromoji analyzer
const kuroshiro = new Kuroshiro();
let initialized = false;
let initPromise: Promise<void> | null = null;

// Initialize the analyzer (lazy initialization)
const initKuroshiro = async () => {
  if (!initPromise) {
    initPromise = (async () => {
      if (!initialized) {
        await kuroshiro.init(new KuromojiAnalyzer());
        initialized = true;
      }
    })();
  }
  return initPromise;
};

// Convert multiple texts to romaji in batches
export const convertBatchToRomaji = async (texts: string[], batchSize: number = 5): Promise<Record<string, string>> => {
  // Initialize if needed
  if (!initialized) {
    await initKuroshiro();
  }

  const results: Record<string, string> = {};
  const textsToConvert = texts.filter(text => !romajiCache[text]);

  // Process in batches
  for (let i = 0; i < textsToConvert.length; i += batchSize) {
    const batch = textsToConvert.slice(i, i + batchSize);
    await Promise.all(batch.map(async (text) => {
      try {
        const romaji = await kuroshiro.convert(text, { to: 'romaji', mode: 'spaced' });
        romajiCache[text] = romaji;
        results[text] = romaji;
      } catch (error) {
        console.error('Error converting to romaji:', error);
        romajiCache[text] = text;
        results[text] = text;
      }
    }));
  }

  // Add cached results
  texts.forEach(text => {
    if (romajiCache[text]) {
      results[text] = romajiCache[text];
    }
  });

  return results;
};

// Convert single text to romaji with caching
export const convertToRomaji = async (text: string): Promise<string> => {
  // Check cache first
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
  '時間', '今日', '明日', '昨日', '年', '月', '日', '時', '分', '秒'
];

// Initialize with common words in the background
initKuroshiro().then(() => {
  convertBatchToRomaji(commonWords, 10)
    .catch(error => console.error('Error pre-initializing common words:', error));
});

// Export a singleton instance with enhanced functionality
export const kuroshiroInstance = {
  convert: convertToRomaji,
  convertBatch: convertBatchToRomaji,
  getCache: () => ({ ...romajiCache }),
  clearCache: () => {
    Object.keys(romajiCache).forEach(key => delete romajiCache[key]);
  }
}; 