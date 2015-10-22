import { OBSERVATION_ADD, EVENT_ADD, PLACE_ADD } from './actionTypes'
import uuid from 'uuid'

export let observationAdd = (text, lat, lng, _id = uuid.v1()) => ({
  type: OBSERVATION_ADD,
  data: {text, lat, lng, _id}
})

// TODO How to remove the observation if I have no ID?
// observationRemove = (text, lat, lng) => ({
//   name: 'OBSERVATION_REMOVE',
//   data: {text, lat, lng}
// })

// TODO Link event to place
export let eventAdd = (text, lat, lng, _id = uuid.v1()) => ({
  type: EVENT_ADD,
  data: {text, lat, lng, _id}
})

// TODO This is just for POIs. Need a better way for polygons
export let placeAdd = (text, lat, lng, _id = uuid.v1()) => ({
  type: PLACE_ADD,
  data: {text, lat, lng, _id}
})
