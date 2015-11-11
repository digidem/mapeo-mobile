
import { reduxReactRouter, routerStateReducer } from 'redux-router'
import { createHistory } from 'history'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
// import { combineReducers } from 'redux-immutablejs'
import thunk from 'redux-thunk'
import catchErrors from './middleware/catch_errors'
import * as reducers from './reducers/reducers'
// For tap events to work with Material UI
import { devTools } from 'redux-devtools'

const reducer = combineReducers({
  router: routerStateReducer,
  ...reducers})

let store
if (process.env.NODE_ENV === 'development') {
  store = compose(
    reduxReactRouter({createHistory}),
    devTools()
  )(createStore)(reducer)
} else {
  store = compose(
    applyMiddleware(thunk, catchErrors),
    reduxReactRouter({createHistory}),
  )(createStore)(reducer)
}

export default store
