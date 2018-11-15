// @flow

import update from 'immutability-helper';
import { keyBy } from 'lodash';
import shortid from 'shortid';
import { create } from '../lib/redux';
import { createSelector } from '../lib/selector';
import type { StoreState } from '../types/redux';
import type { Observation } from '../types/observation';

export const {
  type: OBSERVATION_LIST,
  action: observationList,
  reducer: observationListReducer
} = create('OBSERVATION_LIST', {
  success: (state, meta, payload) =>
    update(state, {
      observations: { $set: keyBy(payload, 'id') }
    })
});

export const {
  type: OBSERVATION_CREATE,
  action: observationCreate,
  reducer: observationCreateReducer
} = create('OBSERVATION_CREATE', {
  start: (state, meta) => {
    const observation = meta;

    if (!observation.lat && !observation.lon && state.gps.coords) {
      observation.lat = state.gps.coords.latitude;
      observation.lon = state.gps.coords.longitude;
    }

    const newState = update(state, {
      selectedObservation: { $set: observation }
    });

    return newState;
  }
});

export const {
  type: OBSERVATION_UPDATE,
  action: observationUpdate,
  reducer: observationUpdateReducer
} = create('OBSERVATION_UPDATE', {
  start: (state, meta) => {
    let newState;
    if (state.selectedObservation && meta.id === state.selectedObservation.id) {
      newState = update(state, {
        selectedObservation: {
          $set: { ...state.selectedObservation, ...meta }
        }
      });
    } else {
      newState = update(state, {
        observations: {
          [meta.id]: {
            $set: { ...state.observations[meta.id], ...meta }
          }
        }
      });
    }

    return newState;
  }
});

export const {
  type: OBSERVATION_UPDATE_SAVE,
  action: observationUpdateSave,
  reducer: observationUpdateSaveReducer
} = create('OBSERVATION_UPDATE_SAVE', {
  success: (state, meta, payload) => {
    return update(state, {
      observations: {
        [payload.id]: {
          $set: payload
        }
      }
    });
  }
});

export const {
  type: OBSERVATION_SELECT,
  action: observationSelect,
  reducer: observationSelectReducer
} = create('OBSERVATION_SELECT', {
  start: (state, meta) => update(state, { selectedObservation: { $set: meta } })
});

export const {
  type: OBSERVATION_SAVE,
  action: observationSave,
  reducer: observationSaveReducer
} = create('OBSERVATION_SAVE', {
  success: (state, meta, payload) => {
    return update(state, {
      observations: {
        [payload.id]: {
          $set: payload
        }
      }
    });
  }
});

export type observationAttachmentUpdateMeta = {
  tempId: string,
  observation?: string,
  mediaId: string
};

export const {
  type: OBSERVATION_ATTACHMENT_UPDATE,
  action: observationAttachmentUpdate,
  reducer: observationAttachmentUpdateReducer
} = create('OBSERVATION_ATTACHMENT_UPDATE', {
  start: (state, meta) => {
    let observation = state.selectedObservation;

    if (meta.observation) {
      observation = state.observations[meta.observation];
    }

    if (!observation || !observation.attachments) {
      return state;
    }

    const index = observation.attachments.indexOf(meta.tempId);

    if (index === -1) {
      return state;
    }

    if (meta.observation) {
      return update(state, {
        observations: {
          [meta.observation]: {
            attachments: {
              $splice: [[index, 1, meta.mediaId]]
            }
          }
        }
      });
    } else {
      return update(state, {
        selectedObservation: {
          attachments: {
            $splice: [[index, 1, meta.mediaId]]
          }
        }
      });
    }
  }
});

export const selectObservation = createSelector(
  [(state: StoreState, id: string): Observation => state.observations[id]],
  (observation: Observation): Observation => observation,
  (observation: Observation, id: string): string => id
);

export default [
  observationListReducer,
  observationCreateReducer,
  observationUpdateReducer,
  observationSelectReducer,
  observationSaveReducer,
  observationUpdateSaveReducer,
  observationAttachmentUpdateReducer
];
