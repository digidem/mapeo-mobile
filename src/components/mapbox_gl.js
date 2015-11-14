import React from 'react'
import mapboxgl from 'mapbox-gl'

const styles = {
  base: {
    position: 'relative',
    height: '100%',
    width: '100%'
  }
}

class MapboxGL extends React.Component {
  static defaultProps = {
    style: 'mapbox://styles/mapbox/streets-v8',
    defaultZoom: 12,
    centerOnLocation: true,
    onMove: () => null
  }

  static propTypes = {
    location: React.PropTypes.object,
    style: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.object
    ]),
    token: React.PropTypes.string.isRequired,
    defaultZoom: React.PropTypes.number,
    centerOnLocation: React.PropTypes.bool,
    onMove: React.PropTypes.func
  }

  render () {
    return (
      <div
        ref={(el) => this.mapDiv = el}
        style={styles.base}
      />
    )
  }

  shouldComponentUpdate ({ centerOnLocation, location: {coords} }) {
    if (centerOnLocation && coords !== this.map.getCenter().toArray) {
      this.map.flyTo({
        center: coords,
        zoom: this.map.getZoom()
      })
    }
    return false
  }

  componentDidMount () {
    const { defaultZoom, token, style, location } = this.props
    mapboxgl.accessToken = token
    this.map = new mapboxgl.Map({
      style: style,
      container: this.mapDiv,
      center: location.coords,
      zoom: defaultZoom
    })
    this.map.on('move', this.props.onMove)
  }

  componentWillUnmount () {
    this.map.remove()
  }
}

export default MapboxGL
