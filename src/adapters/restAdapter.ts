import type { Adapter, StoreItem } from '../core/types';

export function createRestAdapter(opts: {
  endpoint: string;
  headers?: Record<string, string>;
}): Adapter {
  return {
    async push(items: StoreItem[]) {
      const res = await fetch(opts.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(opts.headers || {}),
        },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) throw new Error('Sync failed');
      return res.json();
    },
  };
}
