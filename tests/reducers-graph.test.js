import proxyquire from 'proxyquire'
import test from 'tape'
import { Graph } from '../redux/core'
import actionCreators from '../redux/action_creators'

const createHelperStub = (callee) => (...args1) => (...args2) => {
  return { callee, args1, args2 }
}

const stubs = {
  './graph_helpers/save_entity': createHelperStub('save_entity'),
  './graph_helpers/delete_entity': createHelperStub('delete_entity')
}

const graphReducer = proxyquire('../redux/reducers/graph', stubs)

test('Type checking', function (t) {
  const graph = Graph()
  t.throws(graphReducer.bind(null, {}), 'State should be instance of Graph', 'Throws if state not instance of Graph')
  t.equal(graphReducer(graph), graph, 'If no action passed, just returns state unchanged')
  t.true(graphReducer() instanceof Graph, 'Default state is instance of Graph')
  t.end()
})

// TODO: Cannot for the life of me get mocking / proxyquire to work with ES6 modules.
test.skip('Save actions', function (t) {
  const testPayload = {
    some: 'attrs'
  }

  const graph = Graph()

  const saveActions = {
    observation: actionCreators.observationSave(testPayload),
    event: actionCreators.eventSave(testPayload),
    place: actionCreators.placeSave(testPayload)
  }

  for (let kind in saveActions) {
    let expectedResult = {
      callee: 'save_entity',
      args1: [graph],
      args2: [Object.assign({}, testPayload, {kind: kind})]
    }
    t.deepEqual(graphReducer(graph, saveActions[kind]), expectedResult, saveActions[kind].actionType + ' calls saveEntity() with expected arguments')
  }

  t.end()
})

// TODO: Cannot for the life of me get mocking / proxyquire to work with ES6 modules.
test.skip('Save actions', function (t) {
  const testPayload = {
    id: '123456'
  }

  const graph = Graph()

  const deleteActions = {
    observation: actionCreators.observationDelete(testPayload),
    event: actionCreators.eventDelete(testPayload),
    place: actionCreators.placeDelete(testPayload)
  }

  for (let kind in deleteActions) {
    let expectedResult = {
      callee: 'delete_entity',
      args1: [graph],
      args2: [testPayload.id]
    }
    t.deepEqual(graphReducer(graph, deleteActions[kind]), expectedResult, deleteActions[kind].actionType + ' calls saveEntity() with expected arguments')
  }

  t.end()
})
