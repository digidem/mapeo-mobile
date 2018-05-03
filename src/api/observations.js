// @flow
import fetch from 'fetch';
import { jsonRequest } from './base';

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
    });

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
