var test = require('tape')
import * as actions from '../redux/actions/actions'
import * as reducers from '../redux/reducers/reducers'
import Immutable from 'immutable'
var equal = require('deep-equal')

test('Places reducer', function (t) {
  t.plan(2)

  t.deepEqual(reducers.places(undefined, {}), Immutable.List(), 'Places Reducer returns an empty list as default')

  let firstPlace = actions.placeAdd(
    'casa do Pai Tomás',
    -23.73454,
    -47.987
  )

  let firstState = Immutable.fromJS([
    {
      text: 'casa do Pai Tomás',
      lat: -23.73454,
      lng: -47.987
    }
  ])
  console.log(reducers.places(undefined, firstPlace))
  console.log(firstState)
  console.log('É igual pelo immutable?' + Immutable.is(reducers.places(undefined, firstPlace), firstState))
  console.log('É igual pelo equals?' + equal(reducers.places(undefined, firstPlace), firstState), {strict: true})
  t.deepEqual(reducers.places(undefined, firstPlace).toJS(), firstState.toJS(), 'Reducer handdles PLACE_ADD')
})

test('Events reducer', function (t) {
  t.plan(2)

  t.deepEqual(reducers.events(undefined, {}), Immutable.List(), 'Events Reducer returns an empty list as default')

  let firstEvent = actions.eventAdd(
    'casa do Pai Tomás',
    -23.73454,
    -47.987
  )

  let firstState = Immutable.fromJS([
    {
      text: 'casa do Pai Tomás',
      lat: -23.73454,
      lng: -47.987
    }
  ])
  t.deepEqual(reducers.events(undefined, firstEvent).toJS(), firstState.toJS(), 'Reducer handdles EVENT_ADD')
})

test('Observations reducer', function (t) {
  t.plan(2)

  t.deepEqual(reducers.observations(undefined, {}), Immutable.List(), 'Observations Reducer returns an empty list as default')

  let firstEvent = actions.observationAdd(
    'casa do Pai Tomás',
    -23.73454,
    -47.987
  )

  let firstState = Immutable.fromJS([
    {
      text: 'casa do Pai Tomás',
      lat: -23.73454,
      lng: -47.987
    }
  ])
  t.deepEqual(reducers.observations(undefined, firstEvent).toJS(), firstState.toJS(), 'Reducer handdles OBSERVATION_ADD')
})
