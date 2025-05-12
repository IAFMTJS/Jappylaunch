import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  ProgressItem,
  PendingProgressItem,
  Settings,
  ApiResponse,
  SyncRequest,
  SyncResponse
} from '../types';
import {
  saveProgress,
  saveBulkProgress,
  getProgress,
  savePendingProgress,
  saveBulkPendingProgress,
  getPendingProgress,
  clearPendingProgress,
  clearProgress as clearProgressDB,
  saveSettings,
  getSettings,
  createBackup,
  restoreBackup
} from '../utils/indexedDB';

interface ProgressContextType {
  // Progress state
  progress: Record<string, ProgressItem>;
  pendingProgress: PendingProgressItem[];
  isLoading: boolean;
  error: string | null;
  
  // Settings state
  settings: Settings | null;
  isSettingsLoading: boolean;
  settingsError: string | null;
  
  // Progress actions
  updateProgress: (section: string, itemId: string, correct: boolean, additionalData?: Partial<ProgressItem>) => Promise<void>;
  syncProgress: () => Promise<void>;
  clearProgress: () => Promise<void>;
  resetProgress: () => Promise<void>;
  getProgressStatus: (section: string, itemId: string) => { isMarked: boolean; lastAttempted: number | null };
  
  // Settings actions
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
  
  // Backup actions
  createDataBackup: () => Promise<{
    progress: ProgressItem[];
    pending: PendingProgressItem[];
    settings: Settings[];
  }>;
  restoreDataBackup: (backup: {
    progress: ProgressItem[];
    pending: PendingProgressItem[];
    settings: Settings[];
  }) => Promise<void>;
  
