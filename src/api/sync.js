// @flow
import { jsonRequest, blankRequest, syncRequest } from './base';
import type { Device } from '../types/device';

class Sync {
  static unannounce = () => {
    return blankRequest({
      method: 'GET',
      route: '/sync/unannounce'
    });
  }

  static announce = () => {
    return blankRequest({
      method: 'GET',
      route: '/sync/announce'
    });
  };

  static list = () => {
    return jsonRequest({
      method: 'GET',
      route: '/sync/targets'
    });
  };

  static start = (device: Device) => {
    return syncRequest({
      method: 'GET',
      route: `/sync/start?host=${device.host}&port=${device.port}`
    });
  }
}

export default Sync;
