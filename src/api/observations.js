// @flow
import { jsonRequest } from './base';
import { parseObservationResponse } from '../models/observations';

import type {
  Observation as ObservationType,
  ServerObservationResponse,
  ServerObservationCreate
} from '../types/observation';

class Observation {
  static list = () =>
    jsonRequest({
      method: 'GET',
      route: '/observations'
    }).map(observations => observations.map(parseObservationResponse));

  static create = (observation: ServerObservationCreate) =>
    jsonRequest({
      method: 'POST',
      route: '/observations',
      body: observation
    }).map(parseObservationResponse);

  static update = (observation: ServerObservationResponse) =>
    jsonRequest({
      method: 'PUT',
      route: `/observations/${observation.id}`,
      body: observation
    }).map(parseObservationResponse);
}

export default Observation;
