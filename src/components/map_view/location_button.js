import React, { PropTypes } from 'react'
import FloatingActionButton from 'material-ui/lib/floating-action-button'
import LocationIcon from 'material-ui/lib/svg-icons/maps/my-location'
import Colors from 'material-ui/lib/styles/colors'

/**
 * Draws a round white button with a location icon which will be blue
 * when the prop `isCentered` is true, or grey when is it false.
 * @param  {boolean}  options.isCentered Are we centered on our current location?
 * @param  {function} options.onTouchTap Callback when button is clicked
 */
const LocationButton = ({ isCentered, onTouchTap, style }) => (
  <FloatingActionButton
    style={style}
    backgroundColor='white'
    onTouchTap={onTouchTap}>
    {isCentered ? <LocationIcon color={Colors.blue700} />
      : <LocationIcon color={Colors.grey500} />}
  </FloatingActionButton>
)

LocationButton.propTypes = {
  isCentered: PropTypes.bool,
  onTouchTap: PropTypes.func,
  style: PropTypes.object
}

export default LocationButton
