let test = require('tape')
import store from '../redux/store'
import * as actions from '../redux/actions/actions'
import Immutable from 'immutable'

test('Store testing', function (t) {
  t.plan(5)

  // ======================== //
  // First test, store exists //
  // ======================== //
  t.ok(store, 'Store exists')

  // ===================================== //
  // Second test, dispatch action placeAdd //
  // ===================================== //
  store.dispatch(actions.placeAdd(
    'casa do Pai Tomás',
    -23.73454,
    -47.987
  ))

  const firstActionResult = Immutable.fromJS({
    observations: [],
    events: [],
    places: [{
      text: 'casa do Pai Tomás',
      lat: -23.73454,
      lng: -47.987
    }]
  })
  t.ok(Immutable.is(store.getState(), firstActionResult), 'First place added')

  // ======================== //
  // dispatch action eventAdd //
  // ======================== //
  store.dispatch(actions.eventAdd(
    'Burning Man Festival 2016',
    -23.73454,
    -47.987
  ))
  const secondActionResult = firstActionResult.updateIn(['events'], obs => obs.push(Immutable.Map({
    text: 'Burning Man Festival 2016',
    lat: -23.73454,
    lng: -47.987
  })))

  t.ok(Immutable.is(store.getState(), secondActionResult), 'First event added')

  // ============================== //
  // dispatch action observationAdd //
  // ============================== //
  store.dispatch(actions.observationAdd(
    'The Festival is crazy, yo!',
    -23.73454,
    -47.987
  ))
  const thirdActionResult = secondActionResult.updateIn(['observations'], obs => obs.push(Immutable.Map({
    text: 'The Festival is crazy, yo!',
    lat: -23.73454,
    lng: -47.987
  })))

  t.ok(Immutable.is(store.getState(), thirdActionResult), 'First observation added')

  // ======================================================================= //
  // Dispatch a second observation, because we need to see what happens when //
  // there are several actions in one store
  // ======================================================================= //
  store.dispatch(actions.observationAdd(
    'I am yet to see somethin as crazy as here',
    -23.73454,
    -47.987
  ))
  const fourthActionResult = thirdActionResult.updateIn(['observations'], obs => obs.push(Immutable.Map({
    text: 'I am yet to see somethin as crazy as here',
    lat: -23.73454,
    lng: -47.987
  })))
  t.ok(Immutable.is(store.getState(), fourthActionResult), 'second observation added')
})
