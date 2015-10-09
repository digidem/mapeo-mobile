import { createStore, applyMiddleware } from 'redux'
import { combineReducers } from 'redux-immutablejs'
import thunk from 'redux-thunk'
import promise from 'redux-promise'
import createLogger from 'redux-logger'

import * as reducers from './reducers/reducers'
import Immutable from 'immutable'

console.log('\n\n\n\n\n===========')
console.log('Vai entrar no combineReducers')
const reducer = combineReducers(reducers)
console.log('Passou do combineReducers')
const state = Immutable.fromJS({})

// If we are developing, we apply logger middleware
let createStoreWithMiddleware
if (process.env.NODE_ENV === 'development') {
  const logger = createLogger()
  createStoreWithMiddleware = applyMiddleware(thunk, promise, logger)(createStore)
} else {
  createStoreWithMiddleware = applyMiddleware(thunk)(createStore)
}
console.log('Vai criar a store')
//const store = createStoreWithMiddleware(reducer)
const store = createStore(reducer)
console.log('Passou do applyMiddleware')
export default store
