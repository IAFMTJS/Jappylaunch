const fs = require('fs');
const path = require('path');

// Read the common words database
const commonWordsPath = path.join(__dirname, '../src/data/common-words.json');
const commonWords = JSON.parse(fs.readFileSync(commonWordsPath, 'utf8'));

// Read the current quiz data
const quizDataPath = path.join(__dirname, '../src/data/quizData.ts');
const quizDataContent = fs.readFileSync(quizDataPath, 'utf8');

// Category mapping from common words to quiz categories
const categoryMapping = {
  // Basic Categories
  'greeting': 'greeting',
  'question': 'question',
  'pronoun': 'pronoun',
  
  // Parts of Speech
  'verb': 'verb',
  'adjective': 'adjective',
  'adverb': 'adverb',
  'particle': 'particle',
  'conjunction': 'conjunction',
  'interjection': 'interjection',
  
  // Topic Categories
  'food': 'food',
  'drink': 'drink',
  'animal': 'animals',
  'animals': 'animals',
  'color': 'colors',
  'colors': 'colors',
  'number': 'numbers',
  'numbers': 'numbers',
  'family': 'family',
  'weather': 'weather',
  'time': 'time',
  'transportation': 'transportation',
  'clothing': 'clothing',
  'body': 'body',
  'emotion': 'emotions',
  'emotions': 'emotions',
  'school': 'school',
  'work': 'work',
  'hobby': 'hobbies',
  'hobbies': 'hobbies',
  'nature': 'nature',
  'house': 'house',
  'city': 'city',
  'technology': 'technology',
  'health': 'health',
  'travel': 'travel',
  'shopping': 'shopping',
  'money': 'money',
  'direction': 'direction',
  'location': 'location',
  'measurement': 'measurement',
  
  // Special Categories
  'idiom': 'idiom',
  'proverb': 'proverb',
  'onomatopoeia': 'onomatopoeia',
  'honorific': 'honorific',
  'slang': 'slang'
};

// Difficulty mapping based on JLPT level
const difficultyMapping = {
  'N5': 'easy',
  'N4': 'medium',
  'N3': 'medium',
  'N2': 'hard',
  'N1': 'hard'
};

// Convert common words to quiz format
const quizWords = commonWords.map(word => {
  // Determine if the word is hiragana or katakana
  const isHiragana = /^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+$/.test(word.hiragana) && !/^[\u30A0-\u30FF]+$/.test(word.hiragana);
  const isKatakana = /^[\u30A0-\u30FF]+$/.test(word.hiragana);

  // Create example sentences array
  const examples = [];
  if (word.examples && word.examples.length > 0) {
    examples.push(...word.examples.map(example => ({
      japanese: example.japanese,
      english: example.english,
      romaji: example.romaji,
      notes: example.notes
    })));
  }

  // Get the mapped category
  const category = categoryMapping[word.category] || 'all';

  // Get the difficulty based on JLPT level
  const difficulty = difficultyMapping[word.jlptLevel] || 'easy';

  return {
    japanese: word.kanji || word.hiragana,
    english: word.english,
    category,
    difficulty,
    hint: word.notes || '',
    romaji: word.romaji,
    isHiragana,
    isKatakana,
    examples: examples.length > 0 ? examples : undefined,
    notes: word.notes,
    jlptLevel: word.jlptLevel
  };
});

