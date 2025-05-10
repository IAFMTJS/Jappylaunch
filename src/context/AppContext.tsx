import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Progress {
  completed: number;
  total: number;
  quizStats?: {
    totalQuizzes: number;
    averageScore: number;
    bestScore: number;
    lastQuizDate: string;
    categories: {
      [category: string]: {
        attempts: number;
        averageScore: number;
        bestScore: number;
      }
    }
  }
}

interface ProgressData {
  [key: string]: Progress;
}

export interface Settings {
  showRomaji: boolean;
  showHints: boolean;
  autoPlay: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  showRomajiVocabulary: boolean;
  showRomajiReading: boolean;
  showRomajiJLPT: boolean;
  showKanjiGames: boolean;
  showRomajiGames: boolean;
  useHiraganaGames: boolean;
}

interface QuizData {
  score: number;
  date: string;
  category: string;
  difficulty: string;
  quizType: string;
  timeTaken: number;
  totalQuestions: number;
  correctAnswers: number;
}

interface AppContextType {
  progress: ProgressData;
  settings: Settings;
  updateProgress: (section: string, completed: number, total: number, quizData?: QuizData) => void;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const defaultProgress: ProgressData = {
  section1: { 
    completed: 0, 
    total: 0,
    quizStats: {
      totalQuizzes: 0,
      averageScore: 0,
      bestScore: 0,
      lastQuizDate: '',
      categories: {}
    }
  },
  section2: { completed: 0, total: 0 },
  section3: { completed: 0, total: 0 },
  section4: { completed: 0, total: 0 },
  section5: { completed: 0, total: 0 },
  section6: { completed: 0, total: 0 },
  section7: { completed: 0, total: 0 },
  section8: { completed: 0, total: 0 }
};

export const defaultSettings: Settings = {
  showRomaji: true,
  showHints: true,
  autoPlay: false,
  difficulty: 'medium',
  showRomajiVocabulary: true,
  showRomajiReading: true,
  showRomajiJLPT: true,
  showKanjiGames: true,
  showRomajiGames: true,
  useHiraganaGames: true
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [progress, setProgress] = useState<ProgressData>(() => {
    const savedProgress = localStorage.getItem('appProgress');
    return savedProgress ? JSON.parse(savedProgress) : defaultProgress;
  });

  const [settings, setSettings] = useState<Settings>(() => {
    const savedSettings = localStorage.getItem('appSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  const updateProgress = (
    section: string,
    completed: number,
    total: number,
    quizData?: QuizData
  ) => {
    setProgress(prev => {
      const sectionProgress = prev[section] || { 
        completed: 0, 
        total: 0, 
        quizStats: defaultProgress.section1.quizStats 
      };

      const newProgress = {
        ...prev,
        [section]: {
          ...sectionProgress,
          completed,
          total,
          quizStats: quizData ? {
            totalQuizzes: (sectionProgress.quizStats?.totalQuizzes || 0) + 1,
            averageScore: ((sectionProgress.quizStats?.averageScore || 0) * (sectionProgress.quizStats?.totalQuizzes || 0) + quizData.score) / 
                         ((sectionProgress.quizStats?.totalQuizzes || 0) + 1),
            bestScore: Math.max(sectionProgress.quizStats?.bestScore || 0, quizData.score),
            lastQuizDate: quizData.date,
            categories: {
              ...sectionProgress.quizStats?.categories,
              [quizData.category]: {
                attempts: (sectionProgress.quizStats?.categories?.[quizData.category]?.attempts || 0) + 1,
                averageScore: ((sectionProgress.quizStats?.categories?.[quizData.category]?.averageScore || 0) * 
                             (sectionProgress.quizStats?.categories?.[quizData.category]?.attempts || 0) + quizData.score) / 
                             ((sectionProgress.quizStats?.categories?.[quizData.category]?.attempts || 0) + 1),
                bestScore: Math.max(sectionProgress.quizStats?.categories?.[quizData.category]?.bestScore || 0, quizData.score)
              }
            }
          } : sectionProgress.quizStats
        }
      };

      localStorage.setItem('appProgress', JSON.stringify(newProgress));
      return newProgress;
    });
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => {
      const updatedSettings = { ...prev, ...newSettings };
      localStorage.setItem('appSettings', JSON.stringify(updatedSettings));
      return updatedSettings;
    });
  };

  const value = {
    progress,
    settings,
    updateProgress,
    updateSettings
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}; 