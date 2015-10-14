import { createStore, applyMiddleware } from 'redux'
import { combineReducers } from 'redux-immutablejs'
import thunk from 'redux-thunk'
import promise from 'redux-promise'
import createLogger from 'redux-logger'
import * as reducers from './reducers/reducers'

const reducer = combineReducers(reducers)

// If we are developing, we apply logger middleware
let createStoreWithMiddleware
if (process.env.NODE_ENV === 'development') {
  const logger = createLogger({ logger: logger || console })
  createStoreWithMiddleware = applyMiddleware(thunk, promise, logger)(createStore)
} else {
  createStoreWithMiddleware = applyMiddleware(thunk)(createStore)
}
const store = createStoreWithMiddleware(reducer)
export default store
