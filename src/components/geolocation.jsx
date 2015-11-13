import { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { geolocationUpdate } from '../action_creators'

class Geolocation extends Component {

  watchID = null

  componentDidMount () {
    if ('geolocation' in navigator) {
      console.log('geolocation exists')
    } else {
      console.log('geolocation DOES NOT exist')
    }

    this.watchID = navigator.geolocation.watchPosition(
      (position) => this.props.dispatch(geolocationUpdate({
        coords: [ position.coords.longitude, position.coords.latitude ],
        timestamp: position.timestamp
      })),
      (error) => this.props.dispatch(geolocationUpdate({
        error
      })),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    )
  }

  componentWillUnmount () {
    navigator.geolocation.clearWatch(this.watchID)
  }

  render () {
    return null
  }
}

Geolocation.propTypes = {
  dispatch: PropTypes.function
}

export default connect()(Geolocation)
