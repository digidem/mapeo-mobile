// @flow

import update from 'immutability-helper';
import { create } from '../lib/redux';
import {
  resourcePending,
  resourceSuccess,
  resourceFailed
} from '../lib/resource';

export const {
  type: GPS_PENDING,
  action: gpsPending,
  reducer: gpsPendingReducer
} = create('GPS_PENDING', {
  start: (state, meta) => {
    const newState = update(state, {
      gps: { $set: resourcePending(meta) }
    });

    return newState;
  }
});

export const { type: GPS_SET, action: gpsSet, reducer: gpsSetReducer } = create(
  'GPS_SET',
  {
    start: (state, meta) => {
      const newState = update(state, {
        gps: { $set: resourceSuccess(meta) }
      });

      return newState;
    }
  }
);

export const {
  type: GPS_FAILED,
  action: gpsFailed,
  reducer: gpsFailedReducer
} = create('GPS_FAILED', {
  start: (state, meta) => {
    const newState = update(state, {
      gps: { $set: resourceFailed(meta) }
    });

    return newState;
  }
});

export default [gpsPendingReducer, gpsSetReducer, gpsFailedReducer];
