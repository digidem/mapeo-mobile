import { reduxReactRouter, routerStateReducer } from 'redux-router'
import { createHistory } from 'history'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
// For tap events to work with Material UI
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

// import { combineReducers } from 'redux-immutablejs'
import { devTools } from 'redux-devtools'
// import thunk from 'redux-thunk'
// import promise from 'redux-promise'
// import createLogger from 'redux-logger'
import * as reducers from './reducers/reducers'

const reducer = combineReducers({
  router: routerStateReducer,
  ...reducers})

// If we are developing, we apply logger middleware
// let createStoreWithMiddleware
// let store
// if (process.env.NODE_ENV === 'development') {
  // const logger = createLogger({ logger: logger || console })
  const store = compose(
    reduxReactRouter({createHistory}),
    devTools()
  )(createStore)(reducer)
// } else {
//   store = compose(
//     applyMiddleware(thunk),
//     reduxReactRouter({createHistory}),
//   )(createStore)(reducer)
// }
// const store = createStoreWithMiddleware(reducer)
export default store
