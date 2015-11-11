// var test = require('tape')
// import * as actions from '../redux/actions/actions'
// import * as reducers from '../redux/reducers/reducers'
// var Immutable = require('immutable')
// var equal = require('deep-equal')
// var uuid = require('uuid')
//
// // //////////////////
// // Places Reducer //
// // //////////////////
//
// test('Places reducer', function (t) {
//   t.plan(6)
//
//   t.deepEqual(reducers.places(undefined, {}), Immutable.List(), 'Places Reducer returns an empty list as default')
//
//   let test_id = uuid.v1()
//   let placeAddAction = actions.placeAdd(
//     'casa do Pai Tomás',
//     -23.73454,
//     -47.987,
//     test_id
//   )
//
//   let firstState = Immutable.fromJS([
//     {
//       text: 'casa do Pai Tomás',
//       lat: -23.73454,
//       lng: -47.987,
//       _id: test_id
//     }
//   ])
//   console.log(reducers.places(undefined, placeAddAction))
//   console.log(firstState)
//   console.log('É igual pelo immutable?' + Immutable.is(reducers.places(undefined, placeAddAction), firstState))
//   console.log('É igual pelo equals?' + equal(reducers.places(undefined, placeAddAction), firstState), {strict: true})
//   t.deepEqual(reducers.places(undefined, placeAddAction).toJS(), firstState.toJS(), 'Reducer handdles PLACE_ADD')
//
//   let placeEditAction = actions.placeEdit(
//     'EMEF Lourenço Filho',
//     -23.73454,
//     -47.987,
//     test_id
//   )
//
//   var secondState = Immutable.fromJS([
//     {
//       text: 'EMEF Lourenço Filho',
//       lat: -23.73454,
//       lng: -47.987,
//       _id: test_id
//     }
//   ])
//
//   t.deepEqual(reducers.places(undefined, placeEditAction), Immutable.List(), 'Reducer handles PLACE_EDIT on empty state')
//
//   let composedEditReducer = reducers.places(reducers.places(undefined, placeAddAction), placeEditAction)
//   t.ok(Immutable.is(composedEditReducer, secondState), 'PLACE_EDIT works fine')
//
//   let placeRemoveAction = actions.placeRemove(test_id)
//   t.deepEqual(reducers.places(undefined, placeRemoveAction), Immutable.List(), 'Reducer handles PLACE_REMOVE on empty state')
//
//   let composedRemovalReducer = reducers.places(reducers.places(undefined, placeAddAction), placeRemoveAction)
//   t.deepEqual(composedRemovalReducer, Immutable.List(), 'Composition of adding action and removing action works')
// })
//
// // //////////////////
// // Events Reducer //
// // //////////////////
//
// test('Events reducer', function (t) {
//   t.plan(6)
//
//   t.deepEqual(reducers.events(undefined, {}), Immutable.List(), 'Events Reducer returns an empty list as default')
//
//   let test_id = uuid.v1()
//   let eventAddAction = actions.eventAdd(
//     'casa do Pai Tomás',
//     -23.73454,
//     -47.987,
//     test_id
//   )
//
//   let eventEditAction = actions.eventEdit(
//     'casa do Pai Tomás',
//     -23.73454,
//     -47.987,
//     test_id
//   )
//
//   let eventRemoveAction = actions.eventRemove(test_id)
//
//   let firstState = Immutable.fromJS([
//     {
//       text: 'casa do Pai Tomás',
//       lat: -23.73454,
//       lng: -47.987,
//       _id: test_id
//     }
//   ])
//
//   let secondState = Immutable.fromJS([
//     {
//       text: 'casa do Pai Tomás',
//       lat: -23.73454,
//       lng: -47.987,
//       _id: test_id
//     }
//   ])
//
//   t.deepEqual(reducers.events(undefined, eventAddAction).toJS(), firstState.toJS(), 'Reducer handdles EVENT_ADD')
//
//   t.deepEqual(reducers.events(undefined, eventEditAction), Immutable.List(), 'Reducer handles EVENT_EDIT on empty state')
//
//   let composedEditReducer = reducers.events(reducers.events(undefined, eventAddAction), eventEditAction)
//   t.ok(Immutable.is(composedEditReducer, secondState), 'EVENT_EDIT works fine')
//
//   t.deepEqual(reducers.events(undefined, eventRemoveAction), Immutable.List(), 'Reducer handles EVENT_REMOVE on empty state')
//
//   let composedReducerState = reducers.events(reducers.events(undefined, eventAddAction), eventRemoveAction)
//
//   t.deepEqual(composedReducerState, Immutable.List(), 'Composition of adding action and removing action works')
// })
//
// // Observations Reducer<<Docblockr:Decorate>>
//
// test('Observations reducer', function (t) {
//   t.plan(6)
//
//   t.deepEqual(reducers.observations(undefined, {}), Immutable.List(), 'Observations Reducer returns an empty list as default')
//
//   let test_id = uuid.v1()
//   let observationAddAction = actions.observationAdd(
//     'casa do Pai Tomás',
//     -23.73454,
//     -47.987,
//     test_id
//   )
//
//   let observationEditAction = actions.observationEdit(
//     'casa do Pai Tomás',
//     -23.73454,
//     -47.987,
//     test_id
//   )
//
//   let observationRemoveAction = actions.observationRemove(test_id)
//
//   let firstState = Immutable.fromJS([
//     {
//       text: 'casa do Pai Tomás',
//       lat: -23.73454,
//       lng: -47.987,
//       _id: test_id
//     }
//   ])
//
//   let secondState = Immutable.fromJS([
//     {
//       text: 'casa do Pai Tomás',
//       lat: -23.73454,
//       lng: -47.987,
//       _id: test_id
//     }
//   ])
//
//   t.deepEqual(reducers.observations(undefined, observationAddAction).toJS(), firstState.toJS(), 'Reducer handdles OBSERVATION_ADD')
//
//   t.deepEqual(reducers.observations(undefined, observationEditAction), Immutable.List(), 'Reducer handles OBSERVATION_EDIT on empty state')
//
//   let composedEditReducer = reducers.observations(reducers.observations(undefined, observationAddAction), observationEditAction)
//   t.ok(Immutable.is(composedEditReducer, secondState), 'OBSERVATION_EDIT works fine')
//
//   t.deepEqual(reducers.observations(undefined, observationRemoveAction), Immutable.List(), 'Reducer handles OBSERVATION_REMOVE on empty state')
//
//   let composedReducerState = reducers.observations(reducers.events(undefined, observationAddAction), observationRemoveAction)
//
//   t.deepEqual(composedReducerState, Immutable.List(), 'Composition of adding action and removing action works')
// })
