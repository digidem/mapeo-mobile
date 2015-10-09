import { OBSERVATION_ADD, EVENT_ADD, PLACE_ADD } from './actionTypes'


export let observationAdd = (text, lat, lng) => ({
  type: OBSERVATION_ADD,
  data: {text, lat, lng}
})

// TODO How to remove the observation if I have no ID?
// observationRemove = (text, lat, lng) => ({
//   name: 'OBSERVATION_REMOVE',
//   data: {text, lat, lng}
// })

// TODO Link event to place
export let eventAdd = (text, lat, lng) => ({
  type: EVENT_ADD,
  data: {text, lat, lng}
})

// TODO This is just for POIs. Need a better way for polygons
export let placeAdd = (text, lat, lng) => ({
  type: PLACE_ADD,
  data: {text, lat, lng}
})
