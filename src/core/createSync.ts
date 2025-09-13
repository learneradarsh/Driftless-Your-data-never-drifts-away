import { Queue } from './queue';
import type { Adapter, StoreItem, SyncStatus } from './types';

export function createSync(opts: {
  adapter: Adapter;
  pollIntervalMs?: number;
}) {
  const queue = new Queue();
  let status: SyncStatus = 'offline';
  const listeners: Record<string, Function[]> = {};

  function emit(event: string, payload: any) {
    (listeners[event] || []).forEach((fn) => fn(payload));
  }

  async function trySync() {
    const items = queue.all();
    if (!items.length) return;
    if (!navigator.onLine) {
      status = 'offline';
      emit('status', status);
      return;
    }

    status = 'syncing';
    emit('status', status);

    try {
      const res = await opts.adapter.push(items);
      // assume adapter returns array of processed ids
      const processedIds = res.map((r) => r.id).filter(Boolean);
      queue.removeByIds(processedIds);
      status = 'success';
      emit('status', status);
    } catch (err) {
      // simplistic: remain queued and retry later
      status = 'queued';
      emit('status', status);
    }
  }

  // auto-poll
  const interval = setInterval(() => trySync(), opts.pollIntervalMs || 5000);

  window.addEventListener('online', () => trySync());

  return {
    store(type: string, payload: any) {
      const item: StoreItem = {
        id: Date.now(),
        type,
        payload,
        createdAt: Date.now(),
      };
      queue.push(item);
      emit('status', 'queued');
      // attempt immediate sync
      trySync();
    },
    on(event: 'status' | 'conflict', cb: Function) {
      listeners[event] = listeners[event] || [];
      listeners[event].push(cb);
    },
    stop() {
      clearInterval(interval);
    },
    _internal: { queue },
  };
}
