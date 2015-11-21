import React from 'react'

import Home from './home'
import { Geolocation, RouteTransition, HomeTransition } from '../components'
import InjectWindowDimensions from '../hocs/inject_window_dimensions'

const App = ({ windowHeight, windowWidth, params, location, history, children }) => {
  const {id, type} = params
  const filter = (id) ? null : type
  const homeTransitionType = (id === 'new') ? 'fadeBack' : 'slideToLeft'
  const childRouteTransitionType = (id === 'new') ? 'slideFromBottom' : 'slideFromRight'

  function handleClose (e) {
    e.preventDefault()
    history.replaceState(null, '/')
  }

  function handleOpen (e, {id, type}) {
    history.pushState(null, `/${type}/${id}`)
  }

  return (
    <div>
      <Geolocation />
      <HomeTransition active={!!children} type={homeTransitionType}>
        <Home filter={filter} onOpen={handleOpen} {...{windowHeight, windowWidth, params}} />
      </HomeTransition>
      <RouteTransition pathname={location.pathname} type={childRouteTransitionType}>
        {children && React.cloneElement(children, {onClose: handleClose})}
      </RouteTransition>
    </div>
  )
}

export default InjectWindowDimensions(App)
