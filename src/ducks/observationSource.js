// @flow

import update from 'immutability-helper';
import { create } from '../lib/redux';

export const {
  type: OBSERVATION_SOURCE,
  action: observationSource,
  reducer: observationSourceReducer
} = create('OBSERVATION_SOURCE', {
  success: (state, action) => {
    const newState = update(state, {
      observationSource: {
        source: { $set: action.meta }
      }
    });

    return newState;
  }
});

export default [observationSourceReducer];
