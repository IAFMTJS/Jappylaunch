import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../utils/firebase';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

interface SectionProgress {
  masteredIds: Set<string>;
  totalItems: number;
  bestStreak: number;
  highScore: number;
  averageTime: number;
  lastAttempt: string;
  totalQuestions: number;
  correctAnswers: number;
}

interface ProgressData {
  [key: string]: SectionProgress;
}

interface ProgressContextType {
  progress: ProgressData;
  markItemMastered: (section: string, itemId: string) => void;
  setTotalItems: (section: string, total: number) => void;
  updateScoreboard: (section: string, data: Partial<Pick<SectionProgress, 'bestStreak' | 'highScore' | 'averageTime'>>) => void;
  resetProgress: () => void;
  updateProgress: (section: string, data: Partial<SectionProgress>) => void;
}

const defaultSectionProgress: SectionProgress = {
  masteredIds: new Set(),
  totalItems: 0,
  bestStreak: 0,
  highScore: 0,
  averageTime: 0,
  lastAttempt: '',
  totalQuestions: 0,
  correctAnswers: 0
};

const ProgressContext = createContext<ProgressContextType>({
  progress: {},
  markItemMastered: () => {},
  setTotalItems: () => {},
  updateScoreboard: () => {},
  resetProgress: () => {},
  updateProgress: () => {}
});

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const isAuthenticated = !!currentUser;
  const [progress, setProgress] = useState<ProgressData>({});

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
      setProgress(savedProgress ? JSON.parse(savedProgress) : {});
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

  const markItemMastered = (section: string, itemId: string) => {
    setProgress(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] || defaultSectionProgress),
        masteredIds: new Set([...(prev[section]?.masteredIds || []), itemId])
      }
    }));
  };

  const setTotalItems = (section: string, total: number) => {
    setProgress(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] || defaultSectionProgress),
        totalItems: total
      }
    }));
  };

  const updateScoreboard = (section: string, data: Partial<Pick<SectionProgress, 'bestStreak' | 'highScore' | 'averageTime'>>) => {
    setProgress(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] || defaultSectionProgress),
        ...data
      }
    }));
  };

  const updateProgress = (section: string, data: Partial<SectionProgress>) => {
    setProgress(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] || defaultSectionProgress),
        ...data,
        totalQuestions: (prev[section]?.totalQuestions || 0) + (data.totalQuestions || 0),
        correctAnswers: (prev[section]?.correctAnswers || 0) + (data.correctAnswers || 0),
        bestStreak: Math.max(prev[section]?.bestStreak || 0, data.bestStreak || 0),
        highScore: Math.max(prev[section]?.highScore || 0, data.highScore || 0),
        averageTime: data.averageTime || prev[section]?.averageTime || 0
      }
    }));
  };

  const resetProgress = () => {
    setProgress({});
    if (!isAuthenticated) {
      localStorage.removeItem('progress');
    }
  };

  return (
    <ProgressContext.Provider value={{ 
      progress, 
      markItemMastered, 
      setTotalItems, 
      updateScoreboard, 
      resetProgress,
      updateProgress 
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext); 