// @flow

import React from 'react';
import type { ActionsObservable } from 'redux-observable';
import { DEVICE_LIST, deviceList } from '../ducks/devices';
import { createDevice } from '../mocks/devices';
import type { Action } from '../types/redux';
import type { Device } from '../types/device';

const initialDevices = [
  {
    name: `Aldo's MacBook`,
    selected: false
  },
  {
    name: `Cindy's MacBook`,
    selected: false
  },
  {
    name: `Gregor's MacBook`,
    selected: false
  }
];

export const deviceListEpic = (
  action$: ActionsObservable<Action<string, Device[]>>
) =>
  action$
    .ofType(DEVICE_LIST)
    .filter(action => action.status === 'Start')
    .map(() =>
      deviceList(
        '',
        initialDevices.map((d, i) =>
          createDevice({
            name: d.name,
            id: i.toString(),
            selected: d.selected
          })
        )
      )
    );

export default [deviceListEpic];
