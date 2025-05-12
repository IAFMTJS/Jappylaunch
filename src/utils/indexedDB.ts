import { ProgressItem, PendingProgressItem, Settings } from '../types';

// Database configuration
const DB_CONFIG = {
  name: 'JapVocDB',
  version: 1,
  stores: {
    progress: {
      name: 'progress',
      keyPath: 'id',
      indexes: [
        { name: 'userId', keyPath: 'userId', unique: false },
        { name: 'section', keyPath: 'section', unique: false },
        { name: 'timestamp', keyPath: 'timestamp', unique: false }
      ]
    },
    pending: {
      name: 'pending',
      keyPath: 'id',
      indexes: [
        { name: 'userId', keyPath: 'userId', unique: false },
        { name: 'timestamp', keyPath: 'timestamp', unique: false },
        { name: 'status', keyPath: 'status', unique: false }
      ]
    },
    settings: {
      name: 'settings',
      keyPath: 'userId',
      indexes: [
        { name: 'lastSync', keyPath: 'lastSync', unique: false }
      ]
    }
  }
} as const;

// Migration types
type Migration = {
  version: number;
  upgrade: (db: IDBDatabase, transaction: IDBTransaction) => Promise<void>;
};

// Migration definitions
const migrations: Migration[] = [
  {
    version: 1,
    upgrade: async (db: IDBDatabase, transaction: IDBTransaction) => {
      // Create progress store
      const progressStore = db.createObjectStore(DB_CONFIG.stores.progress.name, {
        keyPath: DB_CONFIG.stores.progress.keyPath
      });
      DB_CONFIG.stores.progress.indexes.forEach(index => {
        progressStore.createIndex(index.name, index.keyPath, { unique: index.unique });
      });

      // Create pending store
      const pendingStore = db.createObjectStore(DB_CONFIG.stores.pending.name, {
        keyPath: DB_CONFIG.stores.pending.keyPath
      });
      DB_CONFIG.stores.pending.indexes.forEach(index => {
        pendingStore.createIndex(index.name, index.keyPath, { unique: index.unique });
      });

      // Create settings store
      const settingsStore = db.createObjectStore(DB_CONFIG.stores.settings.name, {
        keyPath: DB_CONFIG.stores.settings.keyPath
      });
      DB_CONFIG.stores.settings.indexes.forEach(index => {
        settingsStore.createIndex(index.name, index.keyPath, { unique: index.unique });
      });

      // Initialize default settings
      const DEFAULT_SETTINGS: Settings = {
        userId: 'default',
        lastSync: Date.now(),
        offlineMode: false,
        notifications: true,
        theme: 'light',
        fontSize: 'medium',
        // General settings
        showRomaji: true,
        showHints: true,
        autoPlay: true,
        difficulty: 'medium',
        // Section-specific settings
        showRomajiVocabulary: true,
        showRomajiReading: true,
        showRomajiJLPT: true,
        showKanjiGames: true,
        showRomajiGames: true,
        useHiraganaGames: true,
        // Quiz settings
        quizSettings: {
          showRomaji: true,
          showHiragana: true,
          showKatakana: true,
          showKanji: true,
          randomize: true,
          timeLimit: 30
        }
      };
      await new Promise<void>((resolve, reject) => {
        const request = transaction.objectStore(DB_CONFIG.stores.settings.name).add(DEFAULT_SETTINGS);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  }
];

// Database connection management
let dbConnection: IDBDatabase | null = null;
let connectionPromise: Promise<IDBDatabase> | null = null;

// Open database with migration support
export async function openDB(): Promise<IDBDatabase> {
  if (dbConnection) {
    return dbConnection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);

    request.onerror = () => {
      console.error('[IndexedDB] Failed to open database:', request.error);
      connectionPromise = null;
      reject(request.error);
    };

    request.onsuccess = () => {
      console.log('[IndexedDB] Database opened successfully');
      dbConnection = request.result;
      resolve(dbConnection);
    };

    request.onupgradeneeded = async (event: IDBVersionChangeEvent) => {
      console.log('[IndexedDB] Database upgrade needed:', event.oldVersion, '->', event.newVersion);
      const db = request.result;
      const transaction = (event.target as IDBOpenDBRequest).transaction;
      
      if (!transaction) {
        throw new Error('Transaction is null during database upgrade');
      }

      try {
        // Run all migrations from current version to target version
        const newVersion = event.newVersion ?? DB_CONFIG.version;
        for (let version = event.oldVersion + 1; version <= newVersion; version++) {
          const migration = migrations.find(m => m.version === version);
          if (migration) {
            await migration.upgrade(db, transaction);
          }
        }
      } catch (error) {
        console.error('[IndexedDB] Migration failed:', error);
        reject(error);
      }
    };
  });

  return connectionPromise;
}

// Close database connection
export async function closeDB(): Promise<void> {
  if (dbConnection) {
    dbConnection.close();
    dbConnection = null;
    connectionPromise = null;
  }
}

// Generic store operations
type StoreName = keyof typeof DB_CONFIG.stores;
type StoreConfig = typeof DB_CONFIG.stores[StoreName];

// Add item to store
export async function addToStore<T extends { id: string }>(
  storeName: StoreName,
  item: T
): Promise<T> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.add(item);

    request.onsuccess = () => resolve(item);
    request.onerror = () => reject(request.error);
  });
}

