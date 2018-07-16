// @flow
import type { GPSState } from '../types/gps';
import {
  PERMISSION_DENIED,
  UNAVAILABLE,
  SEARCHING,
  LOW_ACCURACY,
  HIGH_ACCURACY
} from '../ducks/gps';

export const createGPSState = (partial: any): GPSState => ({
  status: HIGH_ACCURACY,
  coords: {
    longitude: 1,
    latitude: 1,
    accuracy: 50
  },
  timestamp: 0,

  ...partial
});
