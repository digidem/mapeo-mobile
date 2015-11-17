import React, { PropTypes } from 'react'
import distance from 'turf-distance'
import Point from 'turf-point'
import _ from 'lodash'
import MapboxGL from './mapbox_gl'
import LocationButton from './location_button'

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZ21hY2xlbm5hbiIsImEiOiJSaWVtd2lRIn0.ASYMZE2HhwkAw4Vt7SavEg'

const styles = {
  wrapper: {
    width: '100%'
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
     * Height of the map view. This is animated between the full-page map and the
     * smaller inset map
     */
    height: PropTypes.number,
    /**
     * We do not animate the map height, because of performance. `mapHeight` is the
     * target height that `height` is animating towards. E.g.
     * 0 sec: height = 320px, mapHeight = 320px
     * 0.2 sec: height = 413px (animating), mapHeight = 640px
     * 0.5 sec: height = 640px (finished animating), mapHeight = 640px
     * We offset the map within the container so that it remains centered as the container
     * height is animated.
     */
    mapHeight: PropTypes.number,
    /**
     * Width of the map view.
     */
    width: PropTypes.number,
    /**
     * Triggered when the map is clicked
     */
    onClick: PropTypes.func,
    /**
     * Location object (with coords and meta) for our current position
     */
    location: PropTypes.object,
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
    const locationCoords = this.props.location.coords
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
    const { height, width, onClick, location, interactive } = this.props
    const { centerOnLocation } = this.state
    return (
      <div onClick={onClick}>
        <MapboxGL
          height={height}
          width={width}
          token={MAPBOX_TOKEN}
          location={location}
          onMove={_.throttle(this.onMapMove, 100)}
          centerOnLocation={centerOnLocation}
          interactive={interactive}
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
