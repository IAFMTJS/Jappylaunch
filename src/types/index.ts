// Progress tracking types
export interface ProgressItem {
  id: string;
  userId: string;
  section: string;
  itemId: string;
  correct: number;
  incorrect: number;
  total?: number;  // Optional total property for tracking total items
  lastAttempted: number;
  timestamp: number;
  version: string;
}

export interface PendingProgressItem extends ProgressItem {
  status: 'pending' | 'synced' | 'failed';
  retryCount: number;
  lastAttempt: number;
}

// Settings types
export interface QuizSettings {
  showRomaji: boolean;
  showHiragana: boolean;
  showKatakana: boolean;
  showKanji: boolean;
  randomize: boolean;
  timeLimit: number;
}

export interface Settings {
  userId: string;
  lastSync: number;
  offlineMode: boolean;
  notifications: boolean;
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  quizSettings: QuizSettings;
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