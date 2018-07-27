// @flow

import { createField } from '../mocks/fields';
import type { Observation } from '../types/observation';

export const createObservation = (observation?: any): Observation => ({
  id: 1,
  lat: 50.5,
  lon: 50.5,
  created: new Date('2018-02-25T20:23:00.000Z'),
  name: 'Oil Spill',
  notes:
    'This is pretty bad. It smells pretty noxious, and the entire pond is affected.',
  observedBy: 'You',
  attachments: [],
  categoryId: 19,
  fields: [createField()],

  ...observation
});
