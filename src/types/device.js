// @flow

export type SyncStatus =
  | 'notStarted'
  | 'requested'
  | 'syncing'
  | 'stopped'
  | 'completed';
export interface Device {
  id: string;
  name: string;
  selected: boolean;
  syncStatus: SyncStatus;
}
