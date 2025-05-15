import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  WordLevel, 
  JapaneseWord, 
  UserProgress, 
  WordLevelSettings,
  LevelProgress,
  WordProgress,
  wordLevels,
  getWordsForLevel,
  calculateLevelScore,
  calculateWordMastery,
  WordMasteryStatus
} from '../data/wordLevels';

interface WordLevelContextType {
  currentLevel: number;
  unlockedLevels: number[];
  userProgress: UserProgress;
  settings: WordLevelSettings;
  getWordsForCurrentLevel: () => JapaneseWord[];
  updateWordProgress: (wordId: string, isCorrect: boolean) => void;
  unlockLevel: (level: number) => void;
  updateSettings: (newSettings: Partial<WordLevelSettings>) => void;
  getLevelProgress: (level: number) => LevelProgress | undefined;
  getWordProgress: (wordId: string) => WordProgress | undefined;
  updateQuizProgress: (level: number, score: number) => void;
  updateJLPTProgress: (level: string, score: number) => void;
  updateReadingProgress: (level: number, completed: boolean) => void;
  canAdvanceToNextLevel: (level: number) => boolean;
  getLevelRequirements: (level: number) => LevelRequirement[];
  getWordMastery: () => WordMasteryStatus;
  updateUserProgress: (progress: Partial<UserProgress>) => void;
  advanceLevel: () => void;
  canAdvanceLevel: () => boolean;
  getCurrentLevelData: () => WordLevel | null;
  getWordMasteryForLevel: (level: number) => WordMasteryStatus;
}

const WordLevelContext = createContext<WordLevelContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROGRESS: 'japanese_word_progress',
  SETTINGS: 'japanese_word_settings'
};

const initialSettings: WordLevelSettings = {
  unlockedLevels: [1],
  autoUnlock: true,
  showRomaji: true,
  showHiragana: true,
  showKanji: true
};

const initialProgress: UserProgress = {
  currentLevel: 1,
  levels: wordLevels.map(level => ({
    level: level.level,
    completed: level.level === 1,
    score: 0,
    wordsMastered: 0,
    totalWords: level.words.length,
    unlockedAt: level.level === 1 ? new Date() : undefined,
    wordMastery: {
      masteredWords: 0,
      totalWords: level.words.length,
      masteryPercentage: 0,
      meetsRequirements: false
    }
  })),
  wordProgress: {},
  quizHistory: [],
  jlptTests: [],
  readingPractice: [],
  totalScore: 0,
  lastUpdated: new Date()
};

