import React, { PropTypes } from 'react'
import mapboxgl from 'mapbox-gl'
import { isPrettyClose } from '../util/geo'
import MyPropTypes from '../util/prop_types'

const DEFAULT_COORDS = [-59.5, 2.7]

/**
 * A Mapbox-gl-js component that leaves most of the rendering to mapbox-gl-js
 * The diffing is handled in `shouldComponentUpdate`
 */
class MapboxGL extends React.Component {
  static defaultProps = {
    centerOnLocation: true,
    initialZoom: 12,
    interactive: false,
    mapStyle: 'mapbox://styles/mapbox/streets-v8',
    onMove: () => null
  }

  static propTypes = {
    /**
     * Should the map keep following the current location?
     */
    centerOnLocation: PropTypes.bool,
    /**
     * If `false`, no mouse, touch, or keyboard listeners are attached to the map, so it will not respond to input
     */
    interactive: PropTypes.bool,
    /**
     * Initial zoom level of the map when first rendered
     */
    initialZoom: PropTypes.number,
    /**
     * Location object (see location reducer documentation for shape)
     */
    location: MyPropTypes.location,
    /**
     * - NOT yet dynamic e.g. if you change it the map won't change
     * Map style. This must be an an object conforming to the schema described in the [style reference](https://mapbox.com/mapbox-gl-style-spec/), or a URL to a JSON style. To load a style from the Mapbox API, you can use a URL of the form `mapbox://styles/:owner/:style`, where `:owner` is your Mapbox account name and `:style` is the style ID. Or you can use one of the predefined Mapbox styles:
     * `mapbox://styles/mapbox/basic-v8` - Simple and flexible starting template.
     * `mapbox://styles/mapbox/bright-v8` - Template for complex custom basemaps.
     * `mapbox://styles/mapbox/streets-v8` - A ready-to-use basemap, perfect for minor customization or incorporating your own data.
     * `mapbox://styles/mapbox/light-v8` - Subtle light backdrop for data vizualizations.
     * `mapbox://styles/mapbox/dark-v8` - Subtle dark backdrop for data vizualizations.
     */
    mapStyle: MyPropTypes.stringOrObject,
    /**
     * Triggered whenever the map moves. Access the map object on `event.target.map`
     */
    onMove: PropTypes.func,
    /**
     * This value can be anything, if it changes (!==) the map is redrawn
     */
    size: PropTypes.any,
    /**
     * Mapbox [API access token](https://www.mapbox.com/help/create-api-access-token/)
     */
    token: PropTypes.string.isRequired
  }

  render () {
    return (
      <div
        ref={el => this.mapDiv = el}
        style={{height: '100%', width: '100%'}}
      />
    )
  }

  // The first time our component mounts, render a new map into `mapDiv`
  // with settings from props.
  componentDidMount () {
    const { initialZoom, token, mapStyle, location, interactive, onMove } = this.props
    mapboxgl.accessToken = token
    this.map = global.map = new mapboxgl.Map({
      style: mapStyle,
      container: this.mapDiv,
      center: location.coords || DEFAULT_COORDS,
      zoom: initialZoom,
      interactive: interactive,
      attributionControl: false
    })
    this.map.on('move', onMove)
  }

  // We always return false from this function because we don't want React to
  // handle any rendering of the map itself, we do all that via mapboxgl
  shouldComponentUpdate (nextProps) {
    const mapCenter = this.map.getCenter().toArray()
    const newCenter = nextProps.location.coords
    const isNotAtLocation = newCenter && !isPrettyClose(newCenter, mapCenter)
    const atDefaultCoords = mapCenter[0] === DEFAULT_COORDS[0] && mapCenter[1] === DEFAULT_COORDS[1]
    if (atDefaultCoords && newCenter) {
      // If we're getting our first location, don't fly to, jump directly.
      this.map.setCenter(newCenter)
    } else if (nextProps.centerOnLocation && isNotAtLocation) {
      // If the map should be centered on the current location, and we are not
      // near the current location, fly to it.
      this.map.flyTo({
        center: newCenter,
        zoom: this.map.getZoom()
      })
    }

    const sizeHasChanged = nextProps.size !== this.props.size
    if (sizeHasChanged) {
      this.map.resize()
    }

    const hasBecomeInteractive = nextProps.interactive && !this.props.interactive
    if (hasBecomeInteractive) {
      this.map.interaction.enable()
    }

    const hasStoppedBeingInteractive = !nextProps.interactive && this.props.interactive
    if (hasStoppedBeingInteractive) {
      this.map.interaction.disable()
    }

    return false
  }

  componentWillUnmount () {
    this.map.remove()
  }
}

export default MapboxGL
