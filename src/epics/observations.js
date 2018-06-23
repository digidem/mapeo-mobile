// @flow
import React from 'react';
import { Observable } from 'rxjs';
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
            Observable.of(modalShow('saved')),
            ...observation.media.map(m =>
              Observable.of(
                mediaSave({
                  observationId: observation.id,
                  mediaId: m.id,
                  source: m.source
                })
              )
            )
          )
      )
    );

export const observationUpdateSaveEpic = (
  action$: ActionsObservable<Action<UpdateRequest, ObservationType>>,
  store: any
) =>
  action$
    .ofType(OBSERVATION_UPDATE_SAVE)
    .filter(
      action =>
        action.status === 'Start' &&
        ((!action.meta && !!store.getState().app.selectedObservation) ||
          action.meta)
    )
    .flatMap(action =>
      Observation.update(
        action.meta || store.getState().app.selectedObservation
      ).map(observation => observationUpdateSave(action.meta, observation))
    );

export default [
  observationListEpic,
  observationSaveEpic,
  observationUpdateSaveEpic
];
