// @flow
import React from 'react';
import { Image } from 'react-native';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import type { ActionsObservable } from 'redux-observable';
import {
  OBSERVATION_LIST,
  observationList,
  OBSERVATION_SAVE,
  observationSave,
  OBSERVATION_UPDATE,
  observationUpdate
} from '../ducks/observations';
import { modalShow } from '../ducks/modals';
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
    .flatMap(() =>
      Observation.list().map(observations => observationList('', observations))
    );

export const observationSaveEpic = (
  action$: ActionsObservable<Action<CreateRequest, ObservationType>>,
  store: any
) =>
  action$
    .ofType(OBSERVATION_SAVE)
    .filter(
      action =>
        action.status === 'Start' && !!store.getState().app.selectedObservation
    )
    .flatMap(action =>
      Observation.create(store.getState().app.selectedObservation).flatMap(
        observation =>
          Observable.merge(
            Observable.of(observationSave(action.meta, observation)),
            Observable.of(modalShow('saved'))
          )
      )
    );

export default [observationListEpic, observationSaveEpic];
