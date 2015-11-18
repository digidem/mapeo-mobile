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

export const geolocationErrors = {
  PERMISSION_DENIED: 1,
  POSITION_UNAVAILABLE: 2,
  TIMEOUT: 3
}
