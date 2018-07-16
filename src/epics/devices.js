// @flow

import React from 'react';
import type { ActionsObservable } from 'redux-observable';
import {
  SYNC_ANNOUNCE,
  SYNC_START,
  syncStart,
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
    name: `Aldo's MacBook`,
    host: '192.168.0.1',
    port: 123,
    selected: false,
    syncStatus: 'notStarted'
  },
  {
    name: `Cindy's MacBook`,
    host: '192.168.0.1',
    port: 123,
    selected: false,
    syncStatus: 'notStarted'
  },
  {
    name: `Stephen's Laptop`,
    host: '192.168.0.1',
    port: 123,
    selected: false,
    syncStatus: 'notStarted'
  },
  {
    name: `Karissa's MacBook`,
    host: '192.168.0.1',
    port: 123,
    selected: false,
    syncStatus: 'notStarted'
  },
  {
    name: `Gregor's MacBook`,
    host: '192.168.0.1',
    port: 123,
    selected: false,
    syncStatus: 'notStarted'
  }
];

// const initialDevices = [];

export const syncAnnounceEpic = (action$: ActionsObservable<any>) =>
  action$
    .ofType(SYNC_ANNOUNCE)
    .filter(action => action.status === 'Start')
    .flatMap(() => Sync.announce().map(response => deviceList('')));

export const syncStartEpic = (action$: ActionsObservable<any>) =>
  action$
    .ofType(SYNC_START)
    .filter(action => action.status === 'Start')
    .flatMap(action =>
      Sync.start(action.meta).map(response => {
        return syncStart(action.meta, response);
      })
    );

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
              name: d.name,
              id: i.toString(),
              host: d.host,
              port: d.port,
              selected: false,
              syncStatus: d.status,
              message: d.message
            })
          )
        )
      )
    );

export default [syncAnnounceEpic, syncStartEpic, deviceListEpic];
