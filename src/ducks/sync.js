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
  type: SYNC_UNANNOUNCE,
  action: syncUnannounce,
  reducer: syncUnannounceReducer
} = create('SYNC_UNANNOUNCE', {});

export const {
  type: SYNC_START,
  action: syncStart,
  reducer: syncStartReducer
} = create('SYNC_START', {});

export default [];
