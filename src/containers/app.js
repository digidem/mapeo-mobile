import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import RouterPropTypes from 'react-router/lib/PropTypes'

import HomeView from '../components/home_view'
import Geolocation from '../components/geolocation'
import RouteTransition from '../components/transitions/route_transition'
import HomeTransition from '../components/transitions/home_transition'
import geolocationSelector from '../selectors/geolocation'
import itemsSelector from '../selectors/items'
import MyPropTypes from '../util/prop_types'

const App = ({ children, geolocation, history, items, location, params }) => {
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

App.propTypes = {
  children: PropTypes.element,
  geolocation: MyPropTypes.geolocation.isRequired,
  history: RouterPropTypes.history.isRequired,
  items: PropTypes.array.isRequired,
  location: RouterPropTypes.location.isRequired,
  params: PropTypes.object.isRequired
}

function selector (state) {
  return {
    items: itemsSelector(state),
    geolocation: geolocationSelector(state)
  }
}

export default connect(selector)(App)
