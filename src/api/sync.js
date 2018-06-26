import { jsonRequest } from './base';
import type { Device } from '../types/device';

class Sync {
  static announce = () =>
    jsonRequest({
      method: 'GET',
      route: '/sync/announce'
    });

  static list = () =>
    jsonRequest({
      method: 'GET',
      route: '/sync/targets'
    });

  static start = (device: Device) =>
    jsonRequest({
      method: 'GET',
      route: `/sync/start?ip=${device.ip}&port=${device.port}`
    });
}

export default Sync;
