// @flow
import { jsonRequest } from './base';
import { computeField } from '../models/fields';

class Field {
  static list = () =>
    jsonRequest({
      method: 'GET',
      route: '/presets'
    }).map(presets => presets);
}

export default Field;
