/**
 * HomeTransition handles transitions of the main page into the background
 *   when rendering child routes. We do not unmount the main page since
 *   re-rendering the map would be a performance overhead.
 */
import React, { PropTypes } from 'react'
import { Motion, spring } from 'react-motion'

import { parseTransformStyle } from '../util/utils'

const styles = {
  /* base shared style */
  base: {
    position: 'absolute',
    height: '100vh',
    width: '100vw'
  },
  /* default style when transition is not active */
  default: {
    opacity: spring(1),
    scale: spring(1),
    translateX: spring(0)
  },
  /* animates as if moving 'backwards' in 3D space, and fading out */
  fadeBack: {
    opacity: spring(0.75),
    scale: spring(0.95),
    translateX: spring(0)
  },
  /* animates sliding to the left */
  slideToLeft: {
    opacity: spring(1),
    scale: spring(1),
    translateX: spring(-33)
  }
}

/**
 * Wraps `props.children` with a `<div>` with interpolated styles provided by
 *   [Motion](https://github.com/chenglou/react-motion#motion-)
 * @return {React.Component}
 */
const HomeTransition = ({active, children, type}) => {
  let style = styles.default
  if (active) {
    style = styles[type]
  }
  return (
    <Motion style={style}>
      {(interpolatedStyle) => {
        const wrapperStyle = {
          ...styles.base,
          ...parseTransformStyle(interpolatedStyle)
        }
        return <div style={wrapperStyle}>{children}</div>
      }}
    </Motion>
  )
}

HomeTransition.propTyps = {
  /* Whether the transition is active or not */
  active: PropTypes.bool,
  children: PropTypes.element,
  /* The type of transition animation */
  type: PropTypes.oneOf(['new', 'existing']).isRequired
}

export default HomeTransition
