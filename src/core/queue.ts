import { StoreItem } from "./types";

export class Queue {
  private storeKey: string;
  constructor(storeKey = 'driftless:queue') {
    this.storeKey = storeKey;
  }

  private read(): StoreItem[] {
    try {
      const raw = localStorage.getItem(this.storeKey);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  private write(items: StoreItem[]) {
    localStorage.setItem(this.storeKey, JSON.stringify(items));
  }

  push(item: StoreItem) {
    const items = this.read();
    items.push(item);
    this.write(items);
  }

  all() {
    return this.read();
  }

  clear() {
    this.write([]);
  }

  removeByIds(ids: Array<string | number>) {
    const items = this.read().filter((i) => !ids.includes(i.id as any));
    this.write(items);
  }
}