// Add hiragana and katakana entries
const hiragana = [
  // Basic vowels
  { japanese: 'あ', english: 'a', category: 'hiragana', difficulty: 'easy', romaji: 'a', isHiragana: true, isKatakana: false },
  { japanese: 'い', english: 'i', category: 'hiragana', difficulty: 'easy', romaji: 'i', isHiragana: true, isKatakana: false },
  { japanese: 'う', english: 'u', category: 'hiragana', difficulty: 'easy', romaji: 'u', isHiragana: true, isKatakana: false },
  { japanese: 'え', english: 'e', category: 'hiragana', difficulty: 'easy', romaji: 'e', isHiragana: true, isKatakana: false },
  { japanese: 'お', english: 'o', category: 'hiragana', difficulty: 'easy', romaji: 'o', isHiragana: true, isKatakana: false },
  
  // K-series
  { japanese: 'か', english: 'ka', category: 'hiragana', difficulty: 'easy', romaji: 'ka', isHiragana: true, isKatakana: false },
  { japanese: 'き', english: 'ki', category: 'hiragana', difficulty: 'easy', romaji: 'ki', isHiragana: true, isKatakana: false },
  { japanese: 'く', english: 'ku', category: 'hiragana', difficulty: 'easy', romaji: 'ku', isHiragana: true, isKatakana: false },
  { japanese: 'け', english: 'ke', category: 'hiragana', difficulty: 'easy', romaji: 'ke', isHiragana: true, isKatakana: false },
  { japanese: 'こ', english: 'ko', category: 'hiragana', difficulty: 'easy', romaji: 'ko', isHiragana: true, isKatakana: false },
  
  // S-series
  { japanese: 'さ', english: 'sa', category: 'hiragana', difficulty: 'easy', romaji: 'sa', isHiragana: true, isKatakana: false },
  { japanese: 'し', english: 'shi', category: 'hiragana', difficulty: 'easy', romaji: 'shi', isHiragana: true, isKatakana: false },
  { japanese: 'す', english: 'su', category: 'hiragana', difficulty: 'easy', romaji: 'su', isHiragana: true, isKatakana: false },
  { japanese: 'せ', english: 'se', category: 'hiragana', difficulty: 'easy', romaji: 'se', isHiragana: true, isKatakana: false },
  { japanese: 'そ', english: 'so', category: 'hiragana', difficulty: 'easy', romaji: 'so', isHiragana: true, isKatakana: false },
  
  // T-series
  { japanese: 'た', english: 'ta', category: 'hiragana', difficulty: 'easy', romaji: 'ta', isHiragana: true, isKatakana: false },
  { japanese: 'ち', english: 'chi', category: 'hiragana', difficulty: 'easy', romaji: 'chi', isHiragana: true, isKatakana: false },
  { japanese: 'つ', english: 'tsu', category: 'hiragana', difficulty: 'easy', romaji: 'tsu', isHiragana: true, isKatakana: false },
  { japanese: 'て', english: 'te', category: 'hiragana', difficulty: 'easy', romaji: 'te', isHiragana: true, isKatakana: false },
  { japanese: 'と', english: 'to', category: 'hiragana', difficulty: 'easy', romaji: 'to', isHiragana: true, isKatakana: false },
  
  // N-series
  { japanese: 'な', english: 'na', category: 'hiragana', difficulty: 'easy', romaji: 'na', isHiragana: true, isKatakana: false },
  { japanese: 'に', english: 'ni', category: 'hiragana', difficulty: 'easy', romaji: 'ni', isHiragana: true, isKatakana: false },
  { japanese: 'ぬ', english: 'nu', category: 'hiragana', difficulty: 'easy', romaji: 'nu', isHiragana: true, isKatakana: false },
  { japanese: 'ね', english: 'ne', category: 'hiragana', difficulty: 'easy', romaji: 'ne', isHiragana: true, isKatakana: false },
  { japanese: 'の', english: 'no', category: 'hiragana', difficulty: 'easy', romaji: 'no', isHiragana: true, isKatakana: false },
  
  // H-series
  { japanese: 'は', english: 'ha', category: 'hiragana', difficulty: 'easy', romaji: 'ha', isHiragana: true, isKatakana: false },
  { japanese: 'ひ', english: 'hi', category: 'hiragana', difficulty: 'easy', romaji: 'hi', isHiragana: true, isKatakana: false },
  { japanese: 'ふ', english: 'fu', category: 'hiragana', difficulty: 'easy', romaji: 'fu', isHiragana: true, isKatakana: false },
  { japanese: 'へ', english: 'he', category: 'hiragana', difficulty: 'easy', romaji: 'he', isHiragana: true, isKatakana: false },
  { japanese: 'ほ', english: 'ho', category: 'hiragana', difficulty: 'easy', romaji: 'ho', isHiragana: true, isKatakana: false },
  
  // M-series
  { japanese: 'ま', english: 'ma', category: 'hiragana', difficulty: 'easy', romaji: 'ma', isHiragana: true, isKatakana: false },
  { japanese: 'み', english: 'mi', category: 'hiragana', difficulty: 'easy', romaji: 'mi', isHiragana: true, isKatakana: false },
  { japanese: 'む', english: 'mu', category: 'hiragana', difficulty: 'easy', romaji: 'mu', isHiragana: true, isKatakana: false },
  { japanese: 'め', english: 'me', category: 'hiragana', difficulty: 'easy', romaji: 'me', isHiragana: true, isKatakana: false },
  { japanese: 'も', english: 'mo', category: 'hiragana', difficulty: 'easy', romaji: 'mo', isHiragana: true, isKatakana: false },
  
  // Y-series
  { japanese: 'や', english: 'ya', category: 'hiragana', difficulty: 'easy', romaji: 'ya', isHiragana: true, isKatakana: false },
  { japanese: 'ゆ', english: 'yu', category: 'hiragana', difficulty: 'easy', romaji: 'yu', isHiragana: true, isKatakana: false },
  { japanese: 'よ', english: 'yo', category: 'hiragana', difficulty: 'easy', romaji: 'yo', isHiragana: true, isKatakana: false },
  
  // R-series
  { japanese: 'ら', english: 'ra', category: 'hiragana', difficulty: 'easy', romaji: 'ra', isHiragana: true, isKatakana: false },
  { japanese: 'り', english: 'ri', category: 'hiragana', difficulty: 'easy', romaji: 'ri', isHiragana: true, isKatakana: false },
  { japanese: 'る', english: 'ru', category: 'hiragana', difficulty: 'easy', romaji: 'ru', isHiragana: true, isKatakana: false },
  { japanese: 'れ', english: 're', category: 'hiragana', difficulty: 'easy', romaji: 're', isHiragana: true, isKatakana: false },
  { japanese: 'ろ', english: 'ro', category: 'hiragana', difficulty: 'easy', romaji: 'ro', isHiragana: true, isKatakana: false },
  
  // W-series
  { japanese: 'わ', english: 'wa', category: 'hiragana', difficulty: 'easy', romaji: 'wa', isHiragana: true, isKatakana: false },
  { japanese: 'を', english: 'wo', category: 'hiragana', difficulty: 'easy', romaji: 'wo', isHiragana: true, isKatakana: false },
  
  // N
  { japanese: 'ん', english: 'n', category: 'hiragana', difficulty: 'easy', romaji: 'n', isHiragana: true, isKatakana: false }
];

