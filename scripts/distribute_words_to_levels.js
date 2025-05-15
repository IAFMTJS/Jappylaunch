const fs = require('fs');
const path = require('path');

// Read the processed words
const processedWordsPath = path.join(__dirname, '../src/data/processed_words.json');
const words = JSON.parse(fs.readFileSync(processedWordsPath, 'utf8'));

// Define level distribution rules
const levelDistribution = {
  1: {
    categories: ['greeting', 'number', 'pronoun', 'question'],
    jlptLevels: ['N5'],
    maxWords: 200,
    description: "Essential Survival Japanese - Basic greetings, numbers, and everyday expressions"
  },
  2: {
    categories: ['verb', 'adjective', 'adverb', 'particle'],
    jlptLevels: ['N5', 'N4'],
    maxWords: 200,
    description: "Basic Communication - Common verbs, adjectives, and simple sentence patterns"
  },
  3: {
    categories: ['time', 'food', 'drink', 'transportation', 'shopping'],
    jlptLevels: ['N5', 'N4'],
    maxWords: 200,
    description: "Daily Life Basics - Food, shopping, transportation, and time expressions"
  },
  4: {
    categories: ['family', 'emotion', 'body', 'health', 'housing'],
    jlptLevels: ['N4', 'N3'],
    maxWords: 200,
    description: "Social Interactions - Family, relationships, and polite expressions"
  },
  5: {
    categories: ['work', 'education', 'hobby', 'travel', 'money'],
    jlptLevels: ['N3'],
    maxWords: 200,
    description: "Practical Japanese - Work, school, and common situations"
  },
  6: {
    categories: ['verb', 'adjective', 'adverb', 'conjunction'],
    jlptLevels: ['N3', 'N2'],
    maxWords: 200,
    description: "Intermediate Communication - Complex verbs, compound expressions"
  },
  7: {
    categories: ['idiom', 'proverb', 'onomatopoeia'],
    jlptLevels: ['N2'],
    maxWords: 200,
    description: "Cultural Context - Idioms, proverbs, and cultural references"
  },
  8: {
    categories: ['technology', 'business', 'academic'],
    jlptLevels: ['N2', 'N1'],
    maxWords: 200,
    description: "Advanced Topics - Business, technology, and specialized vocabulary"
  },
  9: {
    categories: ['literature', 'formal', 'advanced'],
    jlptLevels: ['N1'],
    maxWords: 200,
    description: "Academic Japanese - Formal writing, literature, and complex grammar"
  },
  10: {
    categories: ['slang', 'colloquial', 'nuanced'],
    jlptLevels: ['N1'],
    maxWords: 200,
    description: "Mastery Level - Native-level expressions and nuanced vocabulary"
  }
};

// Function to check if a word belongs in a level
function wordBelongsInLevel(word, level) {
  const rules = levelDistribution[level];
  
  // Check category
  const categoryMatch = rules.categories.includes(word.category);
  
  // Check JLPT level
  const jlptMatch = rules.jlptLevels.includes(word.level);
  
  return categoryMatch || jlptMatch;
}

// Distribute words to levels
const wordsByLevel = {};
for (let level = 1; level <= 10; level++) {
  wordsByLevel[level] = [];
}

// First pass: distribute words based on exact matches
words.forEach(word => {
  for (let level = 1; level <= 10; level++) {
    if (wordsByLevel[level].length < levelDistribution[level].maxWords && 
        wordBelongsInLevel(word, level)) {
      wordsByLevel[level].push(word);
      break;
    }
  }
});

// Second pass: fill remaining slots with appropriate words
words.forEach(word => {
  // Skip if word is already assigned
  if (Object.values(wordsByLevel).some(levelWords => 
      levelWords.some(w => w.id === word.id))) {
    return;
  }
  
  // Find the most appropriate level based on JLPT level
  const jlptToLevel = {
    'N5': 1,
    'N4': 2,
    'N3': 3,
    'N2': 4,
    'N1': 5
  };
  
  const baseLevel = jlptToLevel[word.level] || 1;
  
  // Try to place in base level or higher
  for (let level = baseLevel; level <= 10; level++) {
    if (wordsByLevel[level].length < levelDistribution[level].maxWords) {
      wordsByLevel[level].push(word);
      break;
    }
  }
});

// Update the word levels file
const wordLevelsPath = path.join(__dirname, '../src/data/wordLevels.ts');
let wordLevelsContent = fs.readFileSync(wordLevelsPath, 'utf8');

// Update the words array for each level
Object.entries(wordsByLevel).forEach(([level, words]) => {
  const wordsArray = JSON.stringify(words, null, 2)
    .split('\n')
    .map(line => '    ' + line)
    .join('\n');
  
  const regex = new RegExp(`level: ${level},[^}]*words: \\[\\]`, 'g');
  wordLevelsContent = wordLevelsContent.replace(
    regex,
    `level: ${level},\n    requiredScore: ${level === 1 ? 0 : 80},\n    description: "${levelDistribution[level].description}",\n    unlocked: ${level === 1},\n    words: [\n${wordsArray}\n    ]`
  );
});

fs.writeFileSync(wordLevelsPath, wordLevelsContent, 'utf8');

console.log('Distributed words across levels successfully.'); 