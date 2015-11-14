import React, { PropTypes } from 'react'
import FloatingActionButton from 'material-ui/lib/floating-action-button'
import LocationIcon from 'material-ui/lib/svg-icons/maps/my-location'
import Colors from 'material-ui/lib/styles/colors'
import distance from 'turf-distance'
import Point from 'turf-point'
import _ from 'lodash'
import MapboxGL from './mapbox_gl'

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZ21hY2xlbm5hbiIsImEiOiJSaWVtd2lRIn0.ASYMZE2HhwkAw4Vt7SavEg'

const styles = {
  wrapper: {
    position: 'relative',
    width: '100%'
  },
  myLocationButton: {
    position: 'absolute',
    bottom: 20,
    right: 20
  }
}

class MapView extends React.Component {
  static defaultProps = {
    kind: 'small'
  }

  static propTypes = {
    kind: PropTypes.string,
    containerHeight: PropTypes.number,
    containerWidth: PropTypes.number,
    location: PropTypes.object
  }

  state = {
    centerOnLocation: true
  }

  onMove = (e) => {
    const mapCenter = e.target.getCenter().toArray()
    const location = this.props.location
    // If the map is within 1m of our location, consider it centered on our location
    const centeredOnLocation = distance(Point(mapCenter), Point(location.coords)) < 0.001
    this.setState({
      ...this.state,
      centerOnLocation: centeredOnLocation
    })
  }

  centerOnLocation = (e) => {
    this.setState({
      ...this.state,
      centerOnLocation: true
    })
  }

  componentWillReceiveProps (nextProps) {

  }

  render () {
    const { kind, containerHeight, location } = this.props
    const mapHeight = kind === 'small' ? containerHeight / 2 : containerHeight
    return (
      <div style={{...styles.wrapper, height: mapHeight}}>
        <MapboxGL
          token={MAPBOX_TOKEN}
          location={location}
          onMove={_.throttle(this.onMove, 100)}
          centerOnLocation={this.state.centerOnLocation}
        />
        <FloatingActionButton
          style={styles.myLocationButton}
          backgroundColor='white'
          onTouchTap={this.centerOnLocation}>
          {this.state.centerOnLocation ? <LocationIcon color={Colors.blue700} />
            : <LocationIcon color={Colors.grey500} />}
        </FloatingActionButton>
      </div>
    )
  }
}

export default MapView
