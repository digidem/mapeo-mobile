// @flow

export type GPSFormat = 'DD' | 'DDM' | 'DMS' | 'UTM';

export type GPSState = {
  longitude: number,
  latitude: number,
  accuracy: number
};
