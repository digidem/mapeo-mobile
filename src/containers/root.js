import React from 'react'
import { Router, Route } from 'react-router'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'

import App from './app'
import store from '../store'
import {
  Location,
  Media,
  Category,
  Details,
  ObservationEdit,
  PlaceEdit,
  EventEdit
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

export default () => (
  <Provider store={store}>
    <IntlProvider locale='en' formats={formats}>
      <Router>
        <Route path='/(:type)' component={App}>
          <Route path='/observation/:id' component={ObservationEdit}>
            <Route path='location' component={Location} />
            <Route path='media' component={Media} />
            <Route path='category' component={Category} />
            <Route path='details' component={Details} />
          </Route>
          <Route path='/event/:id' component={EventEdit} />
          <Route path='/place/:id' component={PlaceEdit} />
        </Route>
      </Router>
    </IntlProvider>
  </Provider>
)
