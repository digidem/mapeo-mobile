import React from 'react'
import { Router, Route } from 'react-router'

import App from './containers/app'
import {
  Location,
  Media,
  Category,
  Details,
  ObservationEdit,
  PlaceEdit,
  EventEdit
} from './components'

const routes = (
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
)

export default routes
