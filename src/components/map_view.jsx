import React, { PropTypes } from 'react'
import MapGL from 'react-map-gl'
import FloatingActionButton from 'material-ui/lib/floating-action-button'
import LocationActive from 'material-ui/lib/svg-icons/maps/my-location'
import LocationInActive from 'material-ui/lib/svg-icons/device/location-searching'
import Colors from 'material-ui/lib/styles/colors'

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZ21hY2xlbm5hbiIsImEiOiJSaWVtd2lRIn0.ASYMZE2HhwkAw4Vt7SavEg'

const styles = {
  base: {
    backgroundImage: 'url(img/map-placeholder.jpg)'
  },
  small: {
    height: 400
  },
  myLocationButton: {
    position: 'absolute',
    top: 340,
    right: 20
  }
}

class MapView extends React.Component {
  static defaultProps = {
    kind: 'small'
  }

  static propTypes = {
    kind: PropTypes.string,
    containerWidth: PropTypes.number,
    coords: PropTypes.array
  }

  state = {
    longitude: this.props.coords[0],
    latitude: this.props.coords[1],
    zoom: 12,
    startDragLatLng: null,
    isDragging: false,
    centeredOnLocation: true
  }

  onChangeViewport = (opt) => {
    this.setState({
      latitude: opt.latitude,
      longitude: opt.longitude,
      zoom: opt.zoom,
      startDragLatLng: opt.startDragLatLng,
      isDragging: opt.isDragging,
      centeredOnLocation: false
    })
  }

  centerOnLocation = (e) => {
    this.setState({
      ...this.state,
      longitude: this.props.coords[0],
      latitude: this.props.coords[1],
      centeredOnLocation: true
    })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.coords !== this.props.coords && this.state.centeredOnLocation) {
      this.setState({
        ...this.state,
        longitude: nextProps.coords[0],
        latitude: nextProps.coords[1]
      })
    }
  }

  render () {
    const { kind, containerWidth } = this.props
    return (
      <div>
        <MapGL
          width={containerWidth}
          height={styles[kind].height}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          onChangeViewport={this.onChangeViewport}
          {...this.state}
        />
        <FloatingActionButton
          mini
          style={styles.myLocationButton}
          backgroundColor='white'
          onTouchTap={this.centerOnLocation}>
          {this.state.centeredOnLocation ? <LocationActive color={Colors.blue700} />
            : <LocationInActive color={Colors.grey500} />}
        </FloatingActionButton>
      </div>
    )
  }
}

export default MapView
