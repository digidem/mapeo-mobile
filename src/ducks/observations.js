// @flow
import { create } from '@src/lib/redux';
import update from 'immutability-helper';
import { keyBy } from 'lodash';
import { createSelector } from '@src/lib/selector';
import { StoreState } from '@types/redux';
import { Observation } from '@types/observation';

export const {
  type: OBSERVATION_LIST,
  action: observationList,
  reducer: observationListReducer,
} = create('OBSERVATION_LIST', {
  success: (state, action) => {
    const newState = update(state, {
      observations: { $set: keyBy(action.payload, 'id') },
    });

    return newState;
  },
});

export const selectContact = createSelector(
  [
    (state: StoreState, id: string): Observation => state.app.observations[id],
  ],
  (observation: Observation): Observation => observation,
  (observation: Observation, id: string): string => id,
);

export default [observationListReducer];
