// @flow

export type SyncStatus =
  | null
  | 'replication-started'
  | 'replication-progress'
  | 'replication-stopped'
  | 'replication-complete';
export interface Device {
  id: string;
  name: string;
  host: string;
  port: number;
  selected: boolean;
  syncStatus: SyncStatus;
}
