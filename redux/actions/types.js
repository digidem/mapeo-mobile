import keymirror from 'keymirror'

// Keymirror just saves typing (and typos) by
// creating an object with values equal to its key names.
export default keymirror({
/* Observation actions */
  OBSERVATION_CREATE: null,
  OBSERVATION_MOVE: null,
  OBSERVATION_CHANGE_PRESET: null,
  OBSERVATION_ATTACH_MEDIA: null,
  OBSERVATION_SET_LINK: null,
  OBSERVATION_REMOVE_LINK: null,
  OBSERVATION_UPDATE_DETAILS: null,
  OBSERVATION_DELETE: null,

/* Event actions */
  EVENT_CREATE: null,
  EVENT_MOVE: null,
  EVENT_CHANGE_PRESET: null,
  EVENT_ATTACH_MEDIA: null,
  EVENT_UPDATE_DETAILS: null,
  EVENT_DELETE: null,

/* Place actions */
  PLACE_CREATE: null,
  PLACE_MOVE: null,
  PLACE_CHANGE_PRESET: null,
  PLACE_ATTACH_MEDIA: null,
  PLACE_UPDATE_DETAILS: null,
  PLACE_DELETE: null
})
