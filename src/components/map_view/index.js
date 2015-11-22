import React, { PropTypes } from 'react'
import distance from 'turf-distance'
import Point from 'turf-point'
import _ from 'lodash'

import MapboxGL from './mapbox_gl'
import LocationButton from './location_button'
import MyPropTypes from '../../util/prop_types'

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZ21hY2xlbm5hbiIsImEiOiJSaWVtd2lRIn0.ASYMZE2HhwkAw4Vt7SavEg'

const styles = {
  wrapper: {
    width: '100%',
    height: '100%'
  },
  myLocationButton: {
    position: 'absolute',
    bottom: 20,
    right: 20
  }
}

class MapView extends React.Component {
  static propTypes = {
    /**
     * Triggered when the map is clicked
     */
    onClick: PropTypes.func,
    /**
     * Location object (with coords and meta) for our current position
     */
    geolocation: MyPropTypes.geolocation.isRequired,
    /**
     * Whether the map should respond to mouse and touch events. When it is small we
     * turn off interactivity.
     */
    interactive: PropTypes.bool
  }

  state = {
    centerOnLocation: true
  }

  onMapMove = (e) => {
    const mapCenter = e.target.getCenter().toArray()
    const locationCoords = this.props.geolocation.coords
    // If the map is within 1m of our location, consider it centered on our location
    const centerOnLocation = locationCoords && distance(Point(mapCenter), Point(locationCoords)) < 0.001
    this.setState({
      centerOnLocation: centerOnLocation
    })
  }

  onClickLocationButton = (e) => {
    e.preventDefault()
    this.setState({
      centerOnLocation: true
    })
  }

  render () {
    const { onClick, interactive, ...props } = this.props
    const { centerOnLocation } = this.state
    return (
      <div onClick={onClick} style={styles.wrapper}>
        <MapboxGL
          token={MAPBOX_TOKEN}
          onMove={_.throttle(this.onMapMove, 100)}
          centerOnLocation={centerOnLocation}
          interactive={interactive}
          {...props}
        />
        {interactive &&
          <LocationButton
            onTouchTap={this.onClickLocationButton}
            isCentered={centerOnLocation}
            style={styles.myLocationButton}
          />
        }
      </div>
    )
  }
}

export default MapView
