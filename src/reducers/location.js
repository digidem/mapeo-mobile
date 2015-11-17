import invariant from 'invariant'
import actionTypes, { geolocationErrors } from '../constants'

const positionErrorCodes = {
  1: geolocationErrors.PERMISSION_DENIED,
  2: geolocationErrors.POSITION_UNAVAILABLE,
  3: geolocationErrors.POSITION_UNAVAILABLE
}

/**
 * Location store. This should have the store and some associated data. Exaplining why:
 * @type {array} coords Has the coordinates in [lon, lat] format, because that's what GeoJSON, Mapbox-gl-js and d3 use
 * @type {object} meta For all the associated data which might or might not be available. Has default values so we can simplify the rest of the code
 * should include accuracy (in m) if available, alitutude, and in addition any other metadata like HDOP, type of fix etc.
 * @type {string} positionError 'PERMISSION_DENIED' || 'POSITION_UNAVAILABLE' || 'TIMEOUT' from http://www.w3.org/TR/geolocation-API/#position_error_interface
 * @type {number} timestamp Timestamp of last position fix
 */
const firstLocationState = {
  coords: [-59.5, 2.7],
  meta: {
    accuracy: null,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null
  },
  positionError: geolocationErrors.POSITION_UNAVAILABLE,
  timestamp: null
}

/**
 * Location reducer
 * @param  {Object} state Current location state
 * @param  {string} type the action type
 * @param  {Object|Error} payload
 * @param  {Position} [payload.position] geolocation Position http://www.w3.org/TR/geolocation-API/#position_interface
 * @param  {boolean} error If `true` `payload` should be Error object.
 * @return {Object} Returns the new Location state
 */
export default function location (
  state = firstLocationState, {
    type,
    payload = {},
    error
  }) {
  switch (type) {
    case actionTypes.GEOLOCATION_UPDATE:
      invariant((error && payload instanceof Error) || (!error && payload.position), 'We have only two possibilities: error is true and payload is an Error() OR error is false and payload has a position')
      if (!(payload instanceof Error)) {
        // Okay, geolocation works
        const { longitude, latitude, ...meta } = payload.position.coords
        return {
          coords: [longitude, latitude],
          meta: meta,
          timestamp: payload.position.timestamp,
          positionError: null
        }
      } else if (payload.code) {
        // Darn, geolocation failed! This time, at least
        return {...state, positionError: positionErrorCodes[payload.code]}
      } else {
        return {...state, positionError: geolocationErrors.POSITION_UNAVAILABLE}
      }
      break

    default:
      return state
  }
}
