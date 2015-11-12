import React from 'react'
import Transition from 'react-motion-ui-pack'
import Dimensions from 'react-dimensions'

import PhoneWrapper from '../util/phone_wrapper'
import Home from './home'
import {
  ObservationEdit,
  EventEdit,
  PlaceEdit
} from '../components'

const App = ({ containerHeight, params, history: { pushState } }) => {
  const {id, type} = params
  let EditView, filter

  if (!id) {
    filter = type
  }

  function handleClose (e) {
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
      <Home filter={filter} onOpen={handleOpen} />
      <Transition
        component={false}
        appear={{
          translateY: containerHeight
        }}
        enter={{
          translateY: 0
        }}
        leave={{
          translateY: containerHeight + 100
        }}
      >
        { EditView && <EditView {...params} onClose={handleClose} />}
      </Transition>
    </div>
  )
}

export default PhoneWrapper(Dimensions()(App))
