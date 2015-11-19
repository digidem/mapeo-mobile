import React from 'react'
import proxyquire from 'proxyquire'
import test from 'prova'
import { createRenderer } from 'react-addons-test-utils'
import actionTypes from '../../src/constants'

import { createGeolocationMock } from '../mocks'

const geolocationMock = createGeolocationMock()

const stubs = {
  '../util/utils': {
    geolocation: geolocationMock
  },
  'react-redux': {
    connect: () => (Component) => Component
  }
}

const Geolocation = proxyquire('../../src/components/geolocation', stubs)

test('Component lifecycle', function (t) {
  geolocationMock.reset()
  const shallowRenderer = createRenderer()
  const dispatch = () => null

  shallowRenderer.render(<Geolocation dispatch={dispatch} />)
  t.false(shallowRenderer.getRenderOutput(), 'does not render anything')
  shallowRenderer.unmount()
  t.ok(geolocationMock.areWatchesRemoved(), 'watches are removed after component unmounts')
  t.end()
})

test('Geolocation error position', function (t) {
  t.plan(7)
  geolocationMock.reset()
  const shallowRenderer = createRenderer()
  const mockError = {'message': 'User denied geolocation prompt', 'code': 1}

  const dispatch = action => {
    t.equal(action.type, actionTypes.GEOLOCATION_UPDATE, 'action type is correct')
    t.true(action.payload instanceof Error, 'payload is instance of Error')
    t.notEqual(action.payload, mockError, 'Error returned is not same as error thrown by geolocation')
    t.equal(action.payload.message, mockError.message, 'Message from PositionError is copied to error thrown')
    t.equal(action.payload.code, mockError.code, 'Code from PositionError is copied to error thrown')
    t.true(action.error, 'error variable is true')
  }

  shallowRenderer.render(<Geolocation dispatch={dispatch} />)
  geolocationMock.sendError(mockError)
  t.false(shallowRenderer.getRenderOutput(), 'dispatching error does not render anything')
})

test('Geolocation good position', function (t) {
  t.plan(3)
  geolocationMock.reset()
  const shallowRenderer = createRenderer()

  const dispatch = action => {
    t.equal(action.type, actionTypes.GEOLOCATION_UPDATE, 'action type is correct')
    t.deepEqual(action.payload, {position: { location: [1, 2] }}, 'passes expected payload')
  }

  shallowRenderer.render(<Geolocation dispatch={dispatch} />)
  geolocationMock.sendPosition({ location: [1, 2] })
  t.false(shallowRenderer.getRenderOutput(), 'dispatching update does not render anything')
})

test('Geolocation handles updates on location', function (t) {
  t.plan(8)
  geolocationMock.reset()
  const shallowRenderer = createRenderer()
  const testLocations = [[1, 2], [3, 4], [5, 6]]
  let callCount = 0

  const dispatch = action => {
    t.equal(action.type, actionTypes.GEOLOCATION_UPDATE, 'action type is correct')
    t.deepEqual(action.payload, {position: { location: testLocations.shift() }}, 'passes expected payload')
    callCount++
    if (callCount === 3) {
      t.pass('dispatch called 3 times, once for each update')
    }
  }

  shallowRenderer.render(<Geolocation dispatch={dispatch} />)
  geolocationMock.sendPosition({ location: [1, 2] })
  geolocationMock.sendPosition({ location: [3, 4] })
  geolocationMock.sendPosition({ location: [5, 6] })
  t.false(shallowRenderer.getRenderOutput(), 'dispatching multiple updates does not render anything')
})
