import type { Adapter, StoreItem, AdapterResult } from '../core/types';

export function createRestAdapter(opts: {
  endpoint: string;
  headers?: Record<string, string>;
}): Adapter {
  return {
    async push(items: StoreItem[]): Promise<AdapterResult[]> {
      const res = await fetch(opts.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(opts.headers || {}),
        },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) throw new Error('Sync failed');
      // Expect server to return array of results for each item
      return (await res.json()) as AdapterResult[];
    },
  };
}
