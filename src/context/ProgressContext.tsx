import React, { createContext, useContext, useState, useEffect } from 'react';

interface SectionProgress {
  totalQuestions: number;
  correctAnswers: number;
  bestStreak: number;
  lastAttempt: string;
  averageTime: number;
}

interface ProgressData {
  wordPractice: SectionProgress;
  sentencePractice: SectionProgress;
  kanji: SectionProgress;
  hiragana: SectionProgress;
  katakana: SectionProgress;
}

interface ProgressContextType {
  progress: ProgressData;
  updateProgress: (section: keyof ProgressData, data: Partial<SectionProgress>) => void;
  resetProgress: () => void;
}

const initialProgress: ProgressData = {
  wordPractice: {
    totalQuestions: 0,
    correctAnswers: 0,
    bestStreak: 0,
    lastAttempt: '',
    averageTime: 0
  },
  sentencePractice: {
    totalQuestions: 0,
    correctAnswers: 0,
    bestStreak: 0,
    lastAttempt: '',
    averageTime: 0
  },
  kanji: {
    totalQuestions: 0,
    correctAnswers: 0,
    bestStreak: 0,
    lastAttempt: '',
    averageTime: 0
  },
  hiragana: {
    totalQuestions: 0,
    correctAnswers: 0,
    bestStreak: 0,
    lastAttempt: '',
    averageTime: 0
  },
  katakana: {
    totalQuestions: 0,
    correctAnswers: 0,
    bestStreak: 0,
    lastAttempt: '',
    averageTime: 0
  }
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<ProgressData>(() => {
    const savedProgress = localStorage.getItem('progress');
    return savedProgress ? JSON.parse(savedProgress) : initialProgress;
  });

  useEffect(() => {
    localStorage.setItem('progress', JSON.stringify(progress));
  }, [progress]);

  const updateProgress = (section: keyof ProgressData, data: Partial<SectionProgress>) => {
    setProgress(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data,
        lastAttempt: new Date().toISOString()
      }
    }));
  };

  const resetProgress = () => {
    setProgress(initialProgress);
    localStorage.removeItem('progress');
  };

  return (
    <ProgressContext.Provider value={{ progress, updateProgress, resetProgress }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}; 