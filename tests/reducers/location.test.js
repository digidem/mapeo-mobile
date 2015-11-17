import test from 'prova'
import { location as locationReducer } from '../../src/reducers'
import { geolocationUpdate } from '../../src/action_creators'
import { geolocationErrors } from '../../src/constants'

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

// test('Reducer handles geolocation Error', (t) => {
//
//   t.deepEqual(resultingState, shouldBeState, 'Reducer handles geolocation Error okay')
// })

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
  t.plan(4)

  try {
    t.throws(locationReducer(undefined, geolocationUpdate({'whatever': 'yo'}, true)))
    t.fail('invariant did not work as planned')
  } catch (e) {
    t.pass('error is true and payload is not an Error()')
  }

  try {
    locationReducer(undefined, geolocationUpdate(new Error(), false))
    t.fail('invariant did not work as planned')
  } catch (e) {
    t.pass('error is true and payload is a damn Error()')
  }

  try {
    locationReducer(undefined, geolocationUpdate({'whatever': 'yo'}, false))
    t.fail('invariant did not work as planned')
  } catch (e) {
    t.pass('error is false but there is no position anywhere to be seen')
  }

  try {
    locationReducer(undefined, geolocationUpdate(new Error(), true))
    t.pass('the try/catch madness block actually works')
  } catch (e) {
    t.fail('invariant did not work as planned')
  }
})
