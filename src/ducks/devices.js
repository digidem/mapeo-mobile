// @flow

import update from 'immutability-helper';
import { keyBy } from 'lodash';
import { create } from '../lib/redux';

export const {
  type: SYNC_ANNOUNCE,
  action: syncAnnounce,
  reducer: syncAnnounceReducer
} = create('SYNC_ANNOUNCE', {});

export const {
  type: SYNC_START,
  action: syncStart,
  reducer: syncStartReducer
} = create('SYNC_START', {
  start: (state, action) => {
    const newState = update(state, {
      selectedDevice: {
        syncStatus: { $set: 'requested' }
      }
    });

    return newState;
  },
  success: (state, action) => {
    const newState = update(state, {
      selectedDevice: {
        syncStatus: { $set: action.payload }
      }
    });

    return newState;
  }
});

export const {
  type: DEVICE_LIST,
  action: deviceList,
  reducer: deviceListReducer
} = create('DEVICE_LIST', {
  success: (state, meta, payload) => {
    const newState = update(state, {
      devices: { $set: keyBy(payload, 'id') }
    });

    return newState;
  }
});

export const {
  type: DEVICE_TOGGLE_SELECT,
  action: deviceToggleSelect,
  reducer: deviceToggleSelectReducer
} = create('DEVICE_TOGGLE_SELECT', {
  start: (state, meta) => {
    const newState = update(state, {
      devices: {
        [meta.id]: {
          $toggle: ['selected']
        }
      }
    });

    return newState;
  }
});

export const {
  type: DEVICE_SELECT,
  action: deviceSelect,
  reducer: deviceSelectReducer
} = create('DEVICE_SELECT', {
  start: (state, meta) => {
    const newState = update(state, {
      selectedDevice: {
        $set: meta
      }
    });

    return newState;
  }
});

export const {
  type: DEVICE_SYNC_UPDATE,
  action: deviceSyncUpdate,
  reducer: deviceSyncUpdateReducer
} = create('DEVICE_SYNC_UPDATE', {
  start: (state, meta) => {
    const newState = update(state, {
      devices: {
        [meta.id]: {
          $set: meta
        }
      }
    });

    return newState;
  }
});

export default [
  deviceListReducer,
  deviceToggleSelectReducer,
  deviceSelectReducer,
  deviceSyncUpdateReducer,
  syncStartReducer
];
