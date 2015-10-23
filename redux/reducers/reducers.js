import Immutable from 'immutable'
import { OBSERVATION_ADD, OBSERVATION_REMOVE,
         EVENT_ADD, EVENT_REMOVE,
         PLACE_ADD, PLACE_REMOVE } from '../actions/actionTypes'

const observationsInitialState = Immutable.List()

export let observations = (state = observationsInitialState, action = {}) => {
  switch (action.type) {
    case OBSERVATION_ADD:
      return state.push(Immutable.Map({
        text: action.data.text,
        lat: action.data.lat,
        lng: action.data.lng,
        _id: action.data._id
      }))
    case OBSERVATION_REMOVE:
      return state.filter(x => x.get('_id') !== action.data._id)
    default:
      return state
  }
}

const eventsInitialState = Immutable.List()

export let events = (state = eventsInitialState, action = {}) => {
  switch (action.type) {
    case EVENT_ADD:
      return state.push(Immutable.Map({
        text: action.data.text,
        lat: action.data.lat,
        lng: action.data.lng,
        _id: action.data._id
      }))
    case EVENT_REMOVE:
      return state.filter(x => x.get('_id') !== action.data._id)
    default:
      return state
  }
}

const placesInitialState = Immutable.List()

export let places = (state = placesInitialState, action = {}) => {
  switch (action.type) {
    case PLACE_ADD:
      return state.push(Immutable.Map({
        text: action.data.text,
        lat: action.data.lat,
        lng: action.data.lng,
        _id: action.data._id
      }))
    case PLACE_REMOVE:
      return state.filter(x => x.get('_id') !== action.data._id)
    default:
      return state
  }
}
