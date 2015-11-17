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

test('Geolocation error position', function (t) {
  const dispatch = sinon.spy()
  const shallowRenderer = createRenderer()
  const mockError = new Error()

  shallowRenderer.render(<Geolocation dispatch={dispatch} />)
  t.false(shallowRenderer.getRenderOutput(), 'does not render anything')
  geolocationMock.sendError(mockError)
  t.equal(dispatch.args[0][0].type, actionTypes.GEOLOCATION_UPDATE, 'action type is correct')
  t.equal(dispatch.args[0][0].payload, mockError, 'payload is the Error returned from geolocation')
  t.true(dispatch.args[0][0].error, 'error variable is true')
  // Add checks for dispatches arguments...
  shallowRenderer.unmount()
  t.ok(geolocationMock.areWatchesRemoved(), 'watches are removed after component unmounts')
  t.end()
})

test('Geolocation good position', function (t) {
  const dispatch = sinon.spy()
  const shallowRenderer = createRenderer()

  shallowRenderer.render(<Geolocation dispatch={dispatch} />)
  t.false(shallowRenderer.getRenderOutput(), 'does not render anything')
  geolocationMock.sendPosition({ location: [1, 2] })
  t.equal(dispatch.args[0][0].type, actionTypes.GEOLOCATION_UPDATE, 'action type is correct')
  t.deepEqual(dispatch.args[0][0].payload, {position: { location: [1, 2] }}, 'passes expected payload')
  shallowRenderer.unmount()
  t.ok(geolocationMock.areWatchesRemoved(), 'watches are removed after component unmounts')
  t.end()
})

test('Geolocation handles updates on location', function (t) {
  const dispatch = sinon.spy()
  const shallowRenderer = createRenderer()

  shallowRenderer.render(<Geolocation dispatch={dispatch} />)
  t.false(shallowRenderer.getRenderOutput(), 'does not render anything')
  geolocationMock.sendPosition({ location: [1, 2] })
  t.equal(dispatch.args[0][0].type, actionTypes.GEOLOCATION_UPDATE, 'action type is correct')
  t.deepEqual(dispatch.args[0][0].payload, {position: { location: [1, 2] }}, 'passes expected payload')
  geolocationMock.sendPosition({ location: [3, 4] })
  t.deepEqual(dispatch.args[1][0].payload, {position: { location: [3, 4] }}, 'passes second payload')
  geolocationMock.sendPosition({ location: [5, 6] })
  t.deepEqual(dispatch.args[2][0].payload, {position: { location: [5, 6] }}, 'passes third payload')
  shallowRenderer.unmount()
  t.ok(geolocationMock.areWatchesRemoved(), 'watches are removed after component unmounts')
  t.end()
})
