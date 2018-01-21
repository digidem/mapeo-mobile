// @flow
import { create } from '@src/lib/redux';
import { update } from 'immutability-helper';

export const {
  type: OBSERVATION_LIST,
  action: observationList,
  reducer: observationListReducer,
} = create('OBSERVATION_LIST', {
  success: (state, action) =>
    update(state, {
      observations: action.payload,
    }),
});

export default [observationListReducer];
