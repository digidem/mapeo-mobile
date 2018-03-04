// @flow
import type { ActionsObservable } from 'redux-observable';
import { OBSERVATION_LIST, observationList } from '../ducks/observations';
import { Action } from '../types/redux';
import { Observation } from '../types/observation';

export const observationListEpic = (
  action$: ActionsObservable<Action<string, Observation[]>>
) =>
  action$
    .ofType(OBSERVATION_LIST)
    .filter(action => action.status === 'Start')
    .map(() => observationList('', []));

export default [observationListEpic];
