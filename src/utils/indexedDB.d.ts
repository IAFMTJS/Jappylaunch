export interface IndexedDBConfig {
  name: string;
  version: number;
  stores: {
    name: string;
    keyPath: string;
    autoIncrement?: boolean;
    indexes?: {
      name: string;
      keyPath: string;
      unique?: boolean;
    }[];
  }[];
}

export function openIndexedDB(): Promise<IDBDatabase>;
export function clearStore(storeName: string): Promise<void>;
export function deleteDB(): Promise<void>; 