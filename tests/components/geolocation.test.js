import React from 'react'
import proxyquire from 'proxyquire'
import test from 'prova'
import sinon from 'sinon'
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
  const dispatch = sinon.spy()
  const shallowRenderer = createRenderer()

  shallowRenderer.render(<Geolocation dispatch={dispatch} />)
  t.false(shallowRenderer.getRenderOutput(), 'does not render anything')
  shallowRenderer.unmount()
  t.ok(geolocationMock.areWatchesRemoved(), 'watches are removed after component unmounts')
  t.end()
})

test('Geolocation error position', function (t) {
  const dispatch = sinon.spy()
  const shallowRenderer = createRenderer()
  const mockError = {'message': 'User denied geolocation prompt', 'code': 1}

  shallowRenderer.render(<Geolocation dispatch={dispatch} />)
  geolocationMock.sendError(mockError)
  const action = dispatch.args[0][0]

  t.equal(action.type, actionTypes.GEOLOCATION_UPDATE, 'action type is correct')
  t.true(action.payload instanceof Error, 'payload is instance of Error')
  t.notEqual(action.payload, mockError, 'Error returned is not same as error thrown by geolocation')
  t.equal(action.payload.message, mockError.message, 'Message from PositionError is copied to error thrown')
  t.equal(action.payload.code, mockError.code, 'Code from PositionError is copied to error thrown')
  t.true(action.error, 'error variable is true')
  t.end()
})

test('Geolocation good position', function (t) {
  const dispatch = sinon.spy()
  const shallowRenderer = createRenderer()

  shallowRenderer.render(<Geolocation dispatch={dispatch} />)
  geolocationMock.sendPosition({ location: [1, 2] })
  const action = dispatch.args[0][0]

  t.equal(action.type, actionTypes.GEOLOCATION_UPDATE, 'action type is correct')
  t.deepEqual(action.payload, {position: { location: [1, 2] }}, 'passes expected payload')
  t.false(shallowRenderer.getRenderOutput(), 'dispatching update does not render anything')
  t.end()
})

test('Geolocation handles updates on location', function (t) {
  const dispatch = sinon.spy()
  const shallowRenderer = createRenderer()

  shallowRenderer.render(<Geolocation dispatch={dispatch} />)
  geolocationMock.sendPosition({ location: [1, 2] })
  geolocationMock.sendPosition({ location: [3, 4] })
  geolocationMock.sendPosition({ location: [5, 6] })
  const action1 = dispatch.args[0][0]
  const action2 = dispatch.args[1][0]
  const action3 = dispatch.args[2][0]

  t.equal(action1.type, actionTypes.GEOLOCATION_UPDATE, 'first update passes correct action type')
  t.equal(action2.type, actionTypes.GEOLOCATION_UPDATE, 'second update passes correct action type')
  t.equal(action3.type, actionTypes.GEOLOCATION_UPDATE, 'third update passes correct action type')
  t.deepEqual(action1.payload, {position: { location: [1, 2] }}, 'first update passes expected payload')
  t.deepEqual(action2.payload, {position: { location: [3, 4] }}, 'second update passes expected payload')
  t.deepEqual(action3.payload, {position: { location: [5, 6] }}, 'third update passes expected payload')
  t.equal(dispatch.callCount, 3, 'dispatch is called 3 times, once for each update')
  t.false(shallowRenderer.getRenderOutput(), 'dispatching multiple updates does not render anything')
  t.end()
})
