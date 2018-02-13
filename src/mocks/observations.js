// @flow
import type { Observation } from '@src/types/observation';

export const createObservation = (observation?: Observation | void) => ({
  type: 'Observation',
  id: 'ObservationID',
  lat: 50.5,
  lon: 50.5,
  link: 'linkID',
  created: new Date(),
  name: 'Oil Spill',
  notes: 'This is pretty bad. It smells pretty noxious, and the entire pond is affected.',
  observedBy: 'You',
  
  ...observation,
});