// Add multiple items to store
export async function addBulkToStore<T extends { id: string }>(
  storeName: StoreName,
  items: T[]
): Promise<T[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    
    const promises = items.map(item => 
      new Promise<void>((resolveItem, rejectItem) => {
        const request = store.add(item);
        request.onsuccess = () => resolveItem();
        request.onerror = () => rejectItem(request.error);
      })
    );

    Promise.all(promises)
      .then(() => resolve(items))
      .catch(reject);
  });
}

// Get item from store
export async function getFromStore<T extends { id: string }>(
  storeName: StoreName,
  id: string
): Promise<T | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Get items by index
export async function getByIndex<T extends { id: string }>(
  storeName: StoreName,
  indexName: string,
  value: any
): Promise<T[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const index = store.index(indexName);
    const request = index.getAll(value);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Update item in store
export async function updateInStore<T extends { id: string }>(
  storeName: StoreName,
  item: T
): Promise<T> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(item);

    request.onsuccess = () => resolve(item);
    request.onerror = () => reject(request.error);
  });
}

// Update multiple items in store
export async function updateBulkInStore<T extends { id: string }>(
  storeName: StoreName,
  items: T[]
): Promise<T[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    
    const promises = items.map(item => 
      new Promise<void>((resolveItem, rejectItem) => {
        const request = store.put(item);
        request.onsuccess = () => resolveItem();
        request.onerror = () => rejectItem(request.error);
      })
    );

    Promise.all(promises)
      .then(() => resolve(items))
      .catch(reject);
  });
}

// Delete item from store
export async function deleteFromStore(
  storeName: StoreName,
  id: string
): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Delete multiple items from store
export async function deleteBulkFromStore(
  storeName: StoreName,
  ids: string[]
): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    
    const promises = ids.map(id => 
      new Promise<void>((resolveItem, rejectItem) => {
        const request = store.delete(id);
        request.onsuccess = () => resolveItem();
        request.onerror = () => rejectItem(request.error);
      })
    );

    Promise.all(promises)
      .then(() => resolve())
      .catch(reject);
  });
}

// Clear store
export async function clearStore(storeName: StoreName): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Progress-specific operations
export async function saveProgress(progress: ProgressItem): Promise<ProgressItem> {
  return updateInStore('progress', progress);
}

export async function saveBulkProgress(progressItems: ProgressItem[]): Promise<ProgressItem[]> {
  return updateBulkInStore('progress', progressItems);
}

export async function getProgress(userId: string, section?: string): Promise<ProgressItem[]> {
  if (section) {
    return getByIndex<ProgressItem>('progress', 'section', section);
  }
  return getByIndex<ProgressItem>('progress', 'userId', userId);
}

