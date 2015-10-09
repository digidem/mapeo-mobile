import Immutable from 'immutable'
import { OBSERVATION_ADD, EVENT_ADD, PLACE_ADD } from '../actions/actionTypes'

// CONSTRUCT = () => {
//   return Immutable.fromJS({
//     observations: [],
//     events: [],
//     places: []
//   })
// }

export let observations = (state, action) => {
  switch (action.type) {
    case OBSERVATION_ADD:
      return state.push(Immutable.Map({
        text: action.data.text,
        lat: action.data.lat,
        lng: action.data.lng
      }))
    default:
      return state
  }
}

export let events = (state, action) => {
  switch (action.type) {
    case EVENT_ADD:
      return state.push(Immutable.Map({
        text: action.data.text,
        lat: action.data.lat,
        lng: action.data.lng
      }))
    default:
      return state
  }
}

const placesInitialState = Immutable.List()

export let places = (state = placesInitialState, action) => {
  switch (action.type) {
    case PLACE_ADD:
      return state.push(Immutable.Map({
        text: action.data.text,
        lat: action.data.lat,
        lng: action.data.lng
      }))
    default:
      return state
  }
}
