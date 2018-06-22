// @flow
import fetch from 'fetch';
import { jsonRequest } from './base';
import { applyStyleDefaults } from '../models/map';

class Style {
  static list = () =>
    jsonRequest({
      method: 'GET',
      route: '/styles'
    }).map(observations => observations.map(applyStyleDefaults));
}

export default Style;
