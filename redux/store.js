import { createStore, applyMiddleware, compose } from 'redux'
import { reduxReactRouter, routerStateReducer } from 'redux-router'
import { createHistory } from 'history'
import { combineReducers } from 'redux-immutablejs'
import { devTools } from 'redux-devtools'
import thunk from 'redux-thunk'
import promise from 'redux-promise'
import createLogger from 'redux-logger'
import * as reducers from './reducers/reducers'
import routes from '../routes'

const reducer = combineReducers({
  router: routerStateReducer,
  ...reducers})

// If we are developing, we apply logger middleware
let createStoreWithMiddleware
if (process.env.NODE_ENV === 'development') {
  const logger = createLogger({ logger: logger || console })
  createStoreWithMiddleware = compose(
    applyMiddleware(thunk, promise, logger),
    reduxReactRouter({createHistory}),
    devTools()
  )(createStore)
} else {
  createStoreWithMiddleware = applyMiddleware(thunk)(createStore)
}
const store = createStoreWithMiddleware(reducer)
export default store