export async function clearProgress(userId: string): Promise<void> {
  const db = await openDB();
  const transaction = db.transaction('progress', 'readwrite');
  const store = transaction.objectStore('progress');
  const index = store.index('userId');
  
  // Get all progress items for the user
  const items = await new Promise<ProgressItem[]>((resolve, reject) => {
    const request = index.getAll(userId);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  
  // Delete all items
  await Promise.all(items.map(item => 
    new Promise<void>((resolve, reject) => {
      const request = store.delete(item.id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    })
  ));
}

export async function savePendingProgress(pending: PendingProgressItem): Promise<PendingProgressItem> {
  return addToStore('pending', pending);
}

export async function saveBulkPendingProgress(pendingItems: PendingProgressItem[]): Promise<PendingProgressItem[]> {
  return addBulkToStore('pending', pendingItems);
}

export async function getPendingProgress(userId: string): Promise<PendingProgressItem[]> {
  return getByIndex<PendingProgressItem>('pending', 'userId', userId);
}

export async function clearPendingProgress(userId: string): Promise<void> {
  const pending = await getPendingProgress(userId);
  const ids = pending.map(item => item.id);
  return deleteBulkFromStore('pending', ids);
}

// Settings operations
export const saveSettings = async (settings: Settings): Promise<void> => {
  const db = await openDB();
  const tx = db.transaction('settings', 'readwrite');
  const store = tx.objectStore('settings');
  
  return new Promise((resolve, reject) => {
    const request = store.put(settings);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

export const getSettings = async (userId: string): Promise<Settings | null> => {
  const db = await openDB();
  const tx = db.transaction('settings', 'readonly');
  const store = tx.objectStore('settings');
  
  return new Promise((resolve, reject) => {
    const request = store.get(userId);
    request.onsuccess = () => resolve(request.result ?? null);
    request.onerror = () => reject(request.error);
    tx.onerror = () => reject(tx.error);
  });
};

// Backup and restore operations
export const createBackup = async (): Promise<{
  progress: ProgressItem[];
  pending: PendingProgressItem[];
  settings: Settings[];
}> => {
  const db = await openDB();
  const tx = db.transaction(['progress', 'pending', 'settings'], 'readonly');
  
  return new Promise((resolve, reject) => {
    const progressRequest = tx.objectStore('progress').getAll();
    const pendingRequest = tx.objectStore('pending').getAll();
    const settingsRequest = tx.objectStore('settings').getAll();
    
    Promise.all([
      new Promise<ProgressItem[]>((res, rej) => {
        progressRequest.onsuccess = () => res(progressRequest.result);
        progressRequest.onerror = () => rej(progressRequest.error);
      }),
      new Promise<PendingProgressItem[]>((res, rej) => {
        pendingRequest.onsuccess = () => res(pendingRequest.result);
        pendingRequest.onerror = () => rej(pendingRequest.error);
      }),
      new Promise<Settings[]>((res, rej) => {
        settingsRequest.onsuccess = () => res(settingsRequest.result);
        settingsRequest.onerror = () => rej(settingsRequest.error);
      })
    ]).then(([progress, pending, settings]) => {
      resolve({ progress, pending, settings });
    }).catch(reject);
    
    tx.onerror = () => reject(tx.error);
  });
};

export const restoreBackup = async (backup: {
  progress: ProgressItem[];
  pending: PendingProgressItem[];
  settings: Settings[];
}): Promise<void> => {
  const db = await openDB();
  const tx = db.transaction(['progress', 'pending', 'settings'], 'readwrite');
  
  return new Promise((resolve, reject) => {
    // Clear existing data
    const clearRequests = [
      tx.objectStore('progress').clear(),
      tx.objectStore('pending').clear(),
      tx.objectStore('settings').clear()
    ];
    
    Promise.all(clearRequests.map(req => 
      new Promise<void>((res, rej) => {
        req.onsuccess = () => res();
        req.onerror = () => rej(req.error);
      })
    )).then(() => {
      // Restore data
      const restoreRequests = [
        ...backup.progress.map(item => tx.objectStore('progress').put(item)),
        ...backup.pending.map(item => tx.objectStore('pending').put(item)),
        ...backup.settings.map(item => tx.objectStore('settings').put(item))
      ];
      
      Promise.all(restoreRequests.map(req =>
        new Promise<void>((res, rej) => {
          req.onsuccess = () => res();
          req.onerror = () => rej(req.error);
        })
      )).then(() => resolve()).catch(reject);
    }).catch(reject);
    
    tx.onerror = () => reject(tx.error);
  });
};

// Export database configuration for use in other files
export { DB_CONFIG }; 