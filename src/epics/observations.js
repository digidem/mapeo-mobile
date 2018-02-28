// @flow
import { OBSERVATION_LIST, observationList } from '@ducks/observations';
import { createObservation } from '@mocks/observations';
import { Action } from '@types/redux';
import { Observation } from '@types/observation';
import type { ActionsObservable } from 'redux-observable';

export const observationListEpic = (
  action$: ActionsObservable<Action<string, Observation[]>>
) =>
  action$
    .ofType(OBSERVATION_LIST)
    .filter(action => action.status === 'Start')
    .map(() => observationList('', []));

export default [observationListEpic];
