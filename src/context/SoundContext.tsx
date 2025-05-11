import React, { createContext, useContext, useCallback, ReactNode } from 'react';
import { useSettings } from './SettingsContext';

type SoundType = 'correct' | 'incorrect' | 'complete' | 'click';

interface SoundContextType {
  playSound: (type: SoundType) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

const soundEffects: Record<SoundType, string> = {
  correct: '/sounds/correct.mp3',
  incorrect: '/sounds/incorrect.mp3',
  complete: '/sounds/complete.mp3',
  click: '/sounds/click.mp3',
};

export const SoundProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { settings } = useSettings();

  const playSound = useCallback((type: SoundType) => {
    if (!settings.soundEnabled) return;

    const audio = new Audio(soundEffects[type]);
    audio.play().catch(error => {
      console.warn('Failed to play sound:', error);
    });
  }, [settings.soundEnabled]);

  return (
    <SoundContext.Provider value={{ playSound }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}; 