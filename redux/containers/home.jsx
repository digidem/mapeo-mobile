import React, { PropTypes } from 'react'
import Colors from 'material-ui/lib/styles/colors'
import injectTapEventPlugin from 'react-tap-event-plugin'

import {
  ListView,
  MapView,
  AddButton } from '../components'

injectTapEventPlugin()

const style = {
  backgroundColor: Colors.grey300,
  position: 'absolute',
  overflowX: 'hidden',
  overflowY: 'scroll',
  width: '100%',
  height: '100%',
  WebkitOverflowScrolling: 'touch'
}

class Home extends React.Component {
  handleAddObservation = (e) => {
    this.props.onOpen(e, {
      id: 'new',
      type: 'observation'
    })
  }

  render () {
    return (
      <div style={style}>
        <MapView kind='small' />
        <AddButton
          onTouchTap={this.handleAddObservation}
        />
        <ListView
          onOpen={this.props.onOpen}
        />
      </div>
    )
  }
}

Home.propTypes = {
  onOpen: PropTypes.func
}

export default Home
