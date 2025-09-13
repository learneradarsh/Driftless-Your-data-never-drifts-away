import { Queue } from './queue';
import { v4 as uuidv4 } from 'uuid';
import type { Adapter, StoreItem, SyncStatus, AdapterResult } from './types';

export function createSync(opts: {
  adapter: Adapter;
  pollIntervalMs?: number;
}) {
  const queue = new Queue();
  let status: SyncStatus = 'offline';
  const listeners: Record<string, Function[]> = {};
  let onConflictHandler:
    | ((local: StoreItem, remote: any) => StoreItem | Promise<StoreItem>)
    | null = null;

  function emit(event: string, payload: any) {
    (listeners[event] || []).forEach((fn) => fn(payload));
  }

  async function trySync() {
    const items = await queue.all();
    if (!items.length) return;
    if (!navigator.onLine) {
      status = 'offline';
      emit('status', status);
      return;
    }

    status = 'syncing';
    emit('status', status);

    try {
      const res: AdapterResult[] = await opts.adapter.push(items);

      const processedIds: Array<string | number> = [];

      for (let i = 0; i < res.length; i++) {
        const r = res[i];
        const local = items[i];
        if (r.status === 'ok') {
          processedIds.push(r.id ?? local.id ?? -1);
        } else if (r.status === 'conflict') {
          status = 'conflict';
          emit('status', status);
          if (onConflictHandler) {
            const resolved = await onConflictHandler(local, r.conflictWith);
            const merged: StoreItem = {
              ...resolved,
              version: (resolved.version || 0) + 1,
            };
            await queue.push(merged);
          } else {
            emit('conflict', { local, remote: r.conflictWith });
          }
        }
      }

      if (processedIds.length) {
        await queue.removeByIds(processedIds);
      }

      const remaining = await queue.all();
      status = remaining.length ? 'queued' : 'success';
      emit('status', status);
    } catch (err) {
      status = 'queued';
      emit('status', status);
    }
  }

  const interval = setInterval(() => trySync(), opts.pollIntervalMs || 5000);

  window.addEventListener('online', () => trySync());

  return {
    async store(type: string, payload: any) {
      const item: StoreItem = {
        id: uuidv4(),
        type,
        payload,
        createdAt: Date.now(),
        version: 1,
      };
      await queue.push(item);
      emit('status', 'queued');
      trySync();
    },
    on(event: 'status' | 'conflict', cb: Function) {
      listeners[event] = listeners[event] || [];
      listeners[event].push(cb);
    },
    onConflict(
      fn: (local: StoreItem, remote: any) => StoreItem | Promise<StoreItem>
    ) {
      onConflictHandler = fn;
    },
    stop() {
      clearInterval(interval);
    },
    _internal: { queue },
  };
}
