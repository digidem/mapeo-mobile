// @flow
import { jsonRequest } from './base';
import { parseObservationResponse } from '../models/observations';

export type ObservationAPI = {
  lat: number,
  lon: number,
  attachments: Array<{ id: string }>,
  tags: Object
};

export type UpdateRequest = {
  id: string
};

class Observation {
  static list = () =>
    jsonRequest({
      method: 'GET',
      route: '/observations'
    }).map(observations => observations.map(parseObservationResponse));

  static create = (observation: ObservationAPI) =>
    jsonRequest({
      method: 'POST',
      route: '/observations',
      body: observation
    }).map(parseObservationResponse);

  static update = (observation: ObservationAPI & UpdateRequest) =>
    jsonRequest({
      method: 'PUT',
      route: `/observations/${observation.id}`,
      body: observation
    }).map(parseObservationResponse);
}

export default Observation;
