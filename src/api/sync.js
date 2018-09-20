// @flow
import { jsonRequest, blankRequest, syncRequest } from './base';
import type { Device } from '../types/device';

class Sync {
  static announce = () =>
    blankRequest({
      method: 'GET',
      route: '/sync/announce'
    });

  static list = () =>
    jsonRequest({
      method: 'GET',
      route: '/sync/targets'
    });

  static start = (device: Device) =>
    syncRequest({
      method: 'GET',
      route: `/sync/start?host=${device.host}&port=${device.port}`
    });
}

export default Sync;
