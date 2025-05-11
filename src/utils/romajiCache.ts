import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { deleteDB } from 'idb';

interface RomajiDBSchema extends DBSchema {
  romaji: {
    key: string;
    value: string;
  };
}

class RomajiCache {
  private db: IDBPDatabase<RomajiDBSchema> | null = null;
  private dbName = 'japvoc-romaji-cache';
  private storeName = 'romaji' as const;
  private version = 1;
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  async initialize() {
    console.log('RomajiCache.initialize called, current state:', { 
      isInitialized: this.isInitialized, 
      hasDb: !!this.db,
      hasInitPromise: !!this.initPromise 
    });

    if (this.isInitialized && this.db) {
      console.log('RomajiCache already initialized and database exists');
      return;
    }

    if (!this.initPromise) {
      console.log('Creating new RomajiCache initialization promise');
      this.initPromise = (async () => {
        try {
          console.log('Opening IndexedDB...');
          // Clear any existing database to ensure fresh start
          try {
            await deleteDB(this.dbName);
            console.log('Cleared existing database');
          } catch (e) {
            console.log('No existing database to clear');
          }

          this.db = await openDB<RomajiDBSchema>(this.dbName, this.version, {
            upgrade(db, oldVersion, newVersion) {
              console.log('Upgrading database from version', oldVersion, 'to', newVersion);
              if (!db.objectStoreNames.contains('romaji')) {
                console.log('Creating romaji store...');
                db.createObjectStore('romaji');
                console.log('Romaji store created successfully');
              }
            },
            blocked() {
              console.warn('Database upgrade blocked by another tab');
            },
            blocking() {
              console.warn('This tab is blocking another tab from upgrading the database');
            },
            terminated() {
              console.warn('Database connection terminated');
              this.isInitialized = false;
              this.db = null;
            }
          });
          
          console.log('IndexedDB opened successfully');
          this.isInitialized = true;
          console.log('RomajiCache initialization complete');
        } catch (error) {
          console.error('Failed to initialize RomajiCache:', error);
          this.isInitialized = false;
          this.db = null;
          this.initPromise = null;
          throw error;
        }
      })();
    } else {
      console.log('Using existing RomajiCache initialization promise');
    }

    try {
      await this.initPromise;
      console.log('RomajiCache initialization promise resolved successfully');
    } catch (error) {
      console.error('RomajiCache initialization promise failed:', error);
      throw error;
    }
  }

  async get(key: string): Promise<string | undefined> {
    console.log('RomajiCache.get called for key:', key);
    await this.initialize();
    
    if (!this.db) {
      console.error('Database not initialized in get');
      return undefined;
    }

    try {
      const value = await this.db.get(this.storeName, key);
      console.log('Cache get:', key, value ? 'hit' : 'miss');
      return value;
    } catch (error) {
      console.error('Error getting from cache:', error);
      return undefined;
    }
  }

  async set(key: string, value: string): Promise<void> {
    console.log('RomajiCache.set called for key:', key);
    await this.initialize();
    
    if (!this.db) {
      console.error('Database not initialized in set');
      throw new Error('Database not initialized');
    }

    try {
      console.log('Setting cache value...');
      await this.db.put(this.storeName, value, key);
      console.log('Cache set successful for key:', key);
    } catch (error) {
      console.error('Error setting cache:', error);
      throw error;
    }
  }

  async getBatch(keys: string[]): Promise<Record<string, string>> {
    console.log('RomajiCache.getBatch called for', keys.length, 'keys');
    await this.initialize();
    
    if (!this.db) {
      console.error('Database not initialized in getBatch');
      return {};
    }

    const result: Record<string, string> = {};
    try {
      console.log('Starting batch get...');
      const tx = this.db.transaction([this.storeName], 'readonly');
      const store = tx.objectStore(this.storeName);
      
      if (!store) {
        console.error('Failed to get store');
        return {};
      }

      // Get all values in parallel
      const values = await Promise.all(
        keys.map(key => store.get(key))
      );

      // Map results
      keys.forEach((key: string, index: number) => {
        const value = values[index];
        if (value) {
          result[key] = value;
        }
      });

      console.log('Cache batch get complete:', Object.keys(result).length, 'hits out of', keys.length, 'keys');
      return result;
    } catch (error) {
      console.error('Error in batch get:', error);
      return {};
    }
  }

  async setBatch(entries: Record<string, string>): Promise<void> {
    console.log('RomajiCache.setBatch called for', Object.keys(entries).length, 'entries');
    await this.initialize();
    
    if (!this.db) {
      console.error('Database not initialized in setBatch');
      throw new Error('Database not initialized');
    }

    try {
      console.log('Starting batch set...');
      const tx = this.db.transaction([this.storeName], 'readwrite');
      const store = tx.objectStore(this.storeName);
      
      if (!store) {
        console.error('Failed to get store');
        throw new Error('Failed to get store');
      }

      // Set all values in parallel
      await Promise.all(
        Object.entries(entries).map(([key, value]) => store.put(value, key))
      );
      
      await tx.done;
      console.log('Cache batch set complete successfully');
    } catch (error) {
      console.error('Error in batch set:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    await this.initialize();
    try {
      console.log('Clearing cache...');
      await this.db?.clear(this.storeName);
      console.log('Cache cleared successfully');
    } catch (error) {
      console.error('Error clearing cache:', error);
      throw error;
    }
  }

  async getStats(): Promise<{ total: number }> {
    await this.initialize();
    try {
      const tx = this.db?.transaction([this.storeName], 'readonly');
      const store = tx?.objectStore(this.storeName);
      if (!store) return { total: 0 };
      
      const allKeys = await store.getAllKeys();
      return { total: allKeys.length };
    } catch (error) {
      console.error('Error getting cache stats:', error);
      return { total: 0 };
    }
  }

  async getAll(): Promise<Record<string, string>> {
    await this.initialize();
    
    if (!this.db) {
      console.error('Database not initialized in getAll');
      return {};
    }

    try {
      const tx = this.db.transaction([this.storeName], 'readonly');
      const store = tx.objectStore(this.storeName);
      
      if (!store) {
        console.error('Failed to get store');
        return {};
      }

      const allKeys = await store.getAllKeys();
      const allValues = await Promise.all(
        allKeys.map((key: string) => store.get(key))
      );

      const result: Record<string, string> = {};
      allKeys.forEach((key: string, index: number) => {
        const value = allValues[index];
        if (value) {
          result[key] = value;
        }
      });

      return result;
    } catch (error) {
      console.error('Error getting all cached values:', error);
      return {};
    }
  }

  async warmupCache(commonWords: string[]): Promise<void> {
    await this.initialize();
    
    if (!this.db) {
      console.error('Database not initialized in warmupCache');
      return;
    }

    try {
      // Get all existing cached values
      const existingCache = await this.getAll();
      
      // Filter out words that are already cached
      const wordsToCache = commonWords.filter(word => !existingCache[word]);
      
      if (wordsToCache.length === 0) {
        console.log('All common words already cached');
        return;
      }

      console.log('Warming up cache with', wordsToCache.length, 'words');
      const tx = this.db.transaction([this.storeName], 'readwrite');
      const store = tx.objectStore(this.storeName);
      
      if (!store) {
        console.error('Failed to get store');
        return;
      }

      // Cache all words in parallel
      await Promise.all(
        wordsToCache.map(word => store.put(word, word))
      );

      await tx.done;
      console.log('Cache warmup complete');
    } catch (error) {
      console.error('Error warming up cache:', error);
    }
  }
}

export const romajiCache = new RomajiCache(); 