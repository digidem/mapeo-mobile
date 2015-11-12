export default function location (state = [-59.5, 2.7]) {
  return state
}

// import actionTypes from '../constants'
//
//
// const firstLocationState = {
//   isLocationWorking: false,
//   coords: [ undefined, undefined], // format: [lat, lon]
//   meta: {}, // should include accuracy (in m) if available, alitutude, and in addition any other metadata like HDOP, type of fix etc.
//   positionError: 'POSITION_UNAVAILABLE', // the possible values are 'PERMISSION_DENIED', 'POSITION_UNAVAILABLE', 'TIMEOUT'
//   timestamp: undefined // timestamp of last position fix
// }
//
// export default function location (state = firstLocationState, {type, payload = {}, error = false } = {} ) {
//   switch (type) {
//     case actionTypes.GEOLOCATION_UPDATE:
//       let newState = Object.assign({}, state)
//       if (error === true) { //Damnit, geolocation failed!
//         newState.isLocationWorking = false
//         //TODO: Add more properties to the positionError, based on the error received
//         //state.positionError
//         return newState
//       } else { //update ok
//         //TODO: Add more properties here
//         newState.coords = payload.position,
//         newState.timestamp = payload.timestamp
//         return newState
//       }
//       break
//
//     default:
//       return state
//
//   }
//
// }
