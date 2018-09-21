// @flow
import update from 'immutability-helper';
import { keyBy } from 'lodash';
import { create } from '../lib/redux';
import type { SyncStatus } from '../types/device';

export const {
  type: DEVICE_LIST,
  action: deviceList,
  reducer: deviceListReducer
} = create('DEVICE_LIST', {
  success: (state, meta, payload) => {
    const newState = update(state, { devices: { $set: keyBy(payload, 'id') } });

    return newState;
  }
});

export const {
  type: DEVICE_SELECT,
  action: deviceSelect,
  reducer: deviceSelectReducer
} = create('DEVICE_SELECT', {
  start: (state, meta: string) => {
    const newState = update(state, { selectedDevice: { $set: meta } });

    return newState;
  }
});

export type DeviceSyncUpdateMeta = {
  id: string,
  status: SyncStatus
};

export const {
  type: DEVICE_SYNC_UPDATE,
  action: deviceSyncUpdate,
  reducer: deviceSyncUpdateReducer
} = create('DEVICE_SYNC_UPDATE', {
  start: (state, meta: DeviceSyncUpdateMeta) => {
    if (!state.devices[meta.id]) {
      return state;
    }

    const newState = update(state, {
      devices: { [meta.id]: { syncStatus: { $set: meta.status } } }
    });

    return newState;
  }
});

export default [
  deviceListReducer,
  deviceSelectReducer,
  deviceSyncUpdateReducer
];
