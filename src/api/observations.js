// @flow
import fetch from 'fetch';
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
        lat: observation.lat,
        lon: observation.lon,
        device_id: '1',
        properties: observation
      }
    }).map(applyObservationDefaults);

  static update = (observation: UpdateRequest) =>
    jsonRequest({
      method: 'PUT',
      route: `/observations/${observation.id}`,
      body: {
        id: observation.id,
        lat: observation.lat || undefined,
        lon: observation.lon || undefined,
        properties: observation
      }
    }).map(applyObservationDefaults);
}

export default Observation;
