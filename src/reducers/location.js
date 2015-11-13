import actionTypes, { geolocationErrors } from '../constants'

/**
 * Location store. This should have the store and some associated data. Exaplining why:
 * @type {array} coords Has the coordinates in [lon, lat] format, because that's what GeoJSON, Mapbox-gl-js and d3 use
 * @type {object} meta For all the associated data which might or might not be available. Has default values so we can simplify the rest of the code
 * @type {geolocationErrors} positionError If there was an error, the associated error according to W3C spec. Else, null.
 * @type {Date} timestamp Timestamp of last position fix
 */
const firstLocationState = {
  coords: [-59.5, 2.7], // format: [lon, lat]
  meta: {
    accuracy: null,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null
  }, // should include accuracy (in m) if available, alitutude, and in addition any other metadata like HDOP, type of fix etc.
  positionError: geolocationErrors.POSITION_UNAVAILABLE, // the possible values are 'PERMISSION_DENIED', 'POSITION_UNAVAILABLE', 'TIMEOUT'
  timestamp: null // timestamp of last position fix
}

/**
 * Location reducer
 * @param  {Location} state Old location state
 * @param  {actionTypes} type the action type
 * @param  {Object} payload the object payload. Consists of a position Object or an Error object
 * @param  {Object} payload.position Position object, as defined by W3C spec
 * @param  {Object} payload.error Might be an Geolocation error, as defined by W3C spec, or a standard Error()
 * @return {Location} Returns the new Location
 */
export default function location (
  state = firstLocationState, {
    type,
    payload: {
      position,
      error
    } = {}
  }) {
  switch (type) {
    case actionTypes.GEOLOCATION_UPDATE:
      let newState = Object.assign({}, state)
      if (!error) { // Okay, geolocation works
        newState.coords = [position.coords.longitude, position.coords.latitude]
        newState.timestamp = position.timestamp
        newState.meta = {
          accuracy: position.coords.accuracy ? position.coords.accuracy : null,
          altitude: position.coords.altitude ? position.coords.altitude : null,
          altitudeAccuracy: position.coords.altitudeAccuracy ? position.coords.altitudeAccuracy : null,
          heading: position.coords.heading ? position.coords.heading : null,
          speed: position.coords.speed ? position.coords.speed : null
        }
        newState.positionError = null
        return newState
      } else { // Darn, geolocation failed! This time, at least
        if (error.code) {
          if (error.code === 1) {
            newState.positionError = geolocationErrors.PERMISSION_DENIED
          }
          if (error.code === 2) {
            newState.positionError = geolocationErrors.POSITION_UNAVAILABLE
          }
          if (error.code === 3) {
            newState.positionError = geolocationErrors.TIMEOUT
          }
        // If there isn't a 'geolocation' in the navigator, or if by any other
        // means, a standard error was created, instead of a geolocation error,
        // we will just default to a common message
        } else {
          newState.positionError = geolocationErrors.POSITION_UNAVAILABLE
        }
        return newState
      }
      break

    default:
      return state
  }
}
