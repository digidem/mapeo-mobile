// @flow
import { jsonRequest } from './base';
import { applyStyleDefaults } from '../models/map';

class Media {
  static backup = (file: string, thumbnail?: string) =>
    jsonRequest({
      method: 'PUT',
      route: thumbnail
        ? `/media?file=${encodePath(file)}&thumbnail=${encodePath(thumbnail)}`
        : `/media?file=${encodePath(file)}`
    });
}

export default Media;

function encodePath(filepath) {
  return encodeURI(filepath.replace(/^.*:\/\//, ''));
}
