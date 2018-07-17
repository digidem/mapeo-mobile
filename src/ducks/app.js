// @flow

import update from 'immutability-helper';
import { create } from '../lib/redux';

export const {
  type: APP_READY,
  action: appReady,
  reducer: appReadyReducer
} = create('APP_READY', {
  success: (state, meta, payload) => {
    console.log('appReady succeeded');
    const newState = update(state, {
      appReady: { $set: true }
    });

    return newState;
  }
});

export default [appReadyReducer];
