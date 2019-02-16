// @flow
import React from 'react';
import { Observable } from 'rxjs';
import type { ActionsObservable } from 'redux-observable';
import {
  DEVICE_SYNC_UPDATE,
  DEVICE_LIST,
  deviceList,
  deviceSyncUpdate
} from '../ducks/devices';
import {
  SYNC_UNANNOUNCE,
  SYNC_ANNOUNCE,
  SYNC_START,
  syncStart,
  syncUnannounce
} from '../ducks/sync';
import { createDevice } from '../mocks/devices';
import type { Action } from '../types/redux';
import type { Device } from '../types/device';
import type { StoreState } from '../types/redux';
import Sync from '../api/sync';
import { applyDefaultsToDevice } from '../models/device';

export const syncUnannounceEpic = (action$: ActionsObservable<any>) =>
  action$
    .ofType(SYNC_UNANNOUNCE)
    .filter(action => action.status === 'Start')
    .flatMap(() => Sync.unannounce().map(() => syncUnannounce(null, null)));

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
      Sync.start(action.meta)
        .flatMap(response => {
          return Observable.of(deviceSyncUpdate(action.meta, response))
        })
        .catch(err => {
          return Observable.of(deviceSyncUpdate(action.meta, 'replication-error'))
        })
    );

export const deviceListEpic = (
  action$: ActionsObservable<Action<string, Device[]>>,
  store: StoreState
) =>
  action$
    .ofType(DEVICE_LIST)
    .filter(action => action.status === 'Start')
    .flatMap(() => {
      return Sync.list().map(devices => {
        return deviceList('', devices.map(applyDefaultsToDevice));
      })
    });


export default [
  syncUnannounceEpic,
  syncAnnounceEpic,
  syncStartEpic,
  deviceListEpic
];
