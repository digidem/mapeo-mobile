// @flow
import { Action } from '../types/redux';
import { Observable } from 'rxjs';
import shortid from 'shortid';
import { lookup } from 'mime-types';
import type { ActionsObservable } from 'redux-observable';
import type { StoreState } from '../types/redux';
import Media from '../api/media';
import {
  MEDIA_SAVE,
  mediaSave,
  MEDIA_RESIZE,
  mediaResize,
  MEDIA_LOADING,
  mediaLoading,
  mediaDelete
} from '../ducks/media';
import type { MediaSaveMeta } from '../ducks/media';
import {
  observationUpdateSave,
  observationAttachmentUpdate
} from '../ducks/observations';
import { generateThumbnail } from '../lib/media';

export const mediaLoadingEpic = (
  action$: ActionsObservable<Action<MediaSaveMeta, Object>>,
  store: any
) =>
  action$
    .ofType(MEDIA_LOADING)
    .filter(action => action.status === 'Start')
    .flatMap(action => {
      const { source } = action.meta;
      const backup = action.meta.generateThumbnail
        ? generateThumbnail(source).flatMap(resized =>
            Media.backup(source, resized.uri)
          )
        : Media.backup(source);

      return backup.flatMap(id => {
        const { mediaId, observation } = action.meta;
        const observationId = store.getState().app.attachments[mediaId]
          .observation;
        const meta = {
          observationId: observation,
          source,
          generateThumbnail
        };

        return Observable.merge(
          Observable.of(mediaSave(meta, id)),
          Observable.of(mediaDelete(mediaId)),
          Observable.of(
            observationAttachmentUpdate({
              tempId: mediaId,
              observation:
                observationId === 'selected' ? undefined : observationId,
              mediaId: id
            })
          )
        );
      });
    });

export const mediaSaveEpic = (
  action$: ActionsObservable<Action<MediaSaveMeta, Object>>,
  store: any
) =>
  action$
    .ofType(MEDIA_SAVE)
    .filter(action => action.status === 'Start')
    .map(action => {
      const { meta } = action;
      const id = shortid.generate();
      const type = lookup(meta.source) || '';
      const observation = meta.observationId || 'selected';

      return mediaLoading({
        mediaId: id,
        observation,
        type,
        source: meta.source,
        generateThumbnail: meta.generateThumbnail
      });
    });

export default [mediaLoadingEpic, mediaSaveEpic];
