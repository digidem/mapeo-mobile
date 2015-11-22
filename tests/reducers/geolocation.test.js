import test from 'prova'
import { geolocation as locationReducer } from '../../src/reducers'
import { geolocationUpdate } from '../../src/action_creators'
import { geolocationErrors } from '../../src/constants'

const emptyMeta = {
  accuracy: null,
  altitude: null,
  altitudeAccuracy: null,
  heading: null,
  speed: null
}

test('Default state', (t) => {
  const defaultState = locationReducer(undefined, {type: 'whatever'})

  t.equal(defaultState.coords, null, 'Coords null')
  t.deepEqual(defaultState.meta, emptyMeta, 'Default meta object does not have any values')
  t.true(defaultState.positionError instanceof Error, 'Defaults to location error')
  t.true(Number.isInteger(defaultState.positionError.code), 'Error code should be an integer')
  t.equal(defaultState.positionError.code, geolocationErrors.POSITION_UNAVAILABLE, 'Default error type is "POSITION_UNAVAILABLE"')
  t.equal(defaultState.timestamp, null, 'Timestamp null')
  t.end()
})

test('Ignores actions when type is not "GEOLOCATION_UPDATE"', (t) => {
  const state = {}
  const newState = locationReducer(state, {type: 'whatever'})
  t.equal(state, newState, 'state is unchanged by action')
  t.end()
})

test('Error handling - no error code', (t) => {
  const errorWithNoCode = new Error()

  const initialState = {
    coords: [-59.5, 2.7],
    meta: emptyMeta,
    positionError: null,
    timestamp: 1447803656154
  }

  const newState = locationReducer(initialState, geolocationUpdate(errorWithNoCode, true))

  t.equal(initialState.coords, newState.coords, 'Coordinates are not changed')
  t.equal(initialState.meta, newState.meta, 'meta is not changed')
  t.equal(initialState.timestamp, newState.timestamp, 'timestamp is not changed')
  t.true(newState.positionError instanceof Error, 'positionError is instance of Error')
  t.equal(newState.positionError.code, geolocationErrors.POSITION_UNAVAILABLE, 'positionError default code is "POSITION_UNAVAILABLE"')
  t.end()
})

test('Error handling - geolocation position denied Error', (t) => {
  const positionDeniedError = new Error('Geolocation permission denied')
  positionDeniedError.code = geolocationErrors.PERMISSION_DENIED

  const initialState = {
    coords: [-59.5, 2.7],
    meta: emptyMeta,
    positionError: null,
    timestamp: 1447803656154
  }

  const newState = locationReducer(initialState, geolocationUpdate(positionDeniedError, true))
  t.equal(initialState.coords, newState.coords, 'Coordinates are not changed')
  t.equal(initialState.meta, newState.meta, 'meta is not changed')
  t.equal(initialState.timestamp, newState.timestamp, 'timestamp is not changed')
  t.true(newState.positionError instanceof Error, 'positionError is changed to Error')
  t.equal(newState.positionError.code, geolocationErrors.PERMISSION_DENIED, 'positionError default code is "POSITION_UNAVAILABLE"')
  t.end()
})

test('Geolocation update updates state', (t) => {
  const initialState = {
    coords: [-59.5, 2.7],
    meta: emptyMeta,
    positionError: new Error(),
    timestamp: 1447803656154
  }

  const payload = {
    position: {
      coords: {longitude: 0, latitude: 0, accuracy: 20, altitude: 700, altitudeAccuracy: 50},
      timestamp: new Date(1)
    }}

  const {longitude, latitude, ...expectedMeta} = payload.position.coords
  const expectedCoords = [longitude, latitude]

  const newState = locationReducer(initialState, geolocationUpdate(payload))

  t.deepEqual(newState.coords, expectedCoords, 'Coords are updated to new coords')
  t.deepEqual(newState.meta, expectedMeta, 'Meta is updated to new meta')
  t.equal(newState.positionError, null, 'positionError is set to null')
  t.equal(newState.timestamp, payload.position.timestamp, 'Timestamp is updated to timestamp of new position')
  t.end()
})

test('Let\'s break some invariants!', (t) => {
  t.throws(locationReducer.bind(null, undefined, geolocationUpdate({'whatever': 'yo'}, false)), 'Throws if error is false but there is no position anywhere to be seen')
  t.end()
})
