// @flow
import fetch from 'fetch';
import { jsonRequest } from './base';
import { applyStyleDefaults } from '../models/map';

class Media {
  static backup = (file: string) =>
    jsonRequest({
      method: 'PUT',
      route: `/media?file=${file}`
    });
}

export default Media;
