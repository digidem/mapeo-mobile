import test from 'tape'
import { Entity, Graph, Node } from '../redux/core'
import AddEntity from '../redux/reducers/graph/add_entity'

test('AddEntity, adding a dumb entity of type node', function (t) {
  t.plan(1)
  var entity = Entity({type: 'node'})
  var graph = AddEntity(entity)(Graph())
  t.equal(graph.entity(entity.id), entity, 'adds a dumb entity to the graph')
})

test('AddEntity, adding a node should work', function (t) {
  t.plan(1)
  var entity = Node()
  var graph = AddEntity(entity)(Graph())
  t.equal(graph.entity(entity.id), entity, 'adds an node entity to the graph')
})

test('AddEntity, adding an observation entity, should fail', function (t) {
  t.plan(1)
  var entity = Entity({type: 'observation'})
  t.throws(AddEntity(entity)(Graph()), 'adding an observation won\'t work')
})
