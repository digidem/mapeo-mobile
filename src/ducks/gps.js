// @flow

import update from 'immutability-helper';
import { create } from '../lib/redux';
import { resourceSuccess } from '../lib/resource';

export const { type: GPS_SET, action: gpsSet, reducer: gpsSetReducer } = create(
  'GPS_SET',
  {
    start: (state, action) => {
      const newState = update(state, {
        gps: { $set: resourceSuccess(action.meta) }
      });

      return newState;
    }
  }
);

export default [gpsSetReducer];
