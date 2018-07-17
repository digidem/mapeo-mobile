// @flow
import React from 'react';
import { Observable } from 'rxjs';
import { Image } from 'react-native';
import { debounceTime } from 'rxjs/operators';
import type { ActionsObservable } from 'redux-observable';
import {
  OBSERVATION_LIST,
  observationList,
  OBSERVATION_SAVE,
  observationSave,
  OBSERVATION_UPDATE,
  observationUpdate,
  OBSERVATION_UPDATE_SAVE,
  observationUpdateSave
} from '../ducks/observations';
import { modalShow } from '../ducks/modals';
import { mediaSave } from '../ducks/media';
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
    .pipe(debounceTime(500))
    .flatMap(() => {
      return Observation.list().map(observations =>
        observationList('', observations)
      );
    });

export const observationSaveEpic = (
  action$: ActionsObservable<Action<CreateRequest, ObservationType>>,
  store: any
) =>
  action$
    .ofType(OBSERVATION_SAVE)
    .filter(
      action =>
        action.status === 'Start' && !!store.getState().selectedObservation
    )
    .flatMap(action => {
      return Observation.create(store.getState().selectedObservation).flatMap(
        observation =>
          Observable.merge(
            Observable.of(observationSave(action.meta, observation)),
            Observable.of(observationList('')),
            Observable.of(modalShow('saved'))
          )
      );
    });

export const observationUpdateSaveEpic = (
  action$: ActionsObservable<Action<UpdateRequest, ObservationType>>,
  store: any
) =>
  action$
    .ofType(OBSERVATION_UPDATE_SAVE)
    .filter(
      action =>
        action.status === 'Start' &&
        ((!action.meta && !!store.getState().selectedObservation) ||
          action.meta)
    )
    .flatMap(action => {
      return Observation.update(
        action.meta || store.getState().selectedObservation
      ).flatMap(observation => {
        return Observable.merge(
          Observable.of(observationUpdateSave(action.meta, observation)),
          Observable.of(observationList(''))
        );
      });
    });

export default [
  observationListEpic,
  observationSaveEpic,
  observationUpdateSaveEpic
];
