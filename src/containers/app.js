import React from 'react'
import { connect } from 'react-redux'

import HomeView from '../components/home_view'
import Geolocation from '../components/geolocation'
import RouteTransition from '../components/transitions/route_transition'
import HomeTransition from '../components/transitions/home_transition'
import geolocationSelector from '../selectors/geolocation'
import itemsSelector from '../selectors/items'

const App = ({ params, geolocation, location, history, children, items }) => {
  const {id} = params
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
        <HomeView onOpen={handleOpen} {...{params, items, geolocation}} />
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
    geolocation: geolocationSelector(state)
  }
}

export default connect(selector)(App)
