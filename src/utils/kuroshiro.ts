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

// Convert Japanese text to romaji with caching
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
    return text; // Return original text if conversion fails
  }
};

// Pre-initialize for common words
const commonWords = [
  '猫', '犬', '鳥', '魚', '本', '水', '山', '川', '空', '海',
  '花', '木', 'あめ', 'くも', 'かみ', 'みず', 'テレビ', 'ラジオ',
  'パソコン', 'カメラ', 'ピアノ', 'ギター', 'コーヒー', 'ジュース'
];

// Initialize with common words in the background
initKuroshiro().then(() => {
  Promise.all(commonWords.map(word => convertToRomaji(word)))
    .catch(error => console.error('Error pre-initializing common words:', error));
});

// Export a singleton instance
export const kuroshiroInstance = {
  convert: convertToRomaji,
  // Add method to clear cache if needed
  clearCache: () => {
    Object.keys(romajiCache).forEach(key => delete romajiCache[key]);
  }
}; 