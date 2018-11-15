// @flow
import type { Device } from '../types/device';

export const applyDefaultsToDevice = (d: any): Device => {
  return {
    id: d.id,
    name: d.name,
    host: d.host,
    port: d.port,
    syncStatus: null,
  };
}
