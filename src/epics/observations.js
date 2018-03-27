// @flow
import type { ActionsObservable } from 'redux-observable';
import { OBSERVATION_LIST, observationList } from '../ducks/observations';
import { Action } from '../types/redux';
import { Observation } from '../types/observation';

export const observationListEpic = (
  action$: ActionsObservable<Action<string, Observation[]>>,
  store: any
) =>
  action$
    .ofType(OBSERVATION_LIST)
    .filter(
      action =>
        action.status === 'Start' &&
        store.getState().app &&
        store.getState().app.observations &&
        !store.getState().app.observations.length
    )
    .map(() =>
      observationList('', [
        {
          type: 'House',
          id: 1,
          lat: 0.106831547,
          lon: -77.42499473,
          link: 'link',
          created: new Date('2018-03-25T12:00:00Z'),
          name: 'House',
          notes: `Pedro and Maria's house`,
          observedBy: 'Aliya',
          media: [
            {
              type: 'LocalPhoto',
              source: require('../images/mock-data/1-house.jpg')
            }
          ],
          icon: null,
          mock: true
        }
      ])
    );

export default [observationListEpic];
