import React, { PropTypes } from 'react'
import { Motion, spring } from 'react-motion'
import Colors from 'material-ui/lib/styles/colors'
import injectTapEventPlugin from 'react-tap-event-plugin'

import {
  ListView,
  MapView,
  AddButton } from '../components'

injectTapEventPlugin()

const styles = {
  wrapper: {
    backgroundColor: Colors.grey300,
    position: 'absolute',
    width: '100vw',
    height: '100vh',
    overflowY: 'scroll',
    WebkitOverflowScrolling: 'touch'
  },
  mapWrapper: {
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    height: '100%'
  }
}

function roundedEqual (a, b, {decimalPlaces = 0} = {}) {
  return a.toFixed(decimalPlaces) === b.toFixed(decimalPlaces)
}

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
    const { windowWidth, windowHeight, onOpen, location, items, params } = this.props
    const { isMapFullscreen } = this.state
    const smallMapHeight = Math.round(windowWidth * 2 / 3)
    const fullScreenMapHeight = windowHeight - 72
    const mapHeight = isMapFullscreen ? fullScreenMapHeight : smallMapHeight
    return (
      <div style={styles.wrapper}>
        <Motion style={{animatedHeight: spring(mapHeight)}}>
          {({animatedHeight}) => {
            // We don't animate the map size, because this causes performance issues
            // We toggle the map size between large and small, and animate the container
            // using the offset to keep the map centered.
            const eventualHeight = roundedEqual(animatedHeight, smallMapHeight) ? smallMapHeight : fullScreenMapHeight
            const offsetY = ((animatedHeight - eventualHeight) / 2).toFixed(1)
            return (
              <div style={{...styles.mapWrapper, height: animatedHeight}}>
                <div style={{transform: `translateY(${offsetY}px)`, width: '100%', height: '100%'}}>
                  <MapView
                    size={isMapFullscreen}
                    location={location}
                    interactive={isMapFullscreen}
                    onClick={this.switchMapView}
                  />
                </div>
              </div>
            )
          }}
        </Motion>
        <AddButton
          onTouchTap={this.handleAddObservation}
        />
        <ListView {...{onOpen, items}} activeId={params.id} />
      </div>
    )
  }
}

Home.propTypes = {
  windowWidth: PropTypes.number,
  windowHeight: PropTypes.number,
  location: PropTypes.object,
  items: PropTypes.array,
  onOpen: PropTypes.func,
  params: PropTypes.object
}

export default Home
