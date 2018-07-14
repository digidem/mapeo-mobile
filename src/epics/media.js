// @flow
import { Action } from '../types/redux';
import { Observable } from 'rxjs';
import type { ActionsObservable } from 'redux-observable';
import type { StoreState } from '../types/redux';
import Media from '../api/media';
import {
  MEDIA_SAVE,
  mediaSave,
  MEDIA_BACKUP,
  mediaBackup,
  MEDIA_RESIZE,
  mediaResize
} from '../ducks/media';
import type { MediaSaveMeta, MediaBackupMeta } from '../ducks/media';
import { observationUpdateSave } from '../ducks/observations';
import { saveToCameraRoll } from '../lib/media';
import * as ImageResizer from 'react-native-image-resizer';

export const mediaSaveEpic = (
  action$: ActionsObservable<Action<MediaSaveMeta, Object>>,
  store: StoreState
) =>
  action$
    .ofType(MEDIA_SAVE)
    .filter(action => action.status === 'Start')
    .flatMap(action =>
      saveToCameraRoll(action.meta.source).flatMap(uri =>
        Observable.merge(
          Observable.of(
            mediaBackup({
              observationId: action.meta.observationId,
              mediaId: action.meta.mediaId,
              cameraRollUri: uri
            })
          )
        )
      )
    );

export const mediaBackupEpic = (
  action$: ActionsObservable<Action<MediaBackupMeta, Object>>,
  store: StoreState
) =>
  action$
    .ofType(MEDIA_BACKUP)
    .filter(action => action.status === 'Start')
    .flatMap(action =>
      Media.backup(action.meta.cameraRollUri)
        .map(backup =>
          observationUpdateSave({
            id: action.meta.observationId,
            mediaBackup: store.observations[action.meta.observationId].concat(
              backup
            )
          })
        )
        .catch(err => Observable.of(observationUpdateSave(action.meta, err)))
    );

export const mediaResizeEpic = (
  action$: ActionsObservable<Action<string, string>>,
  store: StoreState
) =>
  action$
    .ofType(MEDIA_RESIZE)
    .filter(action => action.status === 'Start')
    .flatMap(action =>
      Observable.from(
        ImageResizer.default.createResizedImage(
          action.meta,
          300,
          300,
          'JPEG',
          50
        )
      ).map(resizedImage => mediaResize(action.meta, resizedImage.uri))
    );

export default [mediaSaveEpic, mediaBackupEpic, mediaResizeEpic];
