// @flow
import { Observation } from '@src/types/observation';

export const createObservation = (observation?: Observation) => ({
  type: 'Observation',
  id: 'ObservationID',
  lat: 50.5,
  lon: 50.5,
  link: 'linkID',
  ...observation,
});
