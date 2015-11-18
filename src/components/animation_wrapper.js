import React from 'react'

/**
 * Animations with Transition from react-motion-ui-pack pass a style prop to
 * children, which changes frequently to make the animation happen.
 * If this style prop is passed directly to the child component, it will not
 * be able to pure render, because this prop is always changing, causing a
 * performance issue becauase the entire component re-renders for every
 * animation frame.
 * This wraps the child component with a div that is rendered with the style prop
 * and passes all other props through to its children
 * @param  {object}          options.style
 * @param  {React.Component} options.children
 * @param  {...object}       options.props
 * @return {React.Component}
 */
const AnimationWrapper = ({ style, children, ...props }) => (
  <div style={{...style}}>
    {React.cloneElement(children, props)}
  </div>
)

export default AnimationWrapper
