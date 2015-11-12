// let test = require('tape')
// import store from '../src/store'
// import * as actions from '../src/actions/actions'
// import Immutable from 'immutable'
//
// test('Store testing', function (t) {
//   t.plan(16)
//
//   // ////////////////////////////
//   // First test, store exists  //
//   // ////////////////////////////
//
//   t.ok(store, 'Store exists')
//
//   // /////////////////////////////
//   // dispatch placeAdd actions  //
//   // /////////////////////////////
//
//   store.dispatch(actions.placeAdd(
//     'casa do Pai Tomás',
//     -23.73454,
//     -47.987,
//     'place-1'
//   ))
//
//   const firstPlaceAddResult = Immutable.fromJS({
//     observations: [],
//     events: [],
//     places: [{
//       text: 'casa do Pai Tomás',
//       lat: -23.73454,
//       lng: -47.987,
//       _id: 'place-1'
//     }]
//   })
//   t.ok(Immutable.is(store.getState(), firstPlaceAddResult), 'First place added')
//
//   store.dispatch(actions.placeAdd(
//     'casa do Pai Tomás 2 a missão',
//     -23.73454,
//     -47.987,
//     'place-2'
//   ))
//
//   const secondPlaceAddResult = firstPlaceAddResult.updateIn(['places'], obs => obs.push(Immutable.Map({
//     text: 'casa do Pai Tomás 2 a missão',
//     lat: -23.73454,
//     lng: -47.987,
//     _id: 'place-2'
//   })))
//
//   t.ok(Immutable.is(store.getState(), secondPlaceAddResult), 'Second place added')
//
//   // //////////////////////////////
//   // dispatch placeEdit actions  //
//   // //////////////////////////////
//
//   store.dispatch(actions.placeEdit(
//     'Machu Pichu',
//     -13.1639,
//     -72.54583,
//     'place-1'
//   ))
//
//   const placeEditionResult = secondPlaceAddResult.updateIn(['places'], obs => obs.map(x =>
//     x.get('_id') === 'place-1'
//     ? Immutable.Map({text: 'Machu Pichu', lat: -13.1639, lng: -72.54583, _id: 'place-1'})
//     : x
//   ))
//
//   t.ok(Immutable.is(store.getState(), placeEditionResult), 'Place edition OK')
//
//   // /////////////////////////////
//   // dispatch eventAdd actions  //
//   // /////////////////////////////
//
//   store.dispatch(actions.eventAdd(
//     'Burning Man Festival 2016',
//     -23.73454,
//     -47.987,
//     'event-1'
//   ))
//   const firstEventAddResult = placeEditionResult.updateIn(['events'], obs => obs.push(Immutable.Map({
//     text: 'Burning Man Festival 2016',
//     lat: -23.73454,
//     lng: -47.987,
//     _id: 'event-1'
//   })))
//
//   t.ok(Immutable.is(store.getState(), firstEventAddResult), 'First event added')
//
//   store.dispatch(actions.eventAdd(
//     'Hobbitcon 2016',
//     -23.73454,
//     -47.987,
//     'event-2'
//   ))
//
//   const secondEventAddResult = firstEventAddResult.updateIn(['events'], obs => obs.push(Immutable.Map({
//     text: 'Hobbitcon 2016',
//     lat: -23.73454,
//     lng: -47.987,
//     _id: 'event-2'
//   })))
//
//   t.ok(Immutable.is(store.getState(), secondEventAddResult), 'Second event added')
//
//   // //////////////////////////////
//   // dispatch eventEdit actions  //
//   // //////////////////////////////
//
//   store.dispatch(actions.eventEdit(
//     'Cortez arrived. DAMN!',
//     -13.1639,
//     -72.54583,
//     'event-1'
//   ))
//
//   const eventEditionResult = secondEventAddResult.updateIn(['events'], obs => obs.map(x =>
//     x.get('_id') === 'event-1'
//     ? Immutable.Map({text: 'Cortez arrived. DAMN!', lat: -13.1639, lng: -72.54583, _id: 'event-1'})
//     : x
//   ))
//
//   t.ok(Immutable.is(store.getState(), eventEditionResult), 'Event edition OK')
//
//   // ///////////////////////////////////
//   // dispatch observationAdd actions  //
//   // ///////////////////////////////////
//
//   store.dispatch(actions.observationAdd(
//     'The Festival is crazy, yo!',
//     -23.73454,
//     -47.987,
//     'observation-1'
//   ))
//   const firstObservationAddResult = eventEditionResult.updateIn(['observations'], obs => obs.push(Immutable.Map({
//     text: 'The Festival is crazy, yo!',
//     lat: -23.73454,
//     lng: -47.987,
//     _id: 'observation-1'
//   })))
//
//   t.ok(Immutable.is(store.getState(), firstObservationAddResult), 'First observation added')
//
//   store.dispatch(actions.observationAdd(
//     'I am yet to see somethin as crazy as here',
//     -23.73454,
//     -47.987,
//     'observation-2'
//   ))
//   const secondObservationAddResult = firstObservationAddResult.updateIn(['observations'], obs => obs.push(Immutable.Map({
//     text: 'I am yet to see somethin as crazy as here',
//     lat: -23.73454,
//     lng: -47.987,
//     _id: 'observation-2'
//   })))
//   t.ok(Immutable.is(store.getState(), secondObservationAddResult), 'second observation added')
//
//   // ////////////////////////////////////
//   // dispatch obeservationEdit action //
//   // ////////////////////////////////////
//
//   store.dispatch(actions.observationEdit(
//     'This Cortez stuff is not gonna end well',
//     -13.1639,
//     -72.54583,
//     'observation-1'
//   ))
//
//   const observationEditionResult = secondObservationAddResult.updateIn(['observations'], obs => obs.map(x =>
//     x.get('_id') === 'observation-1'
//     ? Immutable.Map({text: 'This Cortez stuff is not gonna end well', lat: -13.1639, lng: -72.54583, _id: 'observation-1'})
//     : x
//   ))
//
//   t.ok(Immutable.is(store.getState(), observationEditionResult), 'Observation edition OK')
//
//   // //////////////////////////////////////////
//   // dispatch placeRemove actions            //
//   // //////////////////////////////////////////
//
//   store.dispatch(actions.placeRemove('place-whatever-dont-match'))
//   t.ok(Immutable.is(store.getState(), observationEditionResult), 'Remove place that does not exist, just returns store')
//
//   store.dispatch(actions.placeRemove('place-1'))
//   const firstPlaceRemoveResult = observationEditionResult.updateIn(['places'], el => el.filter(x => x.get('_id') !== 'place-1'))
//   t.ok(Immutable.is(store.getState(), firstPlaceRemoveResult), 'Remove place that does exist')
//
//   // /////////////////////////////////
//   // dispatch eventRemove actions   //
//   // /////////////////////////////////
//
//   store.dispatch(actions.eventRemove('event-whatever-dont-match'))
//   t.ok(Immutable.is(store.getState(), firstPlaceRemoveResult), 'Remove event that does not exist, just returns store')
//
//   store.dispatch(actions.eventRemove('event-1'))
//   const firstEventRemoveResult = firstPlaceRemoveResult.updateIn(['events'], el => el.filter(x => x.get('_id') !== 'event-1'))
//   t.ok(Immutable.is(store.getState(), firstEventRemoveResult), 'Remove event that does exist')
//
//   // ///////////////////////////////////////
//   // dispatch observationRemove actions   //
//   // ///////////////////////////////////////
//
//   store.dispatch(actions.observationRemove('observation-whatever-dont-match'))
//   t.ok(Immutable.is(store.getState(), firstEventRemoveResult), 'Remove observation that does not exist, just returns store')
//
//   store.dispatch(actions.observationRemove('observation-1'))
//   const firstObservationRemoveResult = firstEventRemoveResult.updateIn(['observations'], el => el.filter(x => x.get('_id') !== 'observation-1'))
//   t.ok(Immutable.is(store.getState(), firstObservationRemoveResult), 'Remove observation that does exist')
// })
