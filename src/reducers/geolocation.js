import invariant from 'invariant'
import actionTypes, { geolocationErrors } from '../constants'

const defaultError = new Error('Position unavailable')
defaultError.code = geolocationErrors.POSITION_UNAVAILABLE

/**
 * Geolocation state defaults.
 * @namespace
 * @prop {array} coords Has the coordinates in [lon, lat] format, because that's what GeoJSON, Mapbox-gl-js and d3 use
 * @prop {object} meta For all the associated data which might or might not be available. Has default values so we can simplify the rest of the code
 * should include accuracy (in m) if available, alitutude, and in addition any other metadata like HDOP, type of fix etc.
 * @prop {string} positionError 'PERMISSION_DENIED' || 'POSITION_UNAVAILABLE' || 'TIMEOUT' from http://www.w3.org/TR/geolocation-API/#position_error_interface
 * @prop {number} timestamp Timestamp of last position fix
 */
const firstGeolocationState = {
  coords: null,
  meta: {
    accuracy: null,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null
  },
  positionError: defaultError,
  timestamp: null
}

/**
 * Geolocation reducer
 * @param  {Object} state Current location state
 * @param  {string} options.type Action type
 * @param  {Object|Error} options.payload Action payload
 * @param  {Position} [options.payload.position] Geolocation Position http://www.w3.org/TR/geolocation-API/#position_interface
 * @param  {boolean} options.error If `true` `payload` should be Error object.
 * @return {Object} New Geolocation state
 */
export default function location (
  state = firstGeolocationState, {
    type,
    payload = {},
    error
  }) {
  switch (type) {
    case actionTypes.GEOLOCATION_UPDATE:
      invariant(!error || (payload instanceof Error), '`error` was true but payload (%s) was not an error', payload)
      invariant(error || payload.position, '`error` was false but the payload is missing `position` property: %s', payload)
      if (error) {
        // If error is true, then the payload is an Error object
        if (!payload.code) {
          // If we don't have an error code, default to:
          payload.code = geolocationErrors.POSITION_UNAVAILABLE
        }
        return {...state, positionError: payload}
      }

      // Okay, geolocation works
      const { longitude, latitude, ...meta } = payload.position.coords
      return {
        coords: [longitude, latitude],
        meta: meta,
        timestamp: payload.position.timestamp,
        positionError: null
      }

    default:
      return state
  }
}
