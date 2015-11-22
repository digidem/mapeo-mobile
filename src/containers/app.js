import React from 'react'
import { connect } from 'react-redux'
import Home from './home'
import { Geolocation, RouteTransition, HomeTransition } from '../components'
import InjectWindowDimensions from '../hocs/inject_window_dimensions'
import locationSelector from '../selectors/location'
import itemsSelector from '../selectors/items'

const App = ({ windowHeight, windowWidth, params, geolocation, location, history, children, items }) => {
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
        <Home filter={filter} onOpen={handleOpen} {...{windowHeight, windowWidth, params}} items={items} location={geolocation} />
      </HomeTransition>
      <RouteTransition pathname={location.pathname} type={childRouteTransitionType}>
        {children && React.cloneElement(children, {onClose: handleClose})}
      </RouteTransition>
    </div>
  )
}

function selector (state) {
  return {
    items: itemsSelector(state),
    geolocation: locationSelector(state)
  }
}

export default InjectWindowDimensions(connect(selector)(App))
