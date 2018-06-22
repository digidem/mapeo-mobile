// @flow
import React from 'react';
import { Image } from 'react-native';
import type { ActionsObservable } from 'redux-observable';
import {
  OBSERVATION_LIST,
  observationList,
  OBSERVATION_SAVE,
  observationSave,
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
      Observation.list().map(observations => observationList('', observations))
    );

export const observationSaveEpic = (
  action$: ActionsObservable<Action<CreateRequest, ObservationType>>,
  store: any
) =>
  action$
    .ofType(OBSERVATION_SAVE)
    .filter(action => {
      console.log('RN - filter epic', store.getState().app.selectedObservation);
      return (
        action.status === 'Start' && !!store.getState().app.selectedObservation
      );
    })
    .flatMap(action => {
      console.log(
        'RN - before create',
        store.getState().app.selectedObservation
      );
      return Observation.create(store.getState().app.selectedObservation).map(
        observation => {
          console.log('RN - ', observation);
          return observationSave(action.meta, observation);
        }
      );
    });

export default [observationListEpic, observationSaveEpic];
