import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import store from './redux/store'
import App from './components/app'

import { ReduxRouter } from 'redux-router'
import { Route } from 'react-router'
import { Provider } from 'react-redux'
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react'

class Root extends Component {
  render () {
    return (
      <div>
        <Provider store={store}>
          <ReduxRouter>
            <Route path='/' component={App} />
          </ReduxRouter>
        </Provider>
        <DebugPanel top right bottom>
          <DevTools store={store} monitor={LogMonitor} />
        </DebugPanel>
      </div>
    )
  }
}

ReactDOM.render(<Root />, document.getElementById('root'))
