// @flow

import React from 'react';
import type { ActionsObservable } from 'redux-observable';
import {
  ANNOUNCE_SYNC,
  announceSync,
  DEVICE_LIST,
  deviceList
} from '../ducks/devices';
import { createDevice } from '../mocks/devices';
import type { Action } from '../types/redux';
import type { Device } from '../types/device';
import type { StoreState } from '../types/redux';
import Sync from '../api/sync';

const initialDevices = [
  {
    host: `Aldo's MacBook`,
    ip: '192.168.0.1',
    port: 123,
    selected: false,
    syncStatus: 'notStarted'
  },
  {
    host: `Cindy's MacBook`,
    ip: '192.168.0.1',
    port: 123,
    selected: false,
    syncStatus: 'notStarted'
  },
  {
    host: `Stephen's Laptop`,
    ip: '192.168.0.1',
    port: 123,
    selected: false,
    syncStatus: 'notStarted'
  },
  {
    host: `Karissa's MacBook`,
    ip: '192.168.0.1',
    port: 123,
    selected: false,
    syncStatus: 'notStarted'
  },
  {
    host: `Gregor's MacBook`,
    ip: '192.168.0.1',
    port: 123,
    selected: false,
    syncStatus: 'notStarted'
  }
];

// const initialDevices = [];

export const announceSyncEpic = (action$: ActionsObservable<any>) =>
  action$
    .ofType(ANNOUNCE_SYNC)
    .filter(action => action.status === 'Start')
    .flatMap(() => Sync.announce());

export const deviceListEpic = (
  action$: ActionsObservable<Action<string, Device[]>>,
  store: StoreState
) =>
  action$
    .ofType(DEVICE_LIST)
    .filter(action => action.status === 'Start')
    .flatMap(() =>
      Sync.list().map(devices =>
        deviceList(
          '',
          devices.map((d, i) =>
            createDevice({
              host: d.host,
              id: i.toString(),
              ip: d.ip,
              port: d.port,
              selected: false,
              syncStatus: null
            })
          )
        )
      )
    );

export default [announceSyncEpic, deviceListEpic];
