import React from 'react'
import ReactDOM from 'react-dom'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'

import routes from './routes'
import store from './store'

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

const rootDiv = document.getElementById('content')

ReactDOM.render(
  <Provider store={store}>
    <IntlProvider locale='en' formats={formats}>
      {routes}
    </IntlProvider>
  </Provider>
, rootDiv)
