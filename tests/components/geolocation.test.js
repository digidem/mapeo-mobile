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
  t.equal(dispatch.args[0][0].type, actionTypes.GEOLOCATION_UPDATE, 'action type is correct')
  t.true(dispatch.args[0][0].payload instanceof Error, 'payload is an Error()')
  t.equal(dispatch.args[0][0].payload.code, mockError.code, 'payload has the right code')
  t.equal(dispatch.args[0][0].payload.message, mockError.message, 'payload has the right message')
  t.true(dispatch.args[0][0].error, 'error variable is true')
  t.end()
})

test('Geolocation good position', function (t) {
  const dispatch = sinon.spy()
  const shallowRenderer = createRenderer()

  shallowRenderer.render(<Geolocation dispatch={dispatch} />)
  geolocationMock.sendPosition({ location: [1, 2] })
  t.equal(dispatch.args[0][0].type, actionTypes.GEOLOCATION_UPDATE, 'action type is correct')
  t.deepEqual(dispatch.args[0][0].payload, {position: { location: [1, 2] }}, 'passes expected payload')
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
  t.equal(dispatch.args[0][0].type, actionTypes.GEOLOCATION_UPDATE, 'action type is correct')
  t.deepEqual(dispatch.args[0][0].payload, {position: { location: [1, 2] }}, 'passes expected payload')
  t.deepEqual(dispatch.args[1][0].payload, {position: { location: [3, 4] }}, 'passes second payload')
  t.deepEqual(dispatch.args[2][0].payload, {position: { location: [5, 6] }}, 'passes third payload')
  t.equal(dispatch.callCount, 3, 'dispatch is called 3 times, once for each update')
  t.false(shallowRenderer.getRenderOutput(), 'dispatching multiple updates does not render anything')
  t.end()
})
