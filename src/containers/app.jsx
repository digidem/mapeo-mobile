import React from 'react'
import Transition from 'react-motion-ui-pack'

import Home from './home'
import {
  AnimationWrapper,
  ObservationEdit,
  EventEdit,
  PlaceEdit,
  Geolocation
} from '../components'
import InjectWindowDimensions from '../hocs/inject_window_dimensions'

const styles = {
  animationWrapper: {
    zIndex: 1,
    position: 'fixed',
    top: 0,
  }
}

const App = ({ windowHeight, windowWidth, params, history: { pushState } }) => {
  const {id, type} = params
  let EditView, filter

  if (!id) {
    filter = type
  }

  function handleClose (e) {
    e.preventDefault()
    pushState(null, '/')
  }

  function handleOpen (e, {id, type}) {
    pushState(null, `/${type}/${id}`)
  }

  switch (type) {
    case 'observation':
      EditView = ObservationEdit
      break
    case 'event':
      EditView = EventEdit
      break
    case 'place':
      EditView = PlaceEdit
      break
  }

  return (
    <div>
      <Geolocation />
      <Home filter={filter} onOpen={handleOpen} {...{windowHeight, windowWidth, params}} />
      <Transition
        component={false}
        appear={{
          translateY: windowHeight
        }}
        enter={{
          translateY: 0
        }}
        leave={{
          translateY: windowHeight + 100
        }}
      >
        { EditView &&
          <AnimationWrapper style={styles.animationWrapper}>
            <EditView {...params} onClose={handleClose} />
          </AnimationWrapper>
        }
      </Transition>
    </div>
  )
}

export default InjectWindowDimensions(App)
