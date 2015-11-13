import keymirror from 'keymirror'

// Keymirror just saves typing (and typos) by
// creating an object with values equal to its key names.
export default keymirror({
/* Observation actions */
  OBSERVATION_SAVE: null,
  OBSERVATION_DELETE: null,

/* Event actions */
  EVENT_SAVE: null,
  EVENT_DELETE: null,

/* Place actions */
  PLACE_SAVE: null,
  PLACE_DELETE: null,

/* Geolocation actions */
  GEOLOCATION_UPDATE: null
})

export const geolocationErrors = keymirror({
  PERMISSION_DENIED: null,
  POSITION_UNAVAILABLE: null,
  TIMEOUT: null
})
