// @flow
import update from 'immutability-helper';
import { create } from '../lib/redux';
import type { StoreState } from '../types/redux';
import { lookup } from 'mime-types';
import {
  resourcePending,
  resourceSuccess,
  resourceFailed
} from '../lib/resource';

export type MediaLoadingMeta = {
  mediaId: string,
  type: string,
  observation: string,
  source: string,
  generateThumbnail: boolean
};

export const {
  type: MEDIA_LOADING,
  action: mediaLoading,
  reducer: mediaLoadingReducer
} = create('MEDIA_LOADING', {
  start: (state, meta) => {
    const { mediaId, type, observation } = meta;

    return update(state, {
      attachments: {
        [mediaId]: {
          $set: resourcePending({
            id: mediaId,
            type,
            observation
          })
        }
      }
    });
  },
  error: (state, meta, error) => {
    return update(state, {
      attachments: {
        [meta.mediaId]: {
          $set: resourceFailed(error, {
            source: meta.source,
            generateThumbnail: meta.generateThumbnail
          })
        }
      }
    });
  }
});

export const {
  type: MEDIA_DELETE,
  action: mediaDelete,
  reducer: mediaDeleteReducer
} = create('MEDIA_DELETE', {
  start: (state, meta) =>
    update(state, {
      attachments: {
        $unset: [meta]
      }
    })
});

export type MediaSaveMeta = {
  observationId?: string,
  source: string,
  generateThumbnail: boolean
};

export const {
  type: MEDIA_SAVE,
  action: mediaSave,
  reducer: mediaSaveReducer
} = create('MEDIA_SAVE', {
  success: (state, meta, payload) => {
    const type = lookup(payload);

    return update(state, {
      attachments: {
        [payload]: {
          $set: resourceSuccess({
            type,
            id: payload
          })
        }
      }
    });
  }
});

export type MediaResizeMeta = {
  observationId?: string,
  source: string
};

export const {
  type: MEDIA_RESIZE,
  action: mediaResize,
  reducer: mediaResizeReducer
} = create('MEDIA_RESIZE', {});

export default [mediaSaveReducer, mediaDeleteReducer, mediaLoadingReducer];
