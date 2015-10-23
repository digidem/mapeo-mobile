let test = require('tape')
import store from '../redux/store'
import * as actions from '../redux/actions/actions'
import Immutable from 'immutable'

test('Store testing', function (t) {
  t.plan(13)

  // ======================== //
  // First test, store exists //
  // ======================== //
  t.ok(store, 'Store exists')

  // ===================================== //
  // dispatch placeAdd actions             //
  // ===================================== //
  store.dispatch(actions.placeAdd(
    'casa do Pai Tomás',
    -23.73454,
    -47.987,
    'place-1'
  ))

  const firstActionResult = Immutable.fromJS({
    observations: [],
    events: [],
    places: [{
      text: 'casa do Pai Tomás',
      lat: -23.73454,
      lng: -47.987,
      _id: 'place-1'
    }]
  })
  t.ok(Immutable.is(store.getState(), firstActionResult), 'First place added')

  store.dispatch(actions.placeAdd(
    'casa do Pai Tomás 2 a missão',
    -23.73454,
    -47.987,
    'place-2'
  ))

  const secondActionResult = firstActionResult.updateIn(['places'], obs => obs.push(Immutable.Map({
    text: 'casa do Pai Tomás 2 a missão',
    lat: -23.73454,
    lng: -47.987,
    _id: 'place-2'
  })))

  t.ok(Immutable.is(store.getState(), secondActionResult), 'Second place added')

  // ========================= //
  // dispatch eventAdd actions //
  // ========================= //
  store.dispatch(actions.eventAdd(
    'Burning Man Festival 2016',
    -23.73454,
    -47.987,
    'event-1'
  ))
  const thirdActionResult = secondActionResult.updateIn(['events'], obs => obs.push(Immutable.Map({
    text: 'Burning Man Festival 2016',
    lat: -23.73454,
    lng: -47.987,
    _id: 'event-1'
  })))

  t.ok(Immutable.is(store.getState(), thirdActionResult), 'First event added')

  store.dispatch(actions.eventAdd(
    'Hobbitcon 2016',
    -23.73454,
    -47.987,
    'event-2'
  ))

  const fourthActionResult = thirdActionResult.updateIn(['events'], obs => obs.push(Immutable.Map({
    text: 'Hobbitcon 2016',
    lat: -23.73454,
    lng: -47.987,
    _id: 'event-2'
  })))

  t.ok(Immutable.is(store.getState(), fourthActionResult), 'Second event added')

  // =============================== //
  // dispatch observationAdd actions //
  // =============================== //
  store.dispatch(actions.observationAdd(
    'The Festival is crazy, yo!',
    -23.73454,
    -47.987,
    'observation-1'
  ))
  const fifthActionResult = fourthActionResult.updateIn(['observations'], obs => obs.push(Immutable.Map({
    text: 'The Festival is crazy, yo!',
    lat: -23.73454,
    lng: -47.987,
    _id: 'observation-1'
  })))

  t.ok(Immutable.is(store.getState(), fifthActionResult), 'First observation added')

  store.dispatch(actions.observationAdd(
    'I am yet to see somethin as crazy as here',
    -23.73454,
    -47.987,
    'observation-2'
  ))
  const sixthActionResult = fifthActionResult.updateIn(['observations'], obs => obs.push(Immutable.Map({
    text: 'I am yet to see somethin as crazy as here',
    lat: -23.73454,
    lng: -47.987,
    _id: 'observation-2'
  })))
  t.ok(Immutable.is(store.getState(), sixthActionResult), 'second observation added')

  // ===================================== //
  // dispatch placeRemove actions          //
  // ===================================== //

  store.dispatch(actions.placeRemove('place-whatever-dont-match'))
  t.ok(Immutable.is(store.getState(), sixthActionResult), 'Remove place that does not exist, just returns store')

  store.dispatch(actions.placeRemove('place-1'))
  const seventhActionResult = sixthActionResult.updateIn(['places'], el => el.filter(x => x.get('_id') !== 'place-1'))
  t.ok(Immutable.is(store.getState(), seventhActionResult), 'Remove place that does exist')

  // ===================================== //
  // dispatch eventRemove actions          //
  // ===================================== //

  store.dispatch(actions.eventRemove('event-whatever-dont-match'))
  t.ok(Immutable.is(store.getState(), seventhActionResult), 'Remove event that does not exist, just returns store')

  store.dispatch(actions.eventRemove('event-1'))
  const eighthActionResult = seventhActionResult.updateIn(['events'], el => el.filter(x => x.get('_id') !== 'event-1'))
  t.ok(Immutable.is(store.getState(), eighthActionResult), 'Remove event that does exist')
  // ===================================== //
  // dispatch observationRemove actions    //
  // ===================================== //

  store.dispatch(actions.observationRemove('observation-whatever-dont-match'))
  t.ok(Immutable.is(store.getState(), eighthActionResult), 'Remove observation that does not exist, just returns store')

  store.dispatch(actions.observationRemove('observation-1'))
  const ninthActionResult = eighthActionResult.updateIn(['observations'], el => el.filter(x => x.get('_id') !== 'observation-1'))
  t.ok(Immutable.is(store.getState(), ninthActionResult), 'Remove observation that does exist')
})
