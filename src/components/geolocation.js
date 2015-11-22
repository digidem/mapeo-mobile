import { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { geolocationUpdate } from '../action_creators'
import { geolocation } from '../util/utils'

class Geolocation extends Component {

  watchID = null

  componentWillMount () {
    // Dispatch error and return early if we don't have geolocation
    // if (!('geolocation' in navigator)) {
    if (typeof geolocation === 'undefined') {
      const error = new Error('Geolocation not supported by client')
      this.props.dispatch(geolocationUpdate(error, true))
      return
    }
    // The watchPosition constantly updates the store with new values (once at 300 miliseconds),
    // according to my testing. Some of the values in 'meta' positions can be NaN or may not exist
    // at all, depending on the implementation. So I'm adding checks here.
    // this.watchID = navigator.geolocation.watchPosition(
    this.watchID = geolocation.watchPosition(
      (position) => this.props.dispatch(geolocationUpdate({ position })),
      (positionError) => {
        const error = new Error(positionError.message)
        error.code = positionError.code
        this.props.dispatch(geolocationUpdate(error, true))
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    )
  }

  componentWillUnmount () {
    if (this.watchID) {
      // navigator.geolocation.clearWatch(this.watchID)
      geolocation.clearWatch(this.watchID)
    }
  }

  render () {
    return null
  }
}

Geolocation.propTypes = {
  dispatch: PropTypes.func.isRequired
}

// Connect with no arguments injects the dispatch function into props
export default connect()(Geolocation)
