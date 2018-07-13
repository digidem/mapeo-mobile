// @flow

import update from 'immutability-helper';
import GeoLocation from '@digidem/react-native-geolocation';

// actions
const UPDATE = 'mapeo-mobile/location/UPDATE';
const ERROR = 'mapeo-mobile/location/ERROR';

// status
export const PERMISSION_DENIED = 'PERMISSION_DENIED';
export const UNAVAILABLE = 'UNAVAILABLE';
export const SEARCHING = 'SEARCHING';
export const LOW_ACCURACY = 'LOW_ACCURACY';
export const HIGH_ACCURACY = 'HIGH_ACCURACY';

const statusMap = {
  [GeoLocation.SEARCHING]: SEARCHING,
  [GeoLocation.LOW_ACCURACY]: LOW_ACCURACY,
  [GeoLocation.HIGH_ACCURACY]: HIGH_ACCURACY
};

const errorCodeMap = {
  [GeoLocation.PERMISSION_DENIED]: PERMISSION_DENIED,
  [GeoLocation.POSITION_UNAVAILABLE]: UNAVAILABLE,
  [GeoLocation.TIMEOUT]: UNAVAILABLE,
  [GeoLocation.UNKNOWN]: UNAVAILABLE
};

export default [
  function reducer(state = {}, { type, payload } = {}) {
    switch (type) {
      case UPDATE:
        return update(state, {
          gps: {
            status: { $set: statusMap[payload.status] },
            timestamp: { $set: payload.timestamp },
            coords: { $set: payload.coords }
          }
        });
      case ERROR:
        return update(state, {
          gps: {
            status: { $set: errorCodeMap[payload.code] }
          }
        });
      default:
        return state;
    }
  }
];

export const locationUpdate = payload => ({
  type: UPDATE,
  payload
});

export const locationError = payload => ({
  type: ERROR,
  payload
});
