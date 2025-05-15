const fs = require('fs');
const path = require('path');

// Read the processed words
const processedWords = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/processed_words.json'), 'utf8'));

// Category mapping from processed words to quiz categories
const categoryMapping = {
  // Basic Categories
  greeting: 'greeting',
  question: 'question',
  pronoun: 'pronoun',
  
  // Parts of Speech
  verb: 'verb',
  adjective: 'adjective',
  adverb: 'adverb',
  particle: 'particle',
  conjunction: 'conjunction',
  interjection: 'interjection',
  
  // Topic Categories
  food: 'food',
  drink: 'drink',
  animal: 'animals',
  animals: 'animals',
  color: 'colors',
  colors: 'colors',
  number: 'numbers',
  numbers: 'numbers',
  family: 'family',
  weather: 'weather',
  time: 'time',
  body: 'body',
  work: 'work',
  emotion: 'emotions',
  emotions: 'emotions',
  school: 'school',
  clothing: 'clothing',
  clothes: 'clothing',
  transportation: 'transportation',
  nature: 'nature',
  house: 'house',
  city: 'city',
  technology: 'technology',
  health: 'health',
  hobbies: 'hobbies',
  travel: 'travel',
  shopping: 'shopping',
  money: 'money',
  direction: 'direction',
  location: 'location',
  measurement: 'measurement',
  
  // Special Categories
  idiom: 'idiom',
  proverb: 'proverb',
  onomatopoeia: 'onomatopoeia',
  honorific: 'honorific',
  slang: 'slang',
  
  // Writing Systems
  hiragana: 'hiragana',
  katakana: 'katakana'
};

// Convert processed words to quiz format
const quizWords = processedWords.map(word => {
  // Determine if the word is hiragana or katakana
  const isHiragana = /^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+$/.test(word.kana) && !/^[\u30A0-\u30FF]+$/.test(word.kana);
  const isKatakana = /^[\u30A0-\u30FF]+$/.test(word.kana);

  // Create example sentences array if available
  const examples = [];
  if (word.example) {
    examples.push({
      japanese: word.example,
      english: word.exampleTranslation,
      romaji: word.exampleRomaji,
      notes: word.exampleNotes
    });
  }
  if (word.additionalExamples && word.additionalExamples.length > 0) {
    examples.push(...word.additionalExamples);
  }

  return {
    japanese: word.kanji || word.kana,
    english: word.english,
    category: categoryMapping[word.category] || 'all',
    difficulty: 'easy', // Default to easy for now
    hint: word.notes || '',
    romaji: word.romaji,
    isHiragana,
    isKatakana,
    examples: examples.length > 0 ? examples : undefined,
    notes: word.notes,
    jlptLevel: word.level
  };
});

// Add hiragana and katakana entries
const hiragana = [
  { japanese: 'あ', english: 'a', category: 'hiragana', difficulty: 'easy', romaji: 'a', isHiragana: true, isKatakana: false },
  { japanese: 'い', english: 'i', category: 'hiragana', difficulty: 'easy', romaji: 'i', isHiragana: true, isKatakana: false },
  { japanese: 'う', english: 'u', category: 'hiragana', difficulty: 'easy', romaji: 'u', isHiragana: true, isKatakana: false },
  { japanese: 'え', english: 'e', category: 'hiragana', difficulty: 'easy', romaji: 'e', isHiragana: true, isKatakana: false },
  { japanese: 'お', english: 'o', category: 'hiragana', difficulty: 'easy', romaji: 'o', isHiragana: true, isKatakana: false },
  // ... add all hiragana characters
];

const katakana = [
  { japanese: 'ア', english: 'a', category: 'katakana', difficulty: 'easy', romaji: 'a', isHiragana: false, isKatakana: true },
  { japanese: 'イ', english: 'i', category: 'katakana', difficulty: 'easy', romaji: 'i', isHiragana: false, isKatakana: true },
  { japanese: 'ウ', english: 'u', category: 'katakana', difficulty: 'easy', romaji: 'u', isHiragana: false, isKatakana: true },
  { japanese: 'エ', english: 'e', category: 'katakana', difficulty: 'easy', romaji: 'e', isHiragana: false, isKatakana: true },
  { japanese: 'オ', english: 'o', category: 'katakana', difficulty: 'easy', romaji: 'o', isHiragana: false, isKatakana: true },
  // ... add all katakana characters
];

// Combine all words
const allWords = [...quizWords, ...hiragana, ...katakana];

// Write to quizData.ts
const quizDataContent = `export type Category = 'food' | 'animals' | 'colors' | 'numbers' | 'family' | 'weather' | 'time' | 
  'transportation' | 'clothing' | 'body' | 'emotions' | 'school' | 'work' | 'hobbies' | 'nature' | 
  'house' | 'city' | 'technology' | 'health' | 'hiragana' | 'katakana' | 'all';

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

fs.writeFileSync(path.join(__dirname, '../src/data/quizData.ts'), quizDataContent);

console.log('Updated quiz data with new words from processed_words.json');
console.log('Total number of words in quizWords (including hiragana and katakana):', allWords.length);
const categoryCounts = {};
allWords.forEach(word => { categoryCounts[word.category] = (categoryCounts[word.category] || 0) + 1; });
console.log('Word counts per category:', categoryCounts); 