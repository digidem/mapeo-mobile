import { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { geolocationUpdate } from '../action_creators'
import { geolocationErrors } from '../action_creators'

class Geolocation extends Component {

  watchID = null

  componentDidMount () {
    // This check is just a precaution to throw an error if geolocation is not available.
    // Hopefully it will be never needed.
    // TODO: Finish this part, godamnit
    if ( !('geolocation' in navigator) ) {
    // should throw an error to the store
    }

    // The watchPosition constantly updates the store with new values (once at 300 miliseconds),
    // according to my testing. Some of the values in 'meta' positions can be NaN or may not exist
    // at all, depending on the implementation. So I'm adding checks here.
    this.watchID = navigator.geolocation.watchPosition(
      (position) => this.props.dispatch(geolocationUpdate({
        position
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
