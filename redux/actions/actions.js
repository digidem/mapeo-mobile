import { OBSERVATION_ADD, OBSERVATION_EDIT, OBSERVATION_REMOVE,
         EVENT_ADD, EVENT_EDIT, EVENT_REMOVE,
         PLACE_ADD, PLACE_EDIT, PLACE_REMOVE
       } from './actionTypes'
import uuid from 'uuid'

export let observationAdd = (text, lat, lng, _id = uuid.v1()) => ({
  type: OBSERVATION_ADD,
  data: {text, lat, lng, _id}
})

export let observationEdit = (text, lat, lng, _id) => ({
  type: OBSERVATION_EDIT,
  data: {text, lat, lng, _id}
})

export let observationRemove = (_id) => ({
  type: OBSERVATION_REMOVE,
  data: {_id}
})

// TODO Link event to place
export let eventAdd = (text, lat, lng, _id = uuid.v1()) => ({
  type: EVENT_ADD,
  data: {text, lat, lng, _id}
})

export let eventEdit = (text, lat, lng, _id) => ({
  type: EVENT_EDIT,
  data: {text, lat, lng, _id}
})

export let eventRemove = (_id) => ({
  type: EVENT_REMOVE,
  data: {_id}
})

// TODO This is just for POIs. Need a better way for polygons
export let placeAdd = (text, lat, lng, _id = uuid.v1()) => ({
  type: PLACE_ADD,
  data: {text, lat, lng, _id}
})

export let placeEdit = (text, lat, lng, _id) => ({
  type: PLACE_EDIT,
  data: {text, lat, lng, _id}
})

export let placeRemove = (_id) => ({
  type: PLACE_REMOVE,
  data: {_id}
})
