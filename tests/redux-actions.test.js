// var test = require('tape')
// import * as actions from '../src/actions/actions'
// import * as types from '../src/actions/actionTypes'
// import uuid from 'uuid'
//
// test('Action to add place', function (t) {
//   t.plan(1)
//   const text = 'Casa do Pai Tomás'
//   const lat = -23.73454
//   const lng = -47.987
//   const _id = uuid.v1()
//   const expected_action = {
//     type: types.PLACE_ADD,
//     data: {
//       text: text,
//       lat: lat,
//       lng: lng,
//       _id: _id
//     }
//   }
//   t.deepEqual(actions.placeAdd(text, lat, lng, _id), expected_action, 'Add Place Action OK')
// })
//
// test('Action to edit place', function (t) {
//   t.plan(1)
//   const text = 'Casa do Pai Tomás'
//   const lat = -23.73454
//   const lng = -47.987
//   const _id = uuid.v1()
//   const expected_action = {
//     type: types.PLACE_EDIT,
//     data: {
//       text: text,
//       lat: lat,
//       lng: lng,
//       _id: _id
//     }
//   }
//   t.deepEqual(actions.placeEdit(text, lat, lng, _id), expected_action, 'Edit Place Action OK')
// })
//
// test('Action to remove place', function (t) {
//   t.plan(1)
//   const _id = uuid.v1()
//   const expected_action = {
//     type: types.PLACE_REMOVE,
//     data: {
//       _id: _id
//     }
//   }
//   t.deepEqual(actions.placeRemove(_id), expected_action, 'Remove Place Action OK')
// })
//
// test('Action to add event', function (t) {
//   t.plan(1)
//   const text = 'Weird oil spill'
//   const lat = -23.73454
//   const lng = -47.987
//   const _id = uuid.v1()
//   const expected_action = {
//     type: types.EVENT_ADD,
//     data: {
//       text: text,
//       lat: lat,
//       lng: lng,
//       _id: _id
//     }
//   }
//   t.deepEqual(actions.eventAdd(text, lat, lng, _id), expected_action, 'Add Event Action OK')
// })
//
// test('Action to edit event', function (t) {
//   t.plan(1)
//   const text = 'Weird oil spill'
//   const lat = -23.73454
//   const lng = -47.987
//   const _id = uuid.v1()
//   const expected_action = {
//     type: types.EVENT_EDIT,
//     data: {
//       text: text,
//       lat: lat,
//       lng: lng,
//       _id: _id
//     }
//   }
//   t.deepEqual(actions.eventEdit(text, lat, lng, _id), expected_action, 'Edit Event Action OK')
// })
//
// test('Action to remove event', function (t) {
//   t.plan(1)
//   const _id = uuid.v1()
//   const expected_action = {
//     type: types.EVENT_REMOVE,
//     data: {
//       _id: _id
//     }
//   }
//   t.deepEqual(actions.eventRemove(_id), expected_action, 'Remove Event Action OK')
// })
//
// test('Action to add observation', function (t) {
//   t.plan(1)
//   const text = 'Maan, this spill is ugly'
//   const lat = -23.73454
//   const lng = -47.987
//   const _id = uuid.v1()
//   const expected_action = {
//     type: types.OBSERVATION_ADD,
//     data: {
//       text: text,
//       lat: lat,
//       lng: lng,
//       _id: _id
//     }
//   }
//   t.deepEqual(actions.observationAdd(text, lat, lng, _id), expected_action, 'Add Observation Action OK')
// })
//
// test('Action to edit observation', function (t) {
//   t.plan(1)
//   const text = 'Maan, this spill is ugly'
//   const lat = -23.73454
//   const lng = -47.987
//   const _id = uuid.v1()
//   const expected_action = {
//     type: types.OBSERVATION_EDIT,
//     data: {
//       text: text,
//       lat: lat,
//       lng: lng,
//       _id: _id
//     }
//   }
//   t.deepEqual(actions.observationEdit(text, lat, lng, _id), expected_action, 'Edit Observation Action OK')
// })
//
// test('Action to remove observation', function (t) {
//   t.plan(1)
//   const _id = uuid.v1()
//   const expected_action = {
//     type: types.OBSERVATION_REMOVE,
//     data: {
//       _id: _id
//     }
//   }
//   t.deepEqual(actions.observationRemove(_id), expected_action, 'Remove Observation Action OK')
// })
