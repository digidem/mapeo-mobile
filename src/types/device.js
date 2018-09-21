// @flow
export type SyncStatus =
  | null
  | 'replication-started'
  | 'replication-progress'
  | 'replication-error'
  | 'replication-stopped'
  | 'replication-complete';

export type Device = {
  id: string,
  name: string,
  host: string,
  port: number,
  syncStatus: SyncStatus
};
