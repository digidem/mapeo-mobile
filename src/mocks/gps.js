// @flow
import type { GPSState } from '../types/gps';

export const createGPSState = (partial: any) => ({
  longitude: 1,
  latitude: 1,
  accuracy: 50,
  ...partial
});
