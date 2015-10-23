var test = require('tape')
import * as actions from '../redux/actions/actions'
import * as reducers from '../redux/reducers/reducers'
import Immutable from 'immutable'
var equal = require('deep-equal')
import uuid from 'uuid'

test('Places reducer', function (t) {
  t.plan(4)

  t.deepEqual(reducers.places(undefined, {}), Immutable.List(), 'Places Reducer returns an empty list as default')

  let test_id = uuid.v1()
  let placeAddAction = actions.placeAdd(
    'casa do Pai Tomás',
    -23.73454,
    -47.987,
    test_id
  )

  let firstState = Immutable.fromJS([
    {
      text: 'casa do Pai Tomás',
      lat: -23.73454,
      lng: -47.987,
      _id: test_id
    }
  ])
  console.log(reducers.places(undefined, placeAddAction))
  console.log(firstState)
  console.log('É igual pelo immutable?' + Immutable.is(reducers.places(undefined, placeAddAction), firstState))
  console.log('É igual pelo equals?' + equal(reducers.places(undefined, placeAddAction), firstState), {strict: true})
  t.deepEqual(reducers.places(undefined, placeAddAction).toJS(), firstState.toJS(), 'Reducer handdles PLACE_ADD')

  let placeRemoveAction = actions.placeRemove(test_id)
  t.deepEqual(reducers.places(undefined, placeRemoveAction), Immutable.List(), 'Reducer handles PLACE_REMOVE on empty state')

  let composedReducerState = reducers.places(reducers.places(undefined, placeAddAction), placeRemoveAction)
  t.deepEqual(composedReducerState, Immutable.List(), 'Composition of adding action and removing action works')
})

test('Events reducer', function (t) {
  t.plan(4)

  t.deepEqual(reducers.events(undefined, {}), Immutable.List(), 'Events Reducer returns an empty list as default')

  let test_id = uuid.v1()
  let eventAddAction = actions.eventAdd(
    'casa do Pai Tomás',
    -23.73454,
    -47.987,
    test_id
  )

  let eventRemoveAction = actions.eventRemove(test_id)

  let firstState = Immutable.fromJS([
    {
      text: 'casa do Pai Tomás',
      lat: -23.73454,
      lng: -47.987,
      _id: test_id
    }
  ])
  t.deepEqual(reducers.events(undefined, eventAddAction).toJS(), firstState.toJS(), 'Reducer handdles EVENT_ADD')

  t.deepEqual(reducers.events(undefined, eventRemoveAction), Immutable.List(), 'Reducer handles EVENT_REMOVE on empty state')

  let composedReducerState = reducers.events(reducers.events(undefined, eventAddAction), eventRemoveAction)

  t.deepEqual(composedReducerState, Immutable.List(), 'Composition of adding action and removing action works')
})

test('Observations reducer', function (t) {
  t.plan(4)

  t.deepEqual(reducers.observations(undefined, {}), Immutable.List(), 'Observations Reducer returns an empty list as default')

  let test_id = uuid.v1()
  let observationAddAction = actions.observationAdd(
    'casa do Pai Tomás',
    -23.73454,
    -47.987,
    test_id
  )

  let observationRemoveAction = actions.observationRemove(test_id)

  let firstState = Immutable.fromJS([
    {
      text: 'casa do Pai Tomás',
      lat: -23.73454,
      lng: -47.987,
      _id: test_id
    }
  ])
  t.deepEqual(reducers.observations(undefined, observationAddAction).toJS(), firstState.toJS(), 'Reducer handdles OBSERVATION_ADD')

  t.deepEqual(reducers.observations(undefined, observationRemoveAction), Immutable.List(), 'Reducer handles OBSERVATION_REMOVE on empty state')

  let composedReducerState = reducers.observations(reducers.events(undefined, observationAddAction), observationRemoveAction)

  t.deepEqual(composedReducerState, Immutable.List(), 'Composition of adding action and removing action works')
})
