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
  observationUpdate,
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
        ? generateThumbnail(source).flatMap(resized => {
            return Media.backup(source, resized.uri);
          })
        : Media.backup(source);
      const { mediaId, observation } = action.meta;
      const observationId = store.getState().attachments[mediaId]
        .observation;
      const meta = {
        observationId: observation,
        source,
        generateThumbnail
      };

      return backup
        .flatMap(({ id, file, thumbnail }) => {
          return Observable.merge(
            Observable.of(
              mediaSave(meta, {
                resizedUri: thumbnail,
                cacheUri: file,
                serverId: id
              })
            ),
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
        })
        .catch(err => {
          return Observable.of(mediaLoading(action.meta, err));
        });
    });

export const mediaSaveEpic = (
  action$: ActionsObservable<Action<MediaSaveMeta, Object>>,
  store: any
) =>
  action$
    .ofType(MEDIA_SAVE)
    .filter(action => action.status === 'Start')
    .flatMap(action => {
      const { meta } = action;
      const id = shortid.generate();
      const type = lookup(meta.source) || '';
      const observation = meta.observationId || 'selected';

      let updatedObservation = store.getState().selectedObservation;
      if (meta.observationId) {
        updatedObservation = store.getState().observations[
          meta.observationId
        ];
      }

      return Observable.merge(
        Observable.of(
          mediaLoading({
            mediaId: id,
            observation,
            type,
            source: meta.source,
            generateThumbnail: meta.generateThumbnail
          })
        ),
        Observable.of(
          observationUpdate({
            ...updatedObservation,
            attachments: updatedObservation.attachments.concat([id])
          })
        )
      );
    });

export default [mediaLoadingEpic, mediaSaveEpic];
