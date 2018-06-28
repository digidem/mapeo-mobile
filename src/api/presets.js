// @flow
import { jsonRequest, xmlRequest } from './base';
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
  static icons = (id: string) =>
    xmlRequest({
      method: 'GET',
      route: `/presets/${id}/icons.svg`
    });
}

export default Presets;
