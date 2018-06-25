// @flow
import fetch from 'fetch';
import { jsonRequest } from './base';
import { applyStyleDefaults } from '../models/map';

class Presets {
  static list = () =>
    jsonRequest({
      method: 'GET',
      route: '/presets'
    });
  static get = (id: string) =>
    jsonRequest({
      method: 'GET',
      route: `/presets/${id}/presets.json`
    });
}

export default Presets;
