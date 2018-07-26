// @flow
import update from 'immutability-helper';
import { keyBy } from 'lodash';
import { create } from '../lib/redux';

export const {
  type: PRESETS_SELECT,
  action: presetsSelect,
  reducer: presetsSelectReducer
} = create('PRESETS_SELECT', {
  start: (state, meta) =>
    update(state, {
      selectedPreset: { $set: meta }
    })
});

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

export const {
  type: PRESETS_LIST,
  action: presetsList,
  reducer: presetsListReducer
} = create('PRESETS_LIST', {
  success: (state, meta, payload) =>
    update(state, {
      presets: { $set: payload }
    })
});

export default [
  presetsSelectReducer,
  presetsIconsListReducer,
  presetsListReducer
];
