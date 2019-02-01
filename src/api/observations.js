// @flow
import { jsonRequest } from './base';
import { keyBy } from 'lodash';
import { parseObservationResponse } from '../models/observations';
import querystring from 'querystring'

import type {
  Observation as ObservationType,
  ServerObservationResponse,
  ServerObservationCreate
} from '../types/observation';

class Observation {
  static list = (opts) =>
    jsonRequest({
      method: 'GET',
      route: '/observations?' + querystring.stringify(opts)
    }).map(observations => {
      var payload = observations.map(parseObservationResponse)
      return keyBy(payload, 'id')
    });

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
