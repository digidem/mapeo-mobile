// @flow
import { create } from '../lib/redux';

export const {
  type: OBSERVATION_LIST,
  action: observationList,
  reducer: observationListReducer,
} = create('OBSERVATION_LIST', {
  start: (state, action) => {
    console.log(action.meta);
  },
  success: (state, action) => {
    console.log(action.payload);
  },
});

export default [observationListReducer];
