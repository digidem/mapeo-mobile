// @flow

import update from 'immutability-helper';
import {keyBy} from 'lodash';
import {create} from '../lib/redux';
import {createSelector} from '../lib/selector';
import type {StoreState} from '../types/redux';
import type {Observation} from '../types/observation';

export const {
  type: OBSERVATION_LIST,
  action: observationList,
  reducer: observationListReducer
} = create('OBSERVATION_LIST', {
  success: (state, action) => {
    const observations = keyBy(action.payload, 'id');

    if (state.observations) {
      Object.keys(state.observations).forEach(id => observations[id] = {
        ...observations[id],
        ...state.observations[id],
      });
    }

    const newState = update(state, {observations: {$set: observations}});

    return newState;
  }
});

export const {
  type: OBSERVATION_CREATE,
  action: observationCreate,
  reducer: observationCreateReducer
} = create('OBSERVATION_CREATE', {
  start: (state, action) => {
    const observation = action.meta;

    if (!observation.lat && !observation.lon && state.gps.data) {
      observation.lat = state.gps.data.latitude;
      observation.lon = state.gps.data.longitude;
    }

    const newState = update(state, {selectedObservation: {$set: observation}});

    return newState;
  },
  success: (state, action) => {
    const newState = update(state, {selectObservation: {$set: action.payload}});

    return newState;
  }
});

export const {
  type: OBSERVATION_UPDATE,
  action: observationUpdate,
  reducer: observationUpdateReducer
} = create('OBSERVATION_UPDATE', {
  start: (state, action) => {
    let newState;
    if (state.selectedObservation &&
        action.meta.id === state.selectedObservation.id) {
      newState = update(state, {
        selectedObservation: {
          $set: {...state.selectedObservation, ...action.meta},
        }
      });
    } else {
      newState = update(state, {
        observations: {
          [action.meta.id]: {
            $set: {...state.observations[action.meta.id], ...action.meta}
          }
        }
      });
    }

    return newState;
  }
});

export const {
  type: OBSERVATION_SELECT,
  action: observationSelect,
  reducer: observationSelectReducer
} = create('OBSERVATION_SELECT', {
  start: (state, action) => {
    if (action.meta === undefined && state.selectedObservation) {
      return update(state, {
        selectedObservation: {$set: action.meta},
        observations: {
          [state.selectedObservation.id]: {
            $set: {
              ...(state.observations[state.selectedObservation.id] || {}),
              ...state.selectedObservation,
            }
          }
        }
      });
    } else {
      return update(state, {selectedObservation: {$set: action.meta}});
    }
  }
});

export const selectObservation = createSelector(
    [(state: StoreState, id: string): Observation =>
         state.app.observations[id]],
    (observation: Observation): Observation => observation,
    (observation: Observation, id: string): string => id);

export default [
  observationListReducer, observationCreateReducer, observationUpdateReducer,
  observationSelectReducer
];
