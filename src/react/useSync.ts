import { useEffect, useState } from 'react';
import { createSync } from '../core/createSync';
import { createRestAdapter } from '../adapters/restAdapter';

export function useSync(namespace = 'default', endpoint = '/api/sync') {
  const [status, setStatus] = useState<
    'offline' | 'queued' | 'syncing' | 'success' | 'conflict'
  >('offline');
  const adapter = createRestAdapter({ endpoint });
  const sync = createSync({ adapter, pollIntervalMs: 3000 });

  useEffect(() => {
    sync.on('status', (s: any) => setStatus(s));
    // cleanup
    return () => sync.stop();
  }, []);

  return {
    store: (payload: any) => sync.store(namespace, payload),
    status,
    onConflict: (fn: any) => sync.onConflict(fn),
    _internal: sync._internal,
  };
}
