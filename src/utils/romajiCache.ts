import { openDB, DBSchema, IDBPDatabase } from 'idb';

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

  async initialize() {
    if (this.isInitialized) return;

    try {
      console.log('Initializing IndexedDB cache...');
      this.db = await openDB<RomajiDBSchema>(this.dbName, this.version, {
        upgrade(db) {
          console.log('Upgrading database...');
          if (!db.objectStoreNames.contains('romaji')) {
            console.log('Creating romaji store...');
            db.createObjectStore('romaji');
          }
        },
      });
      this.isInitialized = true;
      console.log('IndexedDB cache initialized successfully');
    } catch (error) {
      console.error('Failed to initialize IndexedDB cache:', error);
      throw error;
    }
  }

  async get(key: string): Promise<string | undefined> {
    await this.initialize();
    try {
      const value = await this.db?.get(this.storeName, key);
      console.log('Cache get:', key, value ? 'hit' : 'miss');
      return value;
    } catch (error) {
      console.error('Error getting from cache:', error);
      return undefined;
    }
  }

  async set(key: string, value: string): Promise<void> {
    await this.initialize();
    try {
      console.log('Cache set:', key);
      await this.db?.put(this.storeName, value, key);
    } catch (error) {
      console.error('Error setting cache:', error);
      throw error;
    }
  }

  async getBatch(keys: string[]): Promise<Record<string, string>> {
    await this.initialize();
    const result: Record<string, string> = {};
    
    try {
      console.log('Cache batch get for', keys.length, 'keys');
      for (const key of keys) {
        const value = await this.db?.get(this.storeName, key);
        if (value) {
          result[key] = value;
        }
      }
      console.log('Cache batch get complete:', Object.keys(result).length, 'hits');
      return result;
    } catch (error) {
      console.error('Error in batch get:', error);
      return {};
    }
  }

  async setBatch(entries: Record<string, string>): Promise<void> {
    await this.initialize();
    try {
      console.log('Cache batch set for', Object.keys(entries).length, 'entries');
      const tx = this.db?.transaction([this.storeName], 'readwrite');
      if (!tx || !tx.store) {
        console.error('Failed to create transaction');
        return;
      }

      for (const [key, value] of Object.entries(entries)) {
        await tx.store.put(value, key);
      }
      
      await tx.done;
      console.log('Cache batch set complete');
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
      if (!tx || !tx.store) return { total: 0 };
      
      const count = await tx.store.count();
      return { total: count };
    } catch (error) {
      console.error('Error getting cache stats:', error);
      return { total: 0 };
    }
  }
}

export const romajiCache = new RomajiCache(); 