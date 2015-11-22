import { Component, PropTypes } from 'react'
import { geolocation } from '../util/utils'

/**
 * An empty component that attaches an event to
 *   navigator.geolocation.watchPosition and calls `onGeolocationUpdate` when
 *   the position updates or there is a geolocation position error.
 */
class Geolocation extends Component {

  watchID = null

  componentWillMount () {
    const {onGeolocationUpdate} = this.props
    // Dispatch error and return early if we don't have geolocation
    // if (!('geolocation' in navigator)) {
    if (typeof geolocation === 'undefined') {
      const error = new Error('Geolocation not supported by client')
      onGeolocationUpdate(error, true)
      return
    }
    // The watchPosition constantly updates the store with new values (once at 300 miliseconds),
    // according to my testing. Some of the values in 'meta' positions can be NaN or may not exist
    // at all, depending on the implementation. So I'm adding checks here.
    // this.watchID = navigator.geolocation.watchPosition(
    this.watchID = geolocation.watchPosition(
      (position) => onGeolocationUpdate({ position }),
      (positionError) => {
        const error = new Error(positionError.message)
        error.code = positionError.code
        onGeolocationUpdate(error, true)
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    )
  }

  componentWillUnmount () {
    if (this.watchID) {
      geolocation.clearWatch(this.watchID)
    }
  }

  render () {
    return null
  }
}

Geolocation.propTypes = {
  /**
   * Called when geolocation position updates
   * @param {object|Error} payload Error() or payload with position property
   * @param {bool} error true if error
   */
  onGeolocationUpdate: PropTypes.func.isRequired
}

export default Geolocation
