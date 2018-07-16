// @flow

import update from 'immutability-helper';
import { keyBy } from 'lodash';
import { create } from '../lib/redux';

export const {
  type: FIELD_LIST,
  action: fieldList,
  reducer: fieldListReducer
} = create('FIELD_LIST', {
  success: (state, meta, payload) => {
    const newState = update(state, {
      fields: { $set: keyBy(payload, 'id') }
    });

    return newState;
  }
});

export const {
  type: PRESETS_SELECT,
  action: presetsSelect,
  reducer: presetsSelectReducer
} = create('PRESETS_SELECT', {});

export const {
  type: PRESETS_ICONS_LIST,
  action: presetsIconsList,
  reducer: presetsIconsListReducer
} = create('PRESETS_ICONS_LIST', {
  success: (state, meta, payload) =>
    update(state, {
      icons: { $set: payload }
    })
});

export default [
  fieldListReducer,
  presetsSelectReducer,
  presetsIconsListReducer
];
