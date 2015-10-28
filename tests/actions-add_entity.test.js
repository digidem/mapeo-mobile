import test from 'tape'
import { Entity, Graph } from '../redux/core'
import AddEntity from '../redux/actions/handers/shared/add_entity'

test('actions/handlers/shared/AddEntity', function (t) {
  var entity = Entity()
  var graph = AddEntity(entity)(Graph())
  t.equal(graph.entity(entity.id), entity, 'adds an entity to the graph')
})
