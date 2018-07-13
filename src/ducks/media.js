// @flow
import update from 'immutability-helper';
import { create } from '../lib/redux';
import type { StoreState } from '../types/redux';
import shortid from 'shortid';
import { lookup } from 'mime-types';
import {
  resourcePending,
  resourceSuccess,
  resourceFailed,
} from '../lib/resource';

export type MediaSaveToCameraRollMeta = {
  observationId?: string,
  source: string,
};

export const {
  type: MEDIA_SAVE_TO_CAMERA_ROLL,
  action: mediaSaveToCameraRoll,
  reducer: mediaSaveToCameraRollReducer,
} = create('MEDIA_SAVE_TO_CAMERA_ROLL', {
  start: (state, action) => {
    const tempId = shortid.generate();
    const type = lookup(action.meta.source) || '';
    const observation = action.meta.observationId || 'selected';

    return update(state, {
      attachments: {
        [tempId]: {
          $set: resourcePending({
            id: tempId,
            type,
            observation,
          }),
        },
      },
    });
  },
});

export type MediaSaveMeta = {
  mediaId: string,
  cameraRollUri: string,
  resizedUri: string,
};

export const {
  type: MEDIA_SAVE,
  action: mediaSave,
  reducer: mediaSaveReducer,
} = create('MEDIA_SAVE', {
  success: (state, action) => {
    const type = action.meta.cameraRollUri && lookup(action.meta.cameraRollUri);

    if (!action.payload) {
      return state;
    }

    return update(state, {
      attachments: {
        [action.payload.id]: {
          $set: resourceSuccess({
            type,
            id: action.payload.id,
          }),
        },
      },
    });
  },
  error: (state, action) => {
    if (!action.error || !action.meta.mediaId) {
      return state;
    }

    return update(state, {
      attachments: {
        [action.meta.mediaId]: {
          $set: resourceFailed(),
        },
      },
    });
  },
});

export type MediaResizeMeta = {
  mediaId: string,
  cameraRollUri: string,
};

export const {
  type: MEDIA_RESIZE,
  action: mediaResize,
  reducer: mediaResizeReducer,
} = create('MEDIA_RESIZE', {});

export default [mediaSaveReducer, mediaSaveToCameraRollReducer];
