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
    .map(() =>
      observationList('', [
        createObservation({ id: '1' }),
        createObservation({
          id: '2',
          created: new Date(new Date() - 24 * 60 * 60 * 1000)
        }),
        createObservation({
          id: '3',
          created: new Date(new Date() - 24 * 60 * 60 * 1000 * 2)
        }),
        createObservation({
          id: '4',
          created: new Date(new Date() - 24 * 60 * 60 * 1000 * 7)
        }),
        createObservation({
          id: '5',
          created: new Date(new Date() - 24 * 60 * 60 * 1000 * 40)
        }),
        createObservation({
          id: '6',
          created: new Date(new Date() - 24 * 60 * 60 * 1000 * 70)
        })
      ])
    );

export default [observationListEpic];