const katakana = [
  // Basic vowels
  { japanese: 'ア', english: 'a', category: 'katakana', difficulty: 'easy', romaji: 'a', isHiragana: false, isKatakana: true },
  { japanese: 'イ', english: 'i', category: 'katakana', difficulty: 'easy', romaji: 'i', isHiragana: false, isKatakana: true },
  { japanese: 'ウ', english: 'u', category: 'katakana', difficulty: 'easy', romaji: 'u', isHiragana: false, isKatakana: true },
  { japanese: 'エ', english: 'e', category: 'katakana', difficulty: 'easy', romaji: 'e', isHiragana: false, isKatakana: true },
  { japanese: 'オ', english: 'o', category: 'katakana', difficulty: 'easy', romaji: 'o', isHiragana: false, isKatakana: true },
  
  // K-series
  { japanese: 'カ', english: 'ka', category: 'katakana', difficulty: 'easy', romaji: 'ka', isHiragana: false, isKatakana: true },
  { japanese: 'キ', english: 'ki', category: 'katakana', difficulty: 'easy', romaji: 'ki', isHiragana: false, isKatakana: true },
  { japanese: 'ク', english: 'ku', category: 'katakana', difficulty: 'easy', romaji: 'ku', isHiragana: false, isKatakana: true },
  { japanese: 'ケ', english: 'ke', category: 'katakana', difficulty: 'easy', romaji: 'ke', isHiragana: false, isKatakana: true },
  { japanese: 'コ', english: 'ko', category: 'katakana', difficulty: 'easy', romaji: 'ko', isHiragana: false, isKatakana: true },
  
  // S-series
  { japanese: 'サ', english: 'sa', category: 'katakana', difficulty: 'easy', romaji: 'sa', isHiragana: false, isKatakana: true },
  { japanese: 'シ', english: 'shi', category: 'katakana', difficulty: 'easy', romaji: 'shi', isHiragana: false, isKatakana: true },
  { japanese: 'ス', english: 'su', category: 'katakana', difficulty: 'easy', romaji: 'su', isHiragana: false, isKatakana: true },
  { japanese: 'セ', english: 'se', category: 'katakana', difficulty: 'easy', romaji: 'se', isHiragana: false, isKatakana: true },
  { japanese: 'ソ', english: 'so', category: 'katakana', difficulty: 'easy', romaji: 'so', isHiragana: false, isKatakana: true },
  
  // T-series
  { japanese: 'タ', english: 'ta', category: 'katakana', difficulty: 'easy', romaji: 'ta', isHiragana: false, isKatakana: true },
  { japanese: 'チ', english: 'chi', category: 'katakana', difficulty: 'easy', romaji: 'chi', isHiragana: false, isKatakana: true },
  { japanese: 'ツ', english: 'tsu', category: 'katakana', difficulty: 'easy', romaji: 'tsu', isHiragana: false, isKatakana: true },
  { japanese: 'テ', english: 'te', category: 'katakana', difficulty: 'easy', romaji: 'te', isHiragana: false, isKatakana: true },
  { japanese: 'ト', english: 'to', category: 'katakana', difficulty: 'easy', romaji: 'to', isHiragana: false, isKatakana: true },
  
  // N-series
  { japanese: 'ナ', english: 'na', category: 'katakana', difficulty: 'easy', romaji: 'na', isHiragana: false, isKatakana: true },
  { japanese: 'ニ', english: 'ni', category: 'katakana', difficulty: 'easy', romaji: 'ni', isHiragana: false, isKatakana: true },
  { japanese: 'ヌ', english: 'nu', category: 'katakana', difficulty: 'easy', romaji: 'nu', isHiragana: false, isKatakana: true },
  { japanese: 'ネ', english: 'ne', category: 'katakana', difficulty: 'easy', romaji: 'ne', isHiragana: false, isKatakana: true },
  { japanese: 'ノ', english: 'no', category: 'katakana', difficulty: 'easy', romaji: 'no', isHiragana: false, isKatakana: true },
  
  // H-series
  { japanese: 'ハ', english: 'ha', category: 'katakana', difficulty: 'easy', romaji: 'ha', isHiragana: false, isKatakana: true },
  { japanese: 'ヒ', english: 'hi', category: 'katakana', difficulty: 'easy', romaji: 'hi', isHiragana: false, isKatakana: true },
  { japanese: 'フ', english: 'fu', category: 'katakana', difficulty: 'easy', romaji: 'fu', isHiragana: false, isKatakana: true },
  { japanese: 'ヘ', english: 'he', category: 'katakana', difficulty: 'easy', romaji: 'he', isHiragana: false, isKatakana: true },
  { japanese: 'ホ', english: 'ho', category: 'katakana', difficulty: 'easy', romaji: 'ho', isHiragana: false, isKatakana: true },
  
  // M-series
  { japanese: 'マ', english: 'ma', category: 'katakana', difficulty: 'easy', romaji: 'ma', isHiragana: false, isKatakana: true },
  { japanese: 'ミ', english: 'mi', category: 'katakana', difficulty: 'easy', romaji: 'mi', isHiragana: false, isKatakana: true },
  { japanese: 'ム', english: 'mu', category: 'katakana', difficulty: 'easy', romaji: 'mu', isHiragana: false, isKatakana: true },
  { japanese: 'メ', english: 'me', category: 'katakana', difficulty: 'easy', romaji: 'me', isHiragana: false, isKatakana: true },
  { japanese: 'モ', english: 'mo', category: 'katakana', difficulty: 'easy', romaji: 'mo', isHiragana: false, isKatakana: true },
  
  // Y-series
  { japanese: 'ヤ', english: 'ya', category: 'katakana', difficulty: 'easy', romaji: 'ya', isHiragana: false, isKatakana: true },
  { japanese: 'ユ', english: 'yu', category: 'katakana', difficulty: 'easy', romaji: 'yu', isHiragana: false, isKatakana: true },
  { japanese: 'ヨ', english: 'yo', category: 'katakana', difficulty: 'easy', romaji: 'yo', isHiragana: false, isKatakana: true },
  
  // R-series
  { japanese: 'ラ', english: 'ra', category: 'katakana', difficulty: 'easy', romaji: 'ra', isHiragana: false, isKatakana: true },
  { japanese: 'リ', english: 'ri', category: 'katakana', difficulty: 'easy', romaji: 'ri', isHiragana: false, isKatakana: true },
  { japanese: 'ル', english: 'ru', category: 'katakana', difficulty: 'easy', romaji: 'ru', isHiragana: false, isKatakana: true },
  { japanese: 'レ', english: 're', category: 'katakana', difficulty: 'easy', romaji: 're', isHiragana: false, isKatakana: true },
  { japanese: 'ロ', english: 'ro', category: 'katakana', difficulty: 'easy', romaji: 'ro', isHiragana: false, isKatakana: true },
  
  // W-series
  { japanese: 'ワ', english: 'wa', category: 'katakana', difficulty: 'easy', romaji: 'wa', isHiragana: false, isKatakana: true },
  { japanese: 'ヲ', english: 'wo', category: 'katakana', difficulty: 'easy', romaji: 'wo', isHiragana: false, isKatakana: true },
  
  // N
  { japanese: 'ン', english: 'n', category: 'katakana', difficulty: 'easy', romaji: 'n', isHiragana: false, isKatakana: true }
];

