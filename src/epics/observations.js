// @flow
import { OBSERVATION_LIST, observationList } from '@ducks/observations';
import { createObservation } from '@mocks/observations';
import { Action } from '@types/redux';
import { Observation } from '@types/observation';
import type { Observable } from 'rxjs';

export const observationListEpic = (action$: Observable<Action<string, Observation[]>>) =>
  action$
    .ofType(OBSERVATION_LIST)
    .filter(action => action.status === 'Start')
    .map(() => observationList('', [createObservation(), createObservation()]));

export default [observationListEpic];
