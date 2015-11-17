import test from 'prova'
import { location as locationReducer } from '../../src/reducers'
import { geolocationUpdate } from '../../src/action_creators'
import { geolocationErrors } from '../../src/constants'
import PositionError from '../mock-errors.js'

test('Empty reducer', (t) => {
  const shouldBeState = {
    coords: [-59.5, 2.7],
    meta: {
      accuracy: null,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null
    },
    positionError: geolocationErrors.POSITION_UNAVAILABLE,
    timestamp: null
  }

  const resultingState = locationReducer(undefined, {type: 'whatever'})
  t.deepEqual(resultingState, shouldBeState, 'Empty reducer okay')
  t.end()
})

test('Reducer handles Error()', (t) => {
  const shouldBeState = {
    coords: [-59.5, 2.7],
    meta: {
      accuracy: null,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null
    },
    positionError: geolocationErrors.POSITION_UNAVAILABLE,
    timestamp: null
  }

  const resultingState = locationReducer(undefined, geolocationUpdate(new Error(), true))

  t.deepEqual(resultingState, shouldBeState, 'Reducer handles Error() okay')
  t.end()
})

test('Reducer handles geolocation Error', (t) => {
  const MockError = new PositionError()

  const resultingState = locationReducer(undefined, geolocationUpdate(MockError, true))

  const shouldBeState = {
    coords: [-59.5, 2.7],
    meta: {
      accuracy: null,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null
    },
    positionError: geolocationErrors.PERMISSION_DENIED,
    timestamp: null
  }

  t.deepEqual(resultingState, shouldBeState, 'Reducer handles geolocation Error okay')
  t.end()
})

test('Reducer handles geolocation update', (t) => {
  const shouldBeState = {
    coords: [0, 0],
    meta: {
      accuracy: 20,
      altitude: 700,
      altitudeAccuracy: 50
    },
    positionError: null,
    timestamp: new Date(1)
  }
  const payload = {
    position: {
      coords: {longitude: 0, latitude: 0, accuracy: 20, altitude: 700, altitudeAccuracy: 50},
      timestamp: new Date(1)
    }}

  const resultingState = locationReducer(undefined, geolocationUpdate(payload))
  t.deepEqual(resultingState, shouldBeState, 'Reducer handles geolocation update okay')
  t.end()
})

test('Let\'s break some invariants!', (t) => {
  t.throws(locationReducer.bind(this, undefined, geolocationUpdate({'whatever': 'yo'}, true)), 'error is true and payload is not an Error()')

  t.throws(locationReducer.bind(this, undefined, geolocationUpdate(new Error(), false)), 'error is true and payload is a damn Error()')

  t.throws(locationReducer.bind(this, undefined, geolocationUpdate({'whatever': 'yo'}, false)), 'error is false but there is no position anywhere to be seen')

  t.end()
})
