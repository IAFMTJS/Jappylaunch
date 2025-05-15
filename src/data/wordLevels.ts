import { allWords } from './japaneseWords';
import { JapaneseWord, ExampleSentence, WordLevel, LevelRequirement, WordProgress, LevelProgress, QuizAttempt, JLPTTest, ReadingPractice, UserProgress } from './types';

// Example of first 200 words (Level 1) - You'll need to add the rest
export const wordLevels: WordLevel[] = [
  {
    level: 1,
    requiredScore: 80,
    description: "Essential Survival Japanese - Basic greetings, numbers, and everyday expressions",
    unlocked: true,
    jlptLevel: 'N5',
    practiceCategories: ['greeting', 'number', 'pronoun', 'question'],
    requiredWordMastery: {
      minWords: 20,  // Must master at least 20 words
      masteryThreshold: 80  // Must master 80% of words
    },
    requirements: [
      {
        type: 'quiz',
        description: "Complete 3 quizzes with 80% or higher score",
        target: 3,
        current: 0,
        completed: false
      },
      {
        type: 'practice',
        description: "Master 20 basic words",
        target: 20,
        current: 0,
        completed: false
      },
      {
        type: 'reading',
        description: "Read and understand 2 basic texts",
        target: 2,
        current: 0,
        completed: false
      }
    ],
    readingMaterials: [
      {
        title: "Basic Greetings",
        difficulty: "easy",
        content: "こんにちは。\nおはようございます。\nこんばんは。\nおやすみなさい。",
        vocabulary: ["こんにちは", "おはようございます", "こんばんは", "おやすみなさい"]
      },
      {
        title: "Numbers 1-10",
        difficulty: "easy",
        content: "いち\nに\nさん\nよん\nご\nろく\nなな\nはち\nきゅう\nじゅう",
        vocabulary: ["いち", "に", "さん", "よん", "ご", "ろく", "なな", "はち", "きゅう", "じゅう"]
      }
    ],
    words: allWords.filter(word => word.level === 1)
  }
];

// Helper function to calculate word mastery
export const calculateWordMastery = (level: number, userProgress: UserProgress) => {
  const levelData = wordLevels.find(l => l.level === level);
  if (!levelData) {
    return {
      masteredWords: 0,
      totalWords: 0,
      masteryPercentage: 0,
      meetsRequirements: false
    };
  }

  const totalWords = levelData.words.length;
  const masteredWords = levelData.words.filter(word => {
    const progress = userProgress.wordProgress[word.id];
    return progress?.mastered || false;
  }).length;

  const masteryPercentage = (masteredWords / totalWords) * 100;
  const meetsRequirements = masteredWords >= levelData.requiredWordMastery.minWords &&
    masteryPercentage >= levelData.requiredWordMastery.masteryThreshold;

  return {
    masteredWords,
    totalWords,
    masteryPercentage,
    meetsRequirements
  };
};

// Helper function to get words for a specific level
export const getWordsForLevel = (level: number): JapaneseWord[] => {
  const levelData = wordLevels.find(l => l.level === level);
  return levelData?.words || [];
};

// Helper function to calculate level score
export const calculateLevelScore = (level: number, userProgress: UserProgress): number => {
  const levelData = wordLevels.find(l => l.level === level);
  if (!levelData) return 0;

  const words = getWordsForLevel(level);
  const totalWords = words.length;
  if (totalWords === 0) return 0;

  const masteredWords = words.filter(word => {
    const progress = userProgress.wordProgress[word.id];
    return progress?.mastered || false;
  }).length;

  // Calculate base score from word mastery
  const wordMasteryScore = (masteredWords / totalWords) * 100;

  // Calculate score from completed requirements
  const requirements = levelData.requirements;
  const completedRequirements = requirements.filter(req => req.completed).length;
  const requirementScore = (completedRequirements / requirements.length) * 100;

  // Combine scores (70% word mastery, 30% requirements)
  return (wordMasteryScore * 0.7) + (requirementScore * 0.3);
}; 