// @flow
import {
  PERMISSION_DENIED,
  UNAVAILABLE,
  SEARCHING,
  LOW_ACCURACY,
  HIGH_ACCURACY
} from '../ducks/gps';

export type GPSFormat = 'DD' | 'DDM' | 'DMS' | 'UTM';

export type GPSStatus =
  | PERMISSION_DENIED
  | UNAVAILABLE
  | SEARCHING
  | LOW_ACCURACY
  | HIGH_ACCURACY;

export type Coordinates = {
  longitude: number,
  latitude: number,
  accuracy: number
};

export type GPSState = {
  status: GPSStatus,
  coords?: Coordinates,
  timestamp?: number
};
