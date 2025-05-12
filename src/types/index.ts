// Progress tracking types
export interface ProgressItem {
  id: string;
  userId: string;
  section: string;
  itemId: string;
  correct: number;
  incorrect: number;
  lastAttempted: number;
  timestamp: number;
  version: string;
  // Additional properties used throughout the application
  totalQuestions?: number;
  correctAnswers?: number;
  bestStreak?: number;
  highScore?: number;
  averageTime?: number;
  masteredIds?: string[];
  totalItems?: number;
  lastAttempt?: number;
  meaning?: string;
  examples?: string[];
}

export interface PendingProgressItem extends ProgressItem {
  status: 'pending' | 'synced' | 'failed';
  retryCount: number;
  lastAttempt: number;
}

// Settings types
export interface Settings {
  userId: string;
  lastSync: number;
  offlineMode: boolean;
  notifications: boolean;
  theme: 'light' | 'blue' | 'green';
  fontSize: 'small' | 'medium' | 'large';
  // General settings
  showRomaji: boolean;
  showHints: boolean;
  autoPlay: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  // Section-specific settings
  showRomajiVocabulary: boolean;
  showRomajiReading: boolean;
  showRomajiJLPT: boolean;
  showKanjiGames: boolean;
  showRomajiGames: boolean;
  useHiraganaGames: boolean;
  // Quiz settings
  quizSettings: {
    showRomaji: boolean;
    showHiragana: boolean;
    showKatakana: boolean;
    showKanji: boolean;
    randomize: boolean;
    timeLimit: number;
  };
}

// Database types
export interface DBStore {
  name: string;
  keyPath: string;
  indexes: {
    name: string;
    keyPath: string;
    unique: boolean;
  }[];
}

export interface DBConfig {
  name: string;
  version: number;
  stores: {
    [key: string]: DBStore;
  };
}

// Service worker types
export interface SyncConfig {
  tags: {
    progress: string;
    romaji: string;
  };
  retry: {
    maxAttempts: number;
    backoff: {
      initial: number;
      multiplier: number;
    };
  };
}

// API types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  version?: string;
}

export interface SyncRequest {
  userId: string;
  progress: PendingProgressItem[];
  version: string;
}

export interface SyncResponse extends ApiResponse<{
  synced: number;
  failed: number;
  conflicts: PendingProgressItem[];
}> {} 