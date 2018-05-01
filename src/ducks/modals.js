// @flow

import update from 'immutability-helper';
import { create } from '../lib/redux';
import type { StoreState } from '../types/redux';

export const {
  type: MODAL_SHOW,
  action: modalShow,
  reducer: modalShowReducer
} = create('MODAL_SHOW', {
  start: (state, action) => {
    const newState = update(state, {
      modals: {
        [action.meta]: { $set: true }
      }
    });

    return newState;
  }
});

export const {
  type: MODAL_HIDE,
  action: modalHide,
  reducer: modalHideReducer
} = create('MODAL_HIDE', {
  start: (state, action) => {
    const newState = update(state, {
      modals: {
        [action.meta]: { $set: false }
      }
    });

    return newState;
  }
});

export default [modalShowReducer, modalHideReducer];
