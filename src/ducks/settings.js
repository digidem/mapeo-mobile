// @flow

import update from 'immutability-helper';
import { create } from '../lib/redux';
import type { StoreState } from '../types/redux';

export const {
  type: GPS_FORMAT_SETTINGS_SET,
  action: gpsFormatSettingsSet,
  reducer: gpsFormatSettingsSetReducer
} = create('GPS_FORMAT_SETTINGS_SET', {
  start: (state, meta) => {
    const newState = update(state, {
      settings: {
        gpsFormat: { $set: meta }
      }
    });

    return newState;
  }
});

export default [gpsFormatSettingsSetReducer];
