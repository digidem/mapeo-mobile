import React, { Component } from 'react'
import { connect } from 'react-redux'
import AppBar from 'material-ui/lib/app-bar'

class App extends Component {
  render () {
    return (
      <div>
        <AppBar title = 'Title'
          iconClassNameRight = 'muidocs-icon-navigation-expand-more' / >
        <h1> App Container </h1>
        <h2> E a rota é: {this.props.location.pathname}</h2>
      </div>
    )
  }
}

// export default App

export default connect(state => state.router)(App)
