import React from 'react'
import { Router, Route } from 'react-router'
import { IntlProvider } from 'react-intl'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import { syncReduxAndRouter, routeReducer } from 'redux-simple-router'
import createLogger from 'redux-logger'

import App from './app'
import {
  Location,
  Media,
  Category,
  Details
} from '../components'

const formats = {
  time: {
    short: {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }
  }
}

const reducer = (state = {}, action) => {
  return {
    routing: routeReducer(state.routing, action)
  }
}

const logger = createLogger()
const createStoreWithMiddleWare = applyMiddleware(logger)(createStore)
const store = createStoreWithMiddleWare(reducer)
const history = createBrowserHistory()

syncReduxAndRouter(history, store)

export default () => (
  <Provider store={store}>
    <IntlProvider locale='en' formats={formats}>
      <Router>
        <Route path='/(:type/:id)' component={App}>
          <Route path='location' component={Location} />
          <Route path='media' component={Media} />
          <Route path='category' component={Category} />
          <Route path='details' component={Details} />
        </Route>
      </Router>
    </IntlProvider>
  </Provider>
)
