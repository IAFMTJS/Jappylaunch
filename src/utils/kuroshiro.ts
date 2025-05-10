import Kuroshiro from 'kuroshiro';
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';

// Initialize kuroshiro with kuromoji analyzer
const kuroshiro = new Kuroshiro();
let initialized = false;

// Initialize the analyzer
const initKuroshiro = async () => {
  if (!initialized) {
    await kuroshiro.init(new KuromojiAnalyzer());
    initialized = true;
  }
};

// Convert Japanese text to romaji
export const convertToRomaji = async (text: string): Promise<string> => {
  if (!initialized) {
    await initKuroshiro();
  }
  try {
    return await kuroshiro.convert(text, { to: 'romaji', mode: 'spaced' });
  } catch (error) {
    console.error('Error converting to romaji:', error);
    return text; // Return original text if conversion fails
  }
};

// Export a singleton instance
export const kuroshiroInstance = {
  convert: convertToRomaji
}; 