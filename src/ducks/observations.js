// @flow
import { create } from '@src/lib/redux';
import update from 'immutability-helper';
import { keyBy } from 'lodash';

export const {
  type: OBSERVATION_LIST,
  action: observationList,
  reducer: observationListReducer,
} = create('OBSERVATION_LIST', {
  success: (state, action) => update(state, {
    observations: { $set: keyBy(action.payload, 'id') },
  }),
});

export default [observationListReducer];
