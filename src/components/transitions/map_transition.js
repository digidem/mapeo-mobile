/**
 * MapTransition handles animated transitions between the split view with a
 *   small map, and the view with a fullscreen map
 */
import React, { PropTypes } from 'react'
import { Motion, spring } from 'react-motion'
import injectWindowDimensions from '../../hocs/inject_window_dimensions'

const styles = {
  mapWrapper: {
    overflow: 'hidden',
    position: 'relative'
  }
}

/**
 * Animates between two different sizes `small`, a 3:2 ratio box filling width
 *   of the screen, and `large`, completely filling the screen leaving padding
 *   at the bottom for the AddButton.
 * @return {[type]} [description]
 */
const MapTransition = ({children, paddingBottom = 0, size = 'small', windowHeight, windowWidth}) => {
  const smallMapHeight = Math.round(windowWidth * 2 / 3)
  const fullScreenMapHeight = windowHeight - paddingBottom
  const mapHeight = (size === 'small') ? smallMapHeight : fullScreenMapHeight
  return (
    <Motion style={{animatedHeight: spring(mapHeight)}}>
      {({animatedHeight}) => {
        // We don't animate the map size, because this causes performance issues
        // We set the map size to large as soon as we start animating, and wrap
        // it in a container and animate the vertical offset to keep it centered
        const isMapSmallNow = roundedEqual(animatedHeight, smallMapHeight)
        const size = isMapSmallNow ? 'small' : 'large'
        const eventualHeight = isMapSmallNow ? smallMapHeight : fullScreenMapHeight
        const offsetY = ((animatedHeight - eventualHeight) / 2).toFixed(1)
        return (
          <div style={{...styles.mapWrapper, height: animatedHeight}}>
            <div style={{transform: `translateY(${offsetY}px)`, height: eventualHeight}}>
              {React.cloneElement(children, {size})}
            </div>
          </div>
        )
      }}
    </Motion>
  )
}

MapTransition.propTypes = {
  children: PropTypes.element.isRequired,
  /* Space to leave at bottom of the screen for AddButton when map is 'large' */
  paddingBottom: PropTypes.number,
  /* Size of the map view */
  size: PropTypes.oneOf(['large', 'small']),
  /* Injected by HOC, updates when window resizes */
  windowHeight: PropTypes.number.isRequired,
  windowWidth: PropTypes.number.isRequired
}

/**
 * Compares two numbers rounded to a number of decimal places
 * @param {number} a
 * @param {number} b
 * @param {number} options.decimalPlaces Number of decimal places
 * @return {bool}  `true` if equal
 */
function roundedEqual (a, b, {decimalPlaces = 0} = {}) {
  return a.toFixed(decimalPlaces) === b.toFixed(decimalPlaces)
}

export default injectWindowDimensions(MapTransition)
