import { openDB, IDBPDatabase } from 'idb';
import type { StoreItem } from './types';

const DB_NAME = 'driftless-db';
const STORE_NAME = 'queue';

export class Queue {
  private dbPromise: Promise<IDBPDatabase>;

  constructor() {
    this.dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      },
    });
  }

  async push(item: StoreItem) {
    const db = await this.dbPromise;
    await db.put(STORE_NAME, item);
  }

  async all() {
    const db = await this.dbPromise;
    return (await db.getAll(STORE_NAME)) as StoreItem[];
  }

  async clear() {
    const db = await this.dbPromise;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    await tx.store.clear();
    await tx.done;
  }

  async removeByIds(ids: Array<string | number>) {
    const db = await this.dbPromise;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    for (const id of ids) {
      await tx.store.delete(id as any);
    }
    await tx.done;
  }
}
