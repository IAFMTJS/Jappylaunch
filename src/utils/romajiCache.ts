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

  async initialize() {
    if (this.db) return;

    this.db = await openDB<RomajiDBSchema>(this.dbName, this.version, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('romaji')) {
          db.createObjectStore('romaji');
        }
      },
    });
  }

  async get(key: string): Promise<string | undefined> {
    await this.initialize();
    return this.db?.get(this.storeName, key);
  }

  async set(key: string, value: string): Promise<void> {
    await this.initialize();
    await this.db?.put(this.storeName, value, key);
  }

  async getBatch(keys: string[]): Promise<Record<string, string>> {
    await this.initialize();
    const result: Record<string, string> = {};
    
    for (const key of keys) {
      const value = await this.db?.get(this.storeName, key);
      if (value) {
        result[key] = value;
      }
    }
    
    return result;
  }

  async setBatch(entries: Record<string, string>): Promise<void> {
    await this.initialize();
    const tx = this.db?.transaction([this.storeName], 'readwrite');
    if (!tx || !tx.store) return;

    for (const [key, value] of Object.entries(entries)) {
      await tx.store.put(value, key);
    }
    
    await tx.done;
  }

  async clear(): Promise<void> {
    await this.initialize();
    await this.db?.clear(this.storeName);
  }
}

export const romajiCache = new RomajiCache(); 