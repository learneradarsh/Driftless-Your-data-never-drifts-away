export type SyncStatus =
  | 'offline'
  | 'queued'
  | 'syncing'
  | 'success'
  | 'conflict';

export type StoreItem = {
  id?: string | number;
  type: string;
  payload: any;
  createdAt: number;
  version?: number;
};

export type AdapterResult = {
  id?: string | number;
  status?: 'ok' | 'conflict' | 'error';
  conflictWith?: any;
};

export type Adapter = {
  push: (items: StoreItem[]) => Promise<AdapterResult[]>;
};
