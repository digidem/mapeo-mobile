// @flow
import fetch from 'fetch';
import { jsonRequest } from './base';
import { applyStyleDefaults } from '../models/map';

class Media {
  static backup = (file: string, thumbnail?: string) =>
    jsonRequest({
      method: 'PUT',
      route: thumbnail
        ? `/media?file=${encodeURI(file)}&thumbnail=${encodeURI(thumbnail)}`
        : `/media?file=${encodeURI(file)}`
    });
}

export default Media;
