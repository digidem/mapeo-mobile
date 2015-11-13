import actionTypes, { geolocationErrors } from '../constants'

/**
 * Location store. This should have the store and some associated data. Exaplining why:
 * @type {bool} hasLocationEverWorked Users can turn location on and off at will. So this allows us to know if the position should be relied upon
 * @type {bool} isLocationWorkingNow Users can turn location on and off at will. This parameter exists so future UI decisions might tell the user he left the Localization off and should turn it on
 * @type {array} coords Has the coordinates in [lon, lat] format, because that's what GeoJSON, Mapbox-gl-js and d3 use
 * @type {object} meta For all the associated data which might or might not be available, like accuracy, altitude, heading, speed...
 * @type {geolocationErrors} positionError If there was an error, the associated error according to W3C spec. Else, null.
 * @type {Date} timestamp Timestamp of last position fix
 */
const firstLocationState = {
  hasLocationEverWorked: false,
  isLocationWorkingNow: false,
  coords: [-59.5, 2.7], // format: [lon, lat]
  meta: {}, // should include accuracy (in m) if available, alitutude, and in addition any other metadata like HDOP, type of fix etc.
  positionError: geolocationErrors.POSITION_UNAVAILABLE, // the possible values are 'PERMISSION_DENIED', 'POSITION_UNAVAILABLE', 'TIMEOUT'
  timestamp: null // timestamp of last position fix
}

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
        newState.hasLocationEverWorked = true,
        newState.isLocationWorkingNow = true,
        newState.coords = [position.coords.longitude, position.coords.latitude],
        newState.timestamp = position.timestamp,
        newState.meta = {
          accuracy: position.coords.accuracy ? position.coords.accuracy : null,
          altitude: position.coords.altitude ? position.coords.altitude : null,
          altitudeAccuracy: position.coords.altitudeAccuracy ? position.coords.altitudeAccuracy : null,
          heading: position.coords.heading ? position.coords.heading : null,
          speed: position.coords.speed ? position.coords.speed : null
        },
        newState.positionError = null
        return newState

      } else { // Darn, geolocation failed! This time, at least
        newState.isLocationWorkingNow = false
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
        }
        return newState
      }
      break

    default:
      return state
  }
}
