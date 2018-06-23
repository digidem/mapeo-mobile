import update from 'immutability-helper';
import { create } from '../lib/redux';
import type { StoreState } from '../types/redux';

export type MediaSaveMeta = {
  observationId: string,
  mediaId: string,
  source: string
};

export const {
  type: MEDIA_SAVE,
  action: mediaSave,
  reducer: mediaSaveReducer
} = create('MEDIA_SAVE', {});

export type MediaBackupMeta = {
  mediaId: string,
  observationId: string,
  cameraRollUri: string
};

export const {
  type: MEDIA_BACKUP,
  action: mediaBackup,
  reducer: mediaBackupReducer
} = create('MEDIA_BACKUP', {});

export default [mediaBackupReducer, mediaSaveReducer];
