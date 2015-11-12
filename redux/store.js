import createBrowserHistory from 'history/lib/createBrowserHistory'
import { syncReduxAndRouter, routeReducer } from 'redux-simple-router'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import createLogger from 'redux-logger'

import catchErrors from './middleware/catch_errors'
import * as reducers from './reducers'

const reducer = combineReducers({
  routing: routeReducer,
  ...reducers})

const logger = createLogger()
const createStoreWithMiddleWare = applyMiddleware(logger, catchErrors)(createStore)
const store = createStoreWithMiddleWare(reducer)
syncReduxAndRouter(createBrowserHistory(), store)

// let store
// if (process.env.NODE_ENV === 'development') {
//   store = compose(
//     reduxReactRouter({createHistory}),
//     devTools()
//   )(createStore)(reducer)
// } else {
//   store = compose(
//     applyMiddleware(thunk, catchErrors),
//     reduxReactRouter({createHistory}),
//   )(createStore)(reducer)
// }

export default store
