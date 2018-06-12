// @flow

export type SyncStatus = 'notStarted' | 'requested' | 'syncing' | 'complete';
export interface Device {
  id: string;
  name: string;
  selected: boolean;
  syncStatus: SyncStatus;
}
