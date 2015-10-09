var test = require('tape')
import * as actions from '../redux/actions/actions'
import * as types from '../redux/actions/actionTypes'

test('Action to add place', function (t) {
  t.plan(1)
  const text = 'Casa do Pai Tomás'
  const lat = -23.73454
  const lng = -47.987
  const expected_action = {
    type: types.PLACE_ADD,
    data: {
      text: text,
      lat: lat,
      lng: lng
    }
  }
  t.deepEqual(actions.placeAdd(text, lat, lng), expected_action, 'Add Place Action OK')
})

test('Action to add event', function (t) {
  t.plan(1)
  const text = 'Weird oil spill'
  const lat = -23.73454
  const lng = -47.987
  const expected_action = {
    type: types.EVENT_ADD,
    data: {
      text: text,
      lat: lat,
      lng: lng
    }
  }
  t.deepEqual(actions.eventAdd(text, lat, lng), expected_action, 'Add Event Action OK')
})

test('Action to add observation', function (t) {
  t.plan(1)
  const text = 'Maan, this spill is ugly'
  const lat = -23.73454
  const lng = -47.987
  const expected_action = {
    type: types.OBSERVATION_ADD,
    data: {
      text: text,
      lat: lat,
      lng: lng
    }
  }
  t.deepEqual(actions.observationAdd(text, lat, lng), expected_action, 'Add Observation Action OK')
})
