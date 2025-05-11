import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../utils/firebase';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

interface SectionProgress {
  masteredIds: string[];
  totalItems: number;
  bestStreak: number;
  highScore: number;
  lastAttempt: string;
  averageTime: number;
}

interface ProgressData {
  wordPractice: SectionProgress;
  sentencePractice: SectionProgress;
  kanji: SectionProgress;
  hiragana: SectionProgress;
  katakana: SectionProgress;
  anime: SectionProgress;
}

interface ProgressContextType {
  progress: ProgressData;
  markItemMastered: (section: keyof ProgressData, itemId: string) => void;
  setTotalItems: (section: keyof ProgressData, total: number) => void;
  updateScoreboard: (section: keyof ProgressData, data: Partial<Pick<SectionProgress, 'bestStreak' | 'highScore' | 'averageTime'>>) => void;
  resetProgress: () => void;
}

const initialProgress: ProgressData = {
  wordPractice: {
    masteredIds: [],
    totalItems: 0,
    bestStreak: 0,
    highScore: 0,
    lastAttempt: '',
    averageTime: 0
  },
  sentencePractice: {
    masteredIds: [],
    totalItems: 0,
    bestStreak: 0,
    highScore: 0,
    lastAttempt: '',
    averageTime: 0
  },
  kanji: {
    masteredIds: [],
    totalItems: 0,
    bestStreak: 0,
    highScore: 0,
    lastAttempt: '',
    averageTime: 0
  },
  hiragana: {
    masteredIds: [],
    totalItems: 0,
    bestStreak: 0,
    highScore: 0,
    lastAttempt: '',
    averageTime: 0
  },
  katakana: {
    masteredIds: [],
    totalItems: 0,
    bestStreak: 0,
    highScore: 0,
    lastAttempt: '',
    averageTime: 0
  },
  anime: {
    masteredIds: [],
    totalItems: 0,
    bestStreak: 0,
    highScore: 0,
    lastAttempt: '',
    averageTime: 0
  }
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const isAuthenticated = !!currentUser;
  const [progress, setProgress] = useState<ProgressData>(() => {
    const savedProgress = localStorage.getItem('progress');
    return savedProgress ? JSON.parse(savedProgress) : initialProgress;
  });

  // Use db as correct type
  const typedDb: ReturnType<typeof getFirestore> = db;

  // Load progress from Firebase if authenticated
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const fetchProgress = async () => {
        const userDoc = await getDoc(doc(typedDb, 'progress', currentUser.uid));
        if (userDoc.exists()) {
          setProgress(userDoc.data() as ProgressData);
        } else {
          // If no progress in Firebase, save current local progress to Firebase
          await setDoc(doc(typedDb, 'progress', currentUser.uid), progress);
        }
      };
      fetchProgress();
    } else {
      // If not authenticated, load from localStorage
      const savedProgress = localStorage.getItem('progress');
      setProgress(savedProgress ? JSON.parse(savedProgress) : initialProgress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, currentUser]);

  // Save progress to Firebase or localStorage on change
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      setDoc(doc(typedDb, 'progress', currentUser.uid), progress);
    } else {
      localStorage.setItem('progress', JSON.stringify(progress));
    }
  }, [progress, isAuthenticated, currentUser]);

  // Mark an item as mastered
  const markItemMastered = (section: keyof ProgressData, itemId: string) => {
    setProgress(prev => {
      const sectionData = prev[section];
      if (sectionData.masteredIds.includes(itemId)) return prev;
      return {
        ...prev,
        [section]: {
          ...sectionData,
          masteredIds: [...sectionData.masteredIds, itemId],
          lastAttempt: new Date().toISOString()
        }
      };
    });
  };

  // Set total items for a section
  const setTotalItems = (section: keyof ProgressData, total: number) => {
    setProgress(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        totalItems: total
      }
    }));
  };

  // Update scoreboard stats
  const updateScoreboard = (section: keyof ProgressData, data: Partial<Pick<SectionProgress, 'bestStreak' | 'highScore' | 'averageTime'>>) => {
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
    if (!isAuthenticated) {
      localStorage.removeItem('progress');
    }
  };

  return (
    <ProgressContext.Provider value={{ progress, markItemMastered, setTotalItems, updateScoreboard, resetProgress }}>
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