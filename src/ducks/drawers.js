// @flow

import update from 'immutability-helper';
import { create } from '../lib/redux';
import type { StoreState } from '../types/redux';

export const {
  type: DRAWER_OPEN,
  action: drawerOpen,
  reducer: drawerOpenReducer
} = create('DRAWER_OPEN', {
  start: (state, meta) => {
    const newState = update(state, {
      drawers: {
        [meta]: { $set: true }
      }
    });

    return newState;
  }
});

export const {
  type: DRAWER_CLOSE,
  action: drawerClose,
  reducer: drawerCloseReducer
} = create('DRAWER_CLOSE', {
  start: (state, meta) => {
    const newState = update(state, {
      drawers: {
        [meta]: { $set: false }
      }
    });

    return newState;
  }
});

export default [drawerOpenReducer, drawerCloseReducer];
