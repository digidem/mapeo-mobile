// @flow
import React from 'react';
import { Image } from 'react-native';
import type { ActionsObservable } from 'redux-observable';
import {
  OBSERVATION_LIST,
  observationList,
  OBSERVATION_CREATE,
  observationCreate,
  OBSERVATION_UPDATE,
  observationUpdate
} from '../ducks/observations';
import { Action } from '../types/redux';
import type { Observation as ObservationType } from '../types/observation';
import type { StoreState } from '../types/redux';
import Observation from '../api/observations';
import type { CreateRequest, UpdateRequest } from '../api/observations';

export const observationListEpic = (
  action$: ActionsObservable<Action<string, ObservationType[]>>,
  store: StoreState
) =>
  action$
    .ofType(OBSERVATION_LIST)
    .filter(action => action.status === 'Start')
    .flatMap(() =>
      Observation.list().map(observations => {
        console.log('RN - Observations List', observations);
        return observationList('', observations);
      })
    );

export const observationCreateEpic = (
  action$: ActionsObservable<Action<CreateRequest, ObservationType>>,
  store: StoreState
) =>
  action$
    .ofType(OBSERVATION_CREATE)
    .filter(action => action.status === 'Start')
    .flatMap(action =>
      Observation.create(action.meta).map(observation => {
        console.log('RN - Observation Created');
        return observationCreate(action.meta, observation);
      })
    );

// export const observationUpdateEpic = (
//   action$: ActionsObservable<Action<UpdateRequest, ObservationType>>,
//   store: StoreState
// ) =>
//   action$
//     .ofType(OBSERVATION_UPDATE)
//     .filter(action => action.status === 'Start')
//     .flatMap(action =>
//       Observation.update(action.meta).map(observation => {
//         console.log('RN - Observation Updated - ', action.meta, observation);
//         return observationUpdate(action.meta, observation);
//       })
//     );

export default [
  observationListEpic,
  observationCreateEpic
  // observationUpdateEpic
];
