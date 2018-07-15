// @flow
import { Action } from '../types/redux';
import { Observable } from 'rxjs';
import type { ActionsObservable } from 'redux-observable';
import type { StoreState } from '../types/redux';
import Media from '../api/media';
import {
  MEDIA_SAVE,
  mediaSave,
  MEDIA_SAVE_TO_CAMERA_ROLL,
  mediaSaveToCameraRoll,
  MEDIA_RESIZE,
  mediaResize
} from '../ducks/media';
import type { MediaSaveMeta, MediaSaveToCameraRollMeta } from '../ducks/media';
import {
  observationUpdateSave,
  observationAttachmentUpdate
} from '../ducks/observations';
import { saveToCameraRoll } from '../lib/media';
import * as ImageResizer from 'react-native-image-resizer';

export const mediaSaveToCameraRollEpic = (
  action$: ActionsObservable<Action<MediaSaveToCameraRollMeta, Object>>,
  store: StoreState
) =>
  action$
    .ofType(MEDIA_SAVE_TO_CAMERA_ROLL)
    .filter(action => action.status === 'Start')
    .flatMap(action =>
      saveToCameraRoll(action.meta.source).map(uri =>
        mediaResize({
          mediaId: action.meta.mediaId,
          cameraRollUri: uri
        })
      )
    );

export const mediaSaveEpic = (
  action$: ActionsObservable<Action<MediaSaveMeta, Object>>,
  store: any
) =>
  action$
    .ofType(MEDIA_SAVE)
    .filter(action => action.status === 'Start')
    .flatMap(
      action =>
        Media.backup(action.meta.cameraRollUri, action.meta.resizedUri).flatMap(
          id => {
            const { mediaId } = action.meta;
            const observationId = store.getState().app.attachments[mediaId]
              .observation;

            return Observable.merge(
              Observable.of(mediaSave(action.meta, id)),
              Observable.of(
                observationAttachmentUpdate({
                  tempId: mediaId,
                  observation:
                    observationId === 'selected' ? undefined : observationId,
                  mediaId: id
                })
              )
            );
          }
        )
      // .catch(err => Observable.of(mediaSave(action.meta, err))),
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
          action.meta.cameraRollUri,
          300,
          300,
          'JPEG',
          50
        )
      ).map(resizedImage =>
        mediaSave({
          resizedUri: resizedImage.uri,
          cameraRollUri: action.meta.cameraRollUri,
          mediaId: action.meta.mediaId
        })
      )
    );

export default [mediaSaveToCameraRollEpic, mediaSaveEpic, mediaResizeEpic];