// Combine all words
const allWords = [...quizWords, ...hiragana, ...katakana];

// Generate the new quiz data content
const newQuizDataContent = `export type Category = 
  // Basic Categories
  | 'greeting' | 'question' | 'pronoun'
  // Parts of Speech
  | 'verb' | 'adjective' | 'adverb' | 'particle' | 'conjunction' | 'interjection'
  // Topic Categories
  | 'food' | 'drink' | 'animals' | 'colors' | 'numbers' | 'family' | 'weather' | 'time' 
  | 'transportation' | 'clothing' | 'body' | 'emotions' | 'school' | 'work' | 'hobbies' 
  | 'nature' | 'house' | 'city' | 'technology' | 'health' | 'travel' | 'shopping' 
  | 'money' | 'direction' | 'location' | 'measurement'
  // Special Categories
  | 'idiom' | 'proverb' | 'onomatopoeia' | 'honorific' | 'slang'
  // Writing Systems
  | 'hiragana' | 'katakana'
  // All Categories
  | 'all';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface QuizWord {
  japanese: string;
  english: string;
  category: Category;
  difficulty: Difficulty;
  hint?: string;
  romaji?: string;
  isHiragana: boolean;
  isKatakana: boolean;
  examples?: Array<{
    japanese: string;
    english: string;
    romaji: string;
    notes?: string;
  }>;
  notes?: string;
  jlptLevel?: string;
}

export const quizWords: QuizWord[] = ${JSON.stringify(allWords, null, 2)};
`;

// Write the updated quiz data back to the file
fs.writeFileSync(quizDataPath, newQuizDataContent, 'utf8');

console.log('Updated quiz data with common words and example sentences.');
console.log(`Total words added: ${allWords.length}`);
console.log(`Words with examples: ${allWords.filter(word => word.examples && word.examples.length > 0).length}`); 