export const WordLevelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return saved ? JSON.parse(saved) : initialProgress;
  });

  const [settings, setSettings] = useState<WordLevelSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : initialSettings;
  });

  // Save progress and settings to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(userProgress));
  }, [userProgress]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  const getWordsForCurrentLevel = () => {
    return getWordsForLevel(userProgress.currentLevel);
  };

  const updateWordProgress = (wordId: string, isCorrect: boolean) => {
    setUserProgress(prev => {
      const wordProgress = prev.wordProgress[wordId] || {
        wordId,
        correctAttempts: 0,
        incorrectAttempts: 0,
        lastPracticed: new Date(),
        mastered: false
      };

      if (isCorrect) {
        wordProgress.correctAttempts++;
        // Consider a word mastered after 5 correct attempts
        wordProgress.mastered = wordProgress.correctAttempts >= 5;
      } else {
        wordProgress.incorrectAttempts++;
        // Reset mastery if too many incorrect attempts
        if (wordProgress.incorrectAttempts >= 3) {
          wordProgress.mastered = false;
        }
      }

      wordProgress.lastPracticed = new Date();

      const newWordProgress = {
        ...prev.wordProgress,
        [wordId]: wordProgress
      };

      // Update level progress and word mastery
      const currentLevelProgress = prev.levels.find(l => l.level === prev.currentLevel);
      if (currentLevelProgress) {
        const wordMastery = calculateWordMastery(prev.currentLevel, {
          ...prev,
          wordProgress: newWordProgress
        });

        currentLevelProgress.wordsMastered = wordMastery.masteredWords;
        currentLevelProgress.wordMastery = wordMastery;
        currentLevelProgress.score = calculateLevelScore(currentLevelProgress);

        // Check if level is completed based on word mastery and requirements
        const levelData = wordLevels.find(l => l.level === prev.currentLevel);
        if (levelData && wordMastery.meetsRequirements && !currentLevelProgress.completed) {
          currentLevelProgress.completed = true;
          currentLevelProgress.completedAt = new Date();

          // Auto-unlock next level if enabled
          if (settings.autoUnlock) {
            const nextLevel = prev.currentLevel + 1;
            if (nextLevel <= wordLevels.length) {
              unlockLevel(nextLevel);
            }
          }
        }
      }

      return {
        ...prev,
        wordProgress: newWordProgress,
        lastUpdated: new Date()
      };
    });
  };

  const unlockLevel = (level: number) => {
    if (level < 1 || level > wordLevels.length) return;

    setSettings(prev => ({
      ...prev,
      unlockedLevels: [...new Set([...prev.unlockedLevels, level])]
    }));

    setUserProgress(prev => ({
      ...prev,
      levels: prev.levels.map(l => 
        l.level === level 
          ? { ...l, unlockedAt: new Date() }
          : l
      )
    }));
  };

  const updateSettings = (newSettings: Partial<WordLevelSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const getLevelProgress = (level: number) => {
    return userProgress.levels.find(l => l.level === level);
  };

  const getWordProgress = (wordId: string) => {
    return userProgress.wordProgress[wordId];
  };

  const updateQuizProgress = (level: number, score: number) => {
    setUserProgress(prev => ({
      ...prev,
      quizHistory: [
        ...prev.quizHistory,
        { level, score, date: new Date() }
      ]
    }));
  };

  const updateJLPTProgress = (level: string, score: number) => {
    setUserProgress(prev => ({
      ...prev,
      jlptTests: [
        ...prev.jlptTests,
        { level, score, date: new Date() }
      ]
    }));
  };

  const updateReadingProgress = (level: number, completed: boolean) => {
    setUserProgress(prev => ({
      ...prev,
      readingPractice: [
        ...prev.readingPractice,
        { level, completed, date: new Date() }
      ]
    }));
  };

  const canAdvanceToNextLevel = (level: number) => {
    const levelData = wordLevels.find(l => l.level === level);
    if (!levelData) return false;

    const levelProgress = getLevelProgress(level);
    if (!levelProgress) return false;

    // Get word mastery status for the level
    const wordMastery = getWordMasteryForLevel(level);
    if (!wordMastery.meetsRequirements) return false;

    // Check if all requirements are met
    const requirements = levelData.requirements;
    const allRequirementsMet = requirements.every(req => {
      let current = 0;
      switch (req.type) {
        case 'quiz':
          current = userProgress.quizHistory
            .filter(q => q.level === level && q.score >= 80)
            .length;
          break;
        case 'practice':
          current = Object.values(userProgress.wordProgress)
            .filter(wp => wp.mastered && levelData.words.some(w => w.id === wp.wordId))
            .length;
          break;
        case 'jlpt':
          current = userProgress.jlptTests
            .filter(t => t.level === levelData.jlptLevel && t.score >= 70)
            .length;
          break;
        case 'reading':
          current = userProgress.readingPractice
            .filter(r => r.level === level && r.completed)
            .length;
          break;
      }
      return current >= req.target;
    });

    return allRequirementsMet && levelProgress.score >= levelData.requiredScore;
  };

  const getLevelRequirements = (level: number) => {
    const levelData = wordLevels.find(l => l.level === level);
    if (!levelData) return [];

    console.log('Debug - userProgress:', {
      quizHistory: userProgress.quizHistory,
      wordProgress: userProgress.wordProgress,
      jlptTests: userProgress.jlptTests,
      readingPractice: userProgress.readingPractice
    });

    return levelData.requirements.map(req => {
      let current = 0;
      switch (req.type) {
        case 'quiz':
          current = (userProgress.quizHistory || [])
            .filter(q => q.level === level && q.score >= 80)
            .length;
          break;
        case 'practice':
          current = Object.values(userProgress.wordProgress || {})
            .filter(wp => wp.mastered && levelData.words.some(w => w.id === wp.wordId))
            .length;
          break;
        case 'jlpt':
          current = (userProgress.jlptTests || [])
            .filter(t => t.level === levelData.jlptLevel && t.score >= 70)
            .length;
          break;
        case 'reading':
          current = (userProgress.readingPractice || [])
            .filter(r => r.level === level && r.completed)
            .length;
          break;
      }
      return {
        ...req,
        current,
        completed: current >= req.target
      };
    });
  };

  const getWordMastery = () => {
    return calculateWordMastery(userProgress.currentLevel, userProgress);
  };

  const updateUserProgress = (progress: Partial<UserProgress>) => {
    setUserProgress(prev => ({
      ...prev,
      ...progress,
      lastUpdated: new Date()
    }));
  };

  const advanceLevel = () => {
    if (!canAdvanceLevel()) return;

    const nextLevel = userProgress.currentLevel + 1;
    const nextLevelData = wordLevels.find(l => l.level === nextLevel);
    
    if (nextLevelData) {
      const wordMastery = getWordMasteryForLevel(nextLevel);
      
      setSettings(prev => ({
        ...prev,
        unlockedLevels: [...new Set([...prev.unlockedLevels, nextLevel])]
      }));

      setUserProgress(prev => ({
        ...prev,
        currentLevel: nextLevel,
        levels: prev.levels.map(l => 
          l.level === nextLevel
            ? {
                ...l,
                completed: false,
                score: 0,
                wordsMastered: wordMastery.masteredWords,
                totalWords: wordMastery.totalWords,
                wordMastery,
                unlockedAt: new Date()
              }
            : l
        ),
        lastUpdated: new Date()
      }));
    }
  };

  const canAdvanceLevel = () => {
    const currentLevelData = getCurrentLevelData();
    if (!currentLevelData) return false;

    // Check if all requirements are met
    const allRequirementsMet = currentLevelData.requirements.every(req => req.completed);
    
    // Check word mastery requirements
    const wordMastery = getWordMastery();
    const meetsWordMastery = wordMastery.meetsRequirements;
    
    return allRequirementsMet && meetsWordMastery;
  };

  const getCurrentLevelData = () => {
    return wordLevels.find(l => l.level === userProgress.currentLevel) || null;
  };

  const getWordMasteryForLevel = (level: number): WordMasteryStatus => {
    const levelData = wordLevels.find(l => l.level === level);
    if (!levelData) {
      return {
        masteredWords: 0,
        totalWords: 0,
        masteryPercentage: 0,
        meetsRequirements: false
      };
    }

    return calculateWordMastery(level, userProgress);
  };

  const value = {
    currentLevel: userProgress.currentLevel,
    unlockedLevels: settings.unlockedLevels,
    userProgress,
    settings,
    getWordsForCurrentLevel,
    updateWordProgress,
    unlockLevel,
    updateSettings,
    getLevelProgress,
    getWordProgress,
    updateQuizProgress,
    updateJLPTProgress,
    updateReadingProgress,
    canAdvanceToNextLevel,
    getLevelRequirements,
    getWordMastery,
    updateUserProgress,
    advanceLevel,
    canAdvanceLevel,
    getCurrentLevelData,
    getWordMasteryForLevel
  };

  return (
    <WordLevelContext.Provider value={value}>
      {children}
    </WordLevelContext.Provider>
  );
};

export const useWordLevel = () => {
  const context = useContext(WordLevelContext);
  if (context === undefined) {
    throw new Error('useWordLevel must be used within a WordLevelProvider');
  }
  return context;
}; 