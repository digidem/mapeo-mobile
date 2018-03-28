// @flow
import React from 'react';
import { Image } from 'react-native';
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
          type: 'Old houses and farms',
          id: 1,
          lat: 0.106831547,
          lon: -77.42499473,
          link: 'link',
          created: new Date('2018-03-25T12:00:00Z'),
          name: 'Old houses and farms',
          notes: `Pedro and Maria's house`,
          observedBy: 'Aliya',
          media: [
            {
              type: 'LocalPhoto',
              source: require('../images/mock-data/1-house.jpg')
            }
          ],
          icon: require('../images/categories/category_0.png'),
          mock: true
        },
        {
          type: 'Hunting sites',
          id: 2,
          lat: 0.088170932,
          lon: -77.44020885,
          link: 'link',
          created: new Date('2018-03-25T12:30:00Z'),
          name: 'Hunting sites',
          notes: `Don Pancho's hunting camp`,
          observedBy: 'Aliya',
          media: [
            {
              type: 'LocalPhoto',
              source: require('../images/mock-data/4-camp.jpg')
            }
          ],
          icon: require('../images/categories/category_2.png'),
          mock: true
        },
        {
          type: 'Threat',
          id: 3,
          lat: 0.112411067,
          lon: -77.41378756,
          link: 'link',
          created: new Date('2018-02-03T17:30:00Z'),
          name: 'Threat',
          notes: `Oil spill 3 February 2018. Ruptured pipeline. Dead fish, oily water`,
          observedBy: 'Aliya',
          media: [
            {
              type: 'LocalPhoto',
              source: require('../images/mock-data/5-threat.jpg')
            }
          ],
          icon: null,
          mock: true
        },
        {
          type: 'Medicinal plants',
          id: 4,
          lat: 0.09749025,
          lon: -77.43614404,
          link: 'link',
          created: new Date('2018-02-04T17:30:00Z'),
          name: 'Medicinal plants',
          notes: `Salola fruit plant - used in tea to heal inflamation`,
          observedBy: 'Aliya',
          media: [
            {
              type: 'LocalPhoto',
              source: require('../images/mock-data/6-plant.jpg')
            }
          ],
          icon: require('../images/categories/category_6.png'),
          mock: true
        },
        {
          type: 'Waterfalls',
          id: 5,
          lat: 0.105818148,
          lon: -77.4408037,
          link: 'link',
          created: new Date('2018-03-04T17:30:00Z'),
          name: 'Waterfalls',
          notes: `Sacred waterfall, visited during vision quests for ancestors, for taking ayahuasca`,
          observedBy: 'Aliya',
          media: [
            {
              type: 'LocalPhoto',
              source: require('../images/mock-data/7-waterfall.jpg')
            }
          ],
          icon: require('../images/categories/category_13.png'),
          mock: true
        },
        {
          type: 'Rivers and streams',
          id: 6,
          lat: 0.119004333,
          lon: -77.42374225,
          link: 'link',
          created: new Date('2018-03-24T17:30:00Z'),
          name: 'Rivers and streams',
          notes: `Point where pipeline crosses river`,
          observedBy: 'Aliya',
          media: [
            {
              type: 'LocalPhoto',
              source: require('../images/mock-data/8-threat.jpg')
            }
          ],
          icon: require('../images/categories/category_0.png'),
          mock: true
        },
        {
          type: 'Historical sites',
          id: 7,
          lat: 0.082856811,
          lon: -77.4429836,
          link: 'link',
          created: new Date('2018-03-24T12:30:00Z'),
          name: 'Historical sites',
          notes: `There used to be a village here in the 1940s, it was abandoned after an epidemic of flu which killed most of the elders and children.`,
          observedBy: 'Aliya',
          media: [
            {
              type: 'LocalPhoto',
              source: require('../images/mock-data/9-specialsite.jpg')
            }
          ],
          icon: require('../images/categories/category_17.png'),
          mock: true
        },
        {
          type: 'Gold',
          id: 8,
          lat: 0.108605553,
          lon: -77.41560494,
          link: 'link',
          created: new Date('2018-03-11T17:30:00Z'),
          name: 'Gold',
          notes: `Illegal gold miners 11 March 2018, excavators, dredges, open tailing pond, mercury.`,
          observedBy: 'Aliya',
          media: [
            {
              type: 'LocalPhoto',
              source: require('../images/mock-data/10-threat.jpg')
            }
          ],
          icon: require('../images/categories/category_8.png'),
          mock: true
        }
      ])
    );

export default [observationListEpic];
