// @flow

export type SyncStatus =
  | 'notStarted'
  | 'requested'
  | 'syncing'
  | 'stopped'
  | 'completed';
export interface Device {
  id: string;
  ip: string;
  host: string;
  port: number;
  selected: boolean;
  syncStatus: SyncStatus;
}
