/**
 * RouteTransition handles transitions between routes when they mount and
 *   unmount. It defines two `type`s of route transition, `slideFromBottom`,
 *   which slides from the bottom of the screen, and `slideFromRight`, which
 *   slides in from the right
 */
import React, { PropTypes } from 'react'
import { TransitionMotion, spring } from 'react-motion'

import { parseTransformStyle } from '../../util/utils'

/** @type {Array} react-motion spring configuration https://github.com/chenglou/react-motion#spring-number---stiffness-damping---configurationobject */
const fastSpringPreset = [250, 30]

/** @type {Object} Module styles */
const styles = {
  /** @type {Object} Base styles for animation wrapper */
  base: {
    position: 'absolute',
    height: '100vh',
    width: '100vw'
  }
}

/**
 * @typedef TransitionStyle
 * @property {object} appear Where animation first starts, route first mounts
 * @property {object} entered Resting state of animation, route is mounted
 */

/**
 * Types of route transition
 * @namespace
 * @property {TransitionStyle} slideFromBottom  slides from bottom
 * @property {TransitionStyle} slideFromRight   slides from right
 */
const transitionTypes = {
  slideFromBottom: {
    appear: {
      height: 'calc(100vh - 40px)',
      paddingTop: '40px',
      translateX: 0,
      translateY: spring(100, fastSpringPreset)
    },
    entered: {
      height: 'calc(100vh - 40px)',
      paddingTop: '40px',
      translateX: 0,
      translateY: spring(0, fastSpringPreset)
    }
  },
  slideFromRight: {
    appear: {
      translateX: spring(100),
      translateY: 0
    },
    entered: {
      translateX: spring(0),
      translateY: 0
    }
  }
}

/**
 * https://github.com/chenglou/react-motion#willenter-string-object-object-object-object---object
 * @return {object} Default style when route first mounts
 */
function willEnter (key, value) {
  return {
    ...value,
    ...transitionTypes[value.type].appear
  }
}

/**
 * https://github.com/chenglou/react-motion#willleave-string-object-object-object-object---object
 * @return {object} Destination style (when route unmounts)
 */
function willLeave (key, value) {
  return {
    ...value,
    ...transitionTypes[value.type].appear
  }
}

/**
 * Animates route mounting and unmounting with
 *   [TransitionMotion](https://github.com/chenglou/react-motion#transitionmotion-)
 *   Uses `pathname` as a key to track each route. To track child routes after
 *   they have unmounted we keep a reference `handler` on interpolated styles,
 *   and we use `type` to track the transition type for each route
 * @return {React.Component}
 */
const RouteTransition = ({children, pathname, type}) => {
  const defaultStyles = {
    [pathname]: {
      ...transitionTypes[type].entered,
      type: type,
      handler: children
    }
  }

  return (
    <TransitionMotion
      styles={defaultStyles}
      willEnter={willEnter}
      willLeave={willLeave}
    >
    {(interpolated) =>
      <div>
        {Object.keys(interpolated).map(key => renderChildRoute(key, interpolated[key]))}
      </div>
    }
    </TransitionMotion>
  )
}

RouteTransition.propTypes = {
  children: PropTypes.element,
  /** Route path, used as key for animating */
  pathname: PropTypes.string.isRequired,
  /** Type of animation */
  type: PropTypes.oneOf(['slideFromBottom', 'slideFromRight']).isRequired
}

/**
 * Renders child route `options.handler` wrapped in a `<div>` with
 *   interpolated style `options.style` and key from `key`
 * @return {React.Component} Rendered Child Route
 */
export const renderChildRoute = (key, {handler, type, ...style}) => {
  if (!handler) return null
  return (
    <div
      key={`${key}-transition`}
      style={{
        ...styles.base,
        ...parseTransformStyle(style)
      }}
    >
     {handler}
    </div>
  )
}

export default RouteTransition
