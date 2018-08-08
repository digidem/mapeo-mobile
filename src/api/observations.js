// @flow
import { jsonRequest } from './base';
import { applyObservationDefaults } from '../models/observations';

export interface CreateRequest {
  lat: number;
  lon: number;
}

export type UpdateRequest = {
  id: string
};

class Observation {
  static list = () =>
    jsonRequest({
      method: 'GET',
      route: '/observations'
    }).map(observations => observations.map(applyObservationDefaults));

  static create = (observation: CreateRequest) =>
    jsonRequest({
      method: 'POST',
      route: '/observations',
      body: {
        device_id: '1',
        ...observation
      }
    });

  static update = (observation: UpdateRequest) =>
    jsonRequest({
      method: 'PUT',
      route: `/observations/${observation.id}`,
      body: {
        ...observation
      }
    });
}

export default Observation;
