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

// Add these type definitions at the top
type FirestoreSectionProgress = Omit<SectionProgress, 'masteredIds'> & {
  masteredIds: string[];
};

type FirestoreProgressData = {
  [key: string]: FirestoreSectionProgress;
};

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
          const data = userDoc.data() as FirestoreProgressData;
          // Convert arrays back to Sets for in-memory use
          const convertedData: ProgressData = Object.entries(data).reduce((acc, [key, value]) => ({
            ...acc,
            [key]: {
              ...value,
              masteredIds: new Set(value.masteredIds)
            }
          }), {});
          setProgress(convertedData);
        } else {
          // If no progress in Firebase, save current local progress to Firebase
          const dataToSave: FirestoreProgressData = Object.entries(progress).reduce((acc, [key, value]) => ({
            ...acc,
            [key]: {
              ...value,
              masteredIds: Array.from(value.masteredIds)
            }
          }), {});
          await setDoc(doc(typedDb, 'progress', currentUser.uid), dataToSave);
        }
      };
      fetchProgress();
    } else {
      // If not authenticated, load from localStorage
      const savedProgress = localStorage.getItem('progress');
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress) as FirestoreProgressData;
        // Convert arrays back to Sets for in-memory use
        const convertedData: ProgressData = Object.entries(parsed).reduce((acc, [key, value]) => ({
          ...acc,
          [key]: {
            ...value,
            masteredIds: new Set(value.masteredIds)
          }
        }), {});
        setProgress(convertedData);
      } else {
        setProgress({});
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, currentUser]);

  // Save progress to Firebase or localStorage on change
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      // Convert Sets to arrays before saving to Firebase
      const dataToSave: FirestoreProgressData = Object.entries(progress).reduce((acc, [key, value]) => ({
        ...acc,
        [key]: {
          ...value,
          masteredIds: Array.from(value.masteredIds)
        }
      }), {});
      setDoc(doc(typedDb, 'progress', currentUser.uid), dataToSave);
    } else {
      // Convert Sets to arrays before saving to localStorage
      const dataToSave: FirestoreProgressData = Object.entries(progress).reduce((acc, [key, value]) => ({
        ...acc,
        [key]: {
          ...value,
          masteredIds: Array.from(value.masteredIds)
        }
      }), {});
      localStorage.setItem('progress', JSON.stringify(dataToSave));
    }
  }, [progress, isAuthenticated, currentUser]);

  const markItemMastered = (section: string, itemId: string) => {
    setProgress(prev => {
      const currentSection = prev[section] || defaultSectionProgress;
      const newMasteredIds = new Set(currentSection.masteredIds);
      newMasteredIds.add(itemId);
      return {
        ...prev,
        [section]: {
          ...currentSection,
          masteredIds: newMasteredIds
        }
      };
    });
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