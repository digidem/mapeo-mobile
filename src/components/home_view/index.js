import React, { PropTypes } from 'react'
import Colors from 'material-ui/lib/styles/colors'
import injectTapEventPlugin from 'react-tap-event-plugin'

import MyPropTypes from '../../util/prop_types'
import ListView from '../list_view'
import MapTransition from '../transitions/map_transition'
import MapView from '../map_view'
import AddButton from './add_button'

injectTapEventPlugin()

const styles = {
  wrapper: {
    backgroundColor: Colors.grey300,
    position: 'absolute',
    width: '100vw',
    height: '100vh',
    overflowY: 'scroll',
    WebkitOverflowScrolling: 'touch'
  }
}

/** @type {number} This should be the height of the AddButton */
const mapPaddingBottom = 72

class Home extends React.Component {
  state = {
    isMapFullscreen: false
  }

  handleAddObservation = (e) => {
    this.props.onOpen(e, {
      id: 'new',
      type: 'observation'
    })
  }

  switchMapView = (e) => {
    this.setState({
      isMapFullscreen: !this.state.isMapFullscreen
    })
  }

  render () {
    const { onOpen, geolocation, items, params } = this.props
    const { isMapFullscreen } = this.state
    const size = isMapFullscreen ? 'large' : 'small'
    return (
      <div style={styles.wrapper}>
        <MapTransition size={size} paddingBottom={mapPaddingBottom}>
          <MapView
            geolocation={geolocation}
            interactive={isMapFullscreen}
            onClick={this.switchMapView}
          />
        </MapTransition>
        <AddButton onTouchTap={this.handleAddObservation} />
        <ListView {...{onOpen, items}} activeId={params.id} />
      </div>
    )
  }
}

Home.propTypes = {
  geolocation: MyPropTypes.geolocation,
  items: PropTypes.array,
  onOpen: PropTypes.func,
  params: PropTypes.object
}

export default Home