  // Status
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime: number | null;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const DEFAULT_USER_ID = 'default';

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Progress state
  const [progress, setProgress] = useState<Record<string, ProgressItem>>({});
  const [pendingProgress, setPendingProgress] = useState<PendingProgressItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Settings state
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isSettingsLoading, setIsSettingsLoading] = useState(true);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  
  // Sync state
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);
  
  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Load settings first
        const userSettings = await getSettings(DEFAULT_USER_ID);
        setSettings(userSettings ?? null);
        
        // Load progress
        const userProgress = await getProgress(DEFAULT_USER_ID);
        const progressMap = userProgress.reduce((acc, item) => {
          acc[`${item.section}-${item.itemId}`] = item;
          return acc;
        }, {} as Record<string, ProgressItem>);
        setProgress(progressMap);
        
        // Load pending progress
        const pending = await getPendingProgress(DEFAULT_USER_ID);
        setPendingProgress(pending);
        
        // Update last sync time from settings
        if (userSettings) {
          setLastSyncTime(userSettings.lastSync);
        }
      } catch (err) {
        console.error('[ProgressContext] Failed to load initial data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load progress data');
      } finally {
        setIsLoading(false);
        setIsSettingsLoading(false);
      }
    };
    
    loadInitialData();
  }, []);
  
  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      console.log('[ProgressContext] Online status detected');
      setIsOnline(true);
      // Trigger sync when coming back online
      syncProgress().catch(err => {
        console.error('[ProgressContext] Failed to sync after coming online:', err);
      });
    };
    
    const handleOffline = () => {
      console.log('[ProgressContext] Offline status detected');
      setIsOnline(false);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Helper function to create a PendingProgressItem
  const createPendingProgressItem = useCallback((progress: ProgressItem, timestamp: number): PendingProgressItem => {
    const pendingItem = {
      ...progress,
      status: 'pending' as const,
      retryCount: 0,
      lastAttempt: timestamp
    } as PendingProgressItem;
    return pendingItem;
  }, []);

  // Update progress with offline support
  const updateProgress = useCallback(async (
    section: string,
    itemId: string,
    correct: boolean,
    additionalData?: Partial<ProgressItem>
  ) => {
    const key = `${section}-${itemId}`;
    const timestamp = Date.now();
    
    try {
      // Create or update progress item
      const existingProgress = progress[key];
      const updatedProgress: ProgressItem = {
        id: existingProgress?.id ?? uuidv4(),
        userId: DEFAULT_USER_ID,
        section,
        itemId,
        correct: (existingProgress?.correct ?? 0) + (correct ? 1 : 0),
        incorrect: (existingProgress?.incorrect ?? 0) + (correct ? 0 : 1),
        lastAttempted: timestamp,
        timestamp: existingProgress?.timestamp ?? timestamp,
        version: '1.0.0',
        ...additionalData,
        // Ensure these properties are properly typed and handled
        totalQuestions: additionalData?.totalQuestions ?? (existingProgress?.totalQuestions ?? 0) + 1,
        correctAnswers: additionalData?.correctAnswers ?? (existingProgress?.correctAnswers ?? 0) + (correct ? 1 : 0),
        bestStreak: additionalData?.bestStreak ?? Math.max(existingProgress?.bestStreak ?? 0, correct ? (existingProgress?.bestStreak ?? 0) + 1 : 0),
        highScore: additionalData?.highScore ?? Math.max(existingProgress?.highScore ?? 0, correct ? (existingProgress?.correctAnswers ?? 0) + 1 : (existingProgress?.correctAnswers ?? 0)),
        lastAttempt: timestamp,
        // Preserve optional properties if they exist
        masteredIds: additionalData?.masteredIds ?? existingProgress?.masteredIds,
        meaning: additionalData?.meaning ?? existingProgress?.meaning,
        examples: additionalData?.examples ?? existingProgress?.examples
      };
      
      // Update local state
      setProgress(prev => ({
        ...prev,
        [key]: updatedProgress
      }));
      
      if (isOnline) {
        // Try to save directly if online
        try {
          await saveProgress(updatedProgress);
        } catch (err) {
          console.error('[ProgressContext] Failed to save progress online:', err);
          // Fall back to pending if direct save fails
          const pendingItem = createPendingProgressItem(updatedProgress, timestamp);
          await savePendingProgress(pendingItem);
          setPendingProgress(prev => [...prev, pendingItem]);
        }
      } else {
        // Save as pending if offline
        const pendingItem = createPendingProgressItem(updatedProgress, timestamp);
        await savePendingProgress(pendingItem);
        setPendingProgress(prev => [...prev, pendingItem]);
      }
    } catch (err) {
      console.error('[ProgressContext] Failed to update progress:', err);
      setError(err instanceof Error ? err.message : 'Failed to update progress');
      throw err;
    }
  }, [progress, isOnline]);
  
  // Sync progress with server
  const syncProgress = useCallback(async () => {
    if (!isOnline || isSyncing || pendingProgress.length === 0) {
      return;
    }
    
    try {
      setIsSyncing(true);
      setError(null);
      
      // Group pending items by status
      const pendingItems = pendingProgress.filter(item => item.status === 'pending');
      if (pendingItems.length === 0) {
        return;
      }
      
      // Prepare sync request
      const syncRequest: SyncRequest = {
        userId: DEFAULT_USER_ID,
        progress: pendingItems,
        version: '1.0.0' // TODO: Get from app version
      };
      
      // Send to server
      const response = await fetch('/api/sync-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(syncRequest)
      });
      
      if (!response.ok) {
        throw new Error(`Sync failed with status: ${response.status}`);
      }
      
      const result = await response.json() as SyncResponse;
      
      if (!result.success) {
        throw new Error(result.error ?? 'Sync failed');
      }
      
      // Update local state based on sync result
      if (result.data) {
        const { synced, failed, conflicts } = result.data;
        
        // Update synced items
        const syncedItems = pendingItems.filter((_, index) => index < synced);
        await Promise.all(syncedItems.map(item => 
          saveProgress({ ...item, status: undefined } as ProgressItem)
        ));
        
        // Update failed items
        const failedItems = pendingItems.filter((_, index) => 
          index >= synced && index < synced + failed
        );
        await Promise.all(failedItems.map(item => 
          savePendingProgress({
            ...item,
            status: 'failed',
            retryCount: item.retryCount + 1,
            lastAttempt: Date.now()
          } as PendingProgressItem)
        ));
        
        // Handle conflicts
        if (conflicts.length > 0) {
          console.log('[ProgressContext] Resolving conflicts:', conflicts);
          
          // For each conflict, compare timestamps and keep the most recent version
          for (const conflict of conflicts) {
            const localKey = `${conflict.section}-${conflict.itemId}`;
            const localItem = progress[localKey];
            
            if (localItem) {
              // If local item is more recent, keep it
              if (localItem.lastAttempted > conflict.lastAttempted) {
                console.log('[ProgressContext] Keeping local version for:', localKey);
                await saveProgress(localItem);
              } else {
                // If server version is more recent, update local state
                console.log('[ProgressContext] Using server version for:', localKey);
                const updatedItem = { ...conflict, status: 'synced' };
                await saveProgress(updatedItem);
                setProgress(prev => ({
                  ...prev,
                  [localKey]: updatedItem
                }));
              }
            } else {
              // If no local version exists, use server version
              console.log('[ProgressContext] Using server version for new item:', localKey);
              const updatedItem = { ...conflict, status: 'synced' };
              await saveProgress(updatedItem);
              setProgress(prev => ({
                ...prev,
                [localKey]: updatedItem
              }));
            }
          }
        }
        
        // Update settings with last sync time
        const newSettings: Settings = {
          ...settings!,
          lastSync: Date.now()
        };
        await saveSettings(newSettings);
        setSettings(newSettings);
        setLastSyncTime(newSettings.lastSync);
        
        // Update local state
        setPendingProgress(prev => 
          prev.filter(item => !syncedItems.some(synced => synced.id === item.id))
        );
      }
    } catch (err) {
      console.error('[ProgressContext] Sync failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to sync progress');
      throw err;
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, isSyncing, pendingProgress, settings, progress]);
  
  // Clear all progress
  const clearProgress = useCallback(async () => {
    try {
      setError(null);
      
      // Clear from IndexedDB
      await Promise.all([
        clearPendingProgress(DEFAULT_USER_ID),
        clearProgressDB(DEFAULT_USER_ID)
      ]);
      
      // Clear local state
      setProgress({});
      setPendingProgress([]);
      
      // Update settings
      if (settings) {
        const newSettings: Settings = {
          ...settings,
          lastSync: Date.now()
        };
        await saveSettings(newSettings);
        setSettings(newSettings);
        setLastSyncTime(newSettings.lastSync);
      }
    } catch (err) {
      console.error('[ProgressContext] Failed to clear progress:', err);
      setError(err instanceof Error ? err.message : 'Failed to clear progress');
      throw err;
    }
  }, [settings]);
  
  // Add resetProgress function
  const resetProgress = useCallback(async () => {
    try {
      setError(null);
      
      // Clear from IndexedDB
      await Promise.all([
        clearPendingProgress(DEFAULT_USER_ID),
        clearProgressDB(DEFAULT_USER_ID)
      ]);
      
      // Clear local state
      setProgress({});
      setPendingProgress([]);
      
      // Update settings
      if (settings) {
        const newSettings: Settings = {
          ...settings,
          lastSync: Date.now()
        };
        await saveSettings(newSettings);
        setSettings(newSettings);
        setLastSyncTime(newSettings.lastSync);
      }
    } catch (err) {
      console.error('[ProgressContext] Failed to reset progress:', err);
      setError(err instanceof Error ? err.message : 'Failed to reset progress');
      throw err;
    }
  }, [settings]);
  
  // Update settings
  const updateSettings = useCallback(async (newSettings: Partial<Settings>) => {
    if (!settings) {
      throw new Error('Settings not initialized');
    }
    
    try {
      setSettingsError(null);
      
      const updatedSettings: Settings = {
        ...settings,
        ...newSettings,
        lastSync: Date.now()
      };
      
      await saveSettings(updatedSettings);
      setSettings(updatedSettings);
      setLastSyncTime(updatedSettings.lastSync);
    } catch (err) {
      console.error('[ProgressContext] Failed to update settings:', err);
      setSettingsError(err instanceof Error ? err.message : 'Failed to update settings');
      throw err;
    }
  }, [settings]);
  
  // Create data backup
  const createDataBackup = useCallback(async () => {
    try {
      return await createBackup();
    } catch (err) {
      console.error('[ProgressContext] Failed to create backup:', err);
      throw err;
    }
  }, []);
  
  // Restore data backup
  const restoreDataBackup = useCallback(async (backup: {
    progress: ProgressItem[];
    pending: PendingProgressItem[];
    settings: Settings[];
  }) => {
    try {
      setError(null);
      setSettingsError(null);
      
      // Restore from backup
      await restoreBackup(backup);
      
      // Update local state
      const progressMap = backup.progress.reduce((acc, item) => {
        acc[`${item.section}-${item.itemId}`] = item;
        return acc;
      }, {} as Record<string, ProgressItem>);
      
      setProgress(progressMap);
      setPendingProgress(backup.pending);
      
      if (backup.settings.length > 0) {
        const userSettings = backup.settings.find(s => s.userId === DEFAULT_USER_ID);
        if (userSettings) {
          setSettings(userSettings);
          setLastSyncTime(userSettings.lastSync);
        }
      }
    } catch (err) {
      console.error('[ProgressContext] Failed to restore backup:', err);
      setError(err instanceof Error ? err.message : 'Failed to restore backup');
      throw err;
    }
  }, []);
  
  // Get progress status for an item
  const getProgressStatus = useCallback((section: string, itemId: string) => {
    const key = `${section}-${itemId}`;
    const item = progress[key];
    return {
      isMarked: Boolean(item?.correct && item.correct > 0),
      lastAttempted: item?.lastAttempted ?? null
    };
  }, [progress]);
  
  const value: ProgressContextType = {
    // Progress state
    progress,
    pendingProgress,
    isLoading,
    error,
    
    // Settings state
    settings,
    isSettingsLoading,
    settingsError,
    
    // Progress actions
    updateProgress,
    syncProgress,
    clearProgress,
    resetProgress,
    getProgressStatus,
    
    // Settings actions
    updateSettings,
    
    // Backup actions
    createDataBackup,
    restoreDataBackup,
    
    // Status
    isOnline,
    isSyncing,
    lastSyncTime
  };
  
  return (
    <ProgressContext.Provider value={value}>
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