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
};

export type Adapter = {
  push: (items: StoreItem[]) => Promise<any[]>;
};
