import test from 'tape'
import { Graph, Entity, Node } from '../redux/core'

test('constructor', function (t) {
  const entity = Entity()
  const base = Graph([entity])
  const graph = Graph(base)

  t.equal(base.entity(entity.id), entity, 'accepts an entities Array')
  t.equal(graph.entity(entity.id), entity, 'accepts a Graph')
  t.notEqual(base.entities, graph.entities, "copies other's entities")
  t.equal(base.base().entities, graph.base().entities, "rebases on other's base")
  t.ok(Graph().frozen, 'freezes by default')
  t.notOk(Graph([], true).frozen, 'remains mutable if passed true as second argument')
  t.end()
})

test('#hasEntity', function (t) {
  var node = Node()
  var graph = Graph([node])
  t.equal(graph.hasEntity(node.id), node, 'returns the entity when present')
  t.ok(typeof Graph().hasEntity('1') === 'undefined', 'returns undefined when the entity is not present')
  t.end()
})

test('#entity', function (t) {
  var node = Node()
  var graph = Graph([node])
  t.equal(graph.entity(node.id), node, 'returns the entity when present')
  t.throws(Graph().entity.bind(null, '1'), 'throws when the entity is not present')
  t.end()
})

// describe('#rebase', function (t) {
//   test('preserves existing entities', function (t) {
//     var node = Node({id: 'n'})
//     var graph = Graph([node])

//     graph.rebase([], [graph])

//     t.equal(graph.entity('n')).to.equal(node)
//   })

//   test('includes new entities', function (t) {
//     var node = Node({id: 'n'})
//     var graph = Graph()

//     graph.rebase([node], [graph])

//     t.equal(graph.entity('n')).to.equal(node)
//   })

//   test("doesn't rebase deleted entities", function (t) {
//     var node = Node({id: 'n', visible: false})
//     var graph = Graph()

//     graph.rebase([node], [graph])

//     t.equal(graph.hasEntity('n')).to.be.not.ok
//   })

//   test('gives precedence to existing entities', function (t) {
//     var a = Node({id: 'n'})
//     var b = Node({id: 'n'})
//     var graph = Graph([a])

//     graph.rebase([b], [graph])

//     t.equal(graph.entity('n')).to.equal(a)
//   })

//   test('gives precedence to new entities when force = true', function (t) {
//     var a = Node({id: 'n'})
//     var b = Node({id: 'n'})
//     var graph = Graph([a])

//     graph.rebase([b], [graph], true)

//     t.equal(graph.entity('n')).to.equal(b)
//   })

//   test('inherits entities from base prototypally', function (t) {
//     var graph = Graph()

//     graph.rebase([Node({id: 'n'})], [graph])

//     t.equal(graph.entities).not.to.have.ownProperty('n')
//   })

//   test('updates parentWays', function (t) {
//     var n = Node({id: 'n'})
//     var w1 = iD.Way({id: 'w1', nodes: ['n']})
//     var w2 = iD.Way({id: 'w2', nodes: ['n']})
//     var graph = Graph([n, w1])

//     graph.rebase([w2], [graph])

//     t.equal(graph.parentWays(n)).to.eql([w1, w2])
//     t.equal(graph._parentWays.hasOwnProperty('n')).to.be.false
//   })

//   test('avoids adding duplicate parentWays', function (t) {
//     var n = Node({id: 'n'})
//     var w1 = iD.Way({id: 'w1', nodes: ['n']})
//     var graph = Graph([n, w1])

//     graph.rebase([w1], [graph])

//     t.equal(graph.parentWays(n)).to.eql([w1])
//   })

//   test('updates parentWays for nodes with modified parentWays', function (t) {
//     var n = Node({id: 'n'})
//     var w1 = iD.Way({id: 'w1', nodes: ['n']})
//     var w2 = iD.Way({id: 'w2', nodes: ['n']})
//     var w3 = iD.Way({id: 'w3', nodes: ['n']})
//     var graph = Graph([n, w1])
//     var graph2 = graph.replace(w2)

//     graph.rebase([w3], [graph, graph2])

//     t.equal(graph2.parentWays(n)).to.eql([w1, w2, w3])
//   })

//   test('avoids re-adding a modified way as a parent way', function (t) {
//     var n1 = Node({id: 'n1'})
//     var n2 = Node({id: 'n2'})
//     var w1 = iD.Way({id: 'w1', nodes: ['n1', 'n2']})
//     var w2 = w1.removeNode('n2')
//     var graph = Graph([n1, n2, w1])
//     var graph2 = graph.replace(w2)

//     graph.rebase([w1], [graph, graph2])

//     t.equal(graph2.parentWays(n2)).to.eql([])
//   })

//   test('avoids re-adding a deleted way as a parent way', function (t) {
//     var n = Node({id: 'n'})
//     var w1 = iD.Way({id: 'w1', nodes: ['n']})
//     var graph = Graph([n, w1])
//     var graph2 = graph.remove(w1)

//     graph.rebase([w1], [graph, graph2])

//     t.equal(graph2.parentWays(n)).to.eql([])
//   })

//   test('re-adds a deleted node that is discovered to have another parent', function (t) {
//     var n = Node({id: 'n'})
//     var w1 = iD.Way({id: 'w1', nodes: ['n']})
//     var w2 = iD.Way({id: 'w2', nodes: ['n']})
//     var graph = Graph([n, w1])
//     var graph2 = graph.remove(n)

//     graph.rebase([n, w2], [graph, graph2])

//     t.equal(graph2.entity('n')).to.eql(n)
//   })

//   test('updates parentRelations', function (t) {
//     var n = Node({id: 'n'})
//     var r1 = iD.Relation({id: 'r1', members: [{id: 'n'}]})
//     var r2 = iD.Relation({id: 'r2', members: [{id: 'n'}]})
//     var graph = Graph([n, r1])

//     graph.rebase([r2], [graph])

//     t.equal(graph.parentRelations(n)).to.eql([r1, r2])
//     t.equal(graph._parentRels.hasOwnProperty('n')).to.be.false
//   })

//   test('avoids re-adding a modified relation as a parent relation', function (t) {
//     var n = Node({id: 'n'})
//     var r1 = iD.Relation({id: 'r1', members: [{id: 'n'}]})
//     var r2 = r1.removeMembersWithID('n')
//     var graph = Graph([n, r1])
//     var graph2 = graph.replace(r2)

//     graph.rebase([r1], [graph, graph2])

//     t.equal(graph2.parentRelations(n)).to.eql([])
//   })

//   test('avoids re-adding a deleted relation as a parent relation', function (t) {
//     var n = Node({id: 'n'})
//     var r1 = iD.Relation({id: 'r1', members: [{id: 'n'}]})
//     var graph = Graph([n, r1])
//     var graph2 = graph.remove(r1)

//     graph.rebase([r1], [graph, graph2])

//     t.equal(graph2.parentRelations(n)).to.eql([])
//   })

//   test('updates parentRels for nodes with modified parentWays', function (t) {
//     var n = Node({id: 'n'})
//     var r1 = iD.Relation({id: 'r1', members: [{id: 'n'}]})
//     var r2 = iD.Relation({id: 'r2', members: [{id: 'n'}]})
//     var r3 = iD.Relation({id: 'r3', members: [{id: 'n'}]})
//     var graph = Graph([n, r1])
//     var graph2 = graph.replace(r2)

//     graph.rebase([r3], [graph, graph2])

//     t.equal(graph2.parentRelations(n)).to.eql([r1, r2, r3])
//   })

//   test('invalidates transients', function (t) {
//     var n = Node({id: 'n'})
//     var w1 = iD.Way({id: 'w1', nodes: ['n']})
//     var w2 = iD.Way({id: 'w2', nodes: ['n']})
//     var graph = Graph([n, w1])

//     function numParents (entity) {
//       return graph.transient(entity, 'numParents', function (t) {
//         return graph.parentWays(entity).length
//       })
//     }

//     t.equal(numParents(n)).to.equal(1)
//     graph.rebase([w2], [graph])
//     t.equal(numParents(n)).to.equal(2)
//   })
// })

// describe('#remove', function (t) {
//   test('returns a new graph', function (t) {
//     var node = Node()
//     var graph = Graph([node])
//     t.equal(graph.remove(node)).not.to.equal(graph)
//   })

//   test("doesn't modify the receiver", function (t) {
//     var node = Node()
//     var graph = Graph([node])
//     graph.remove(node)
//     t.equal(graph.entity(node.id)).to.equal(node)
//   })

//   test('removes the entity from the result', function (t) {
//     var node = Node()
//     var graph = Graph([node])
//     t.equal(graph.remove(node).hasEntity(node.id)).to.be.undefined
//   })

//   test('removes the entity as a parentWay', function (t) {
//     var node = Node({id: 'n' })
//     var w1 = iD.Way({id: 'w', nodes: ['n']})
//     var graph = Graph([node, w1])
//     t.equal(graph.remove(w1).parentWays(node)).to.eql([])
//   })

//   test('removes the entity as a parentRelation', function (t) {
//     var node = Node({id: 'n' })
//     var r1 = iD.Relation({id: 'w', members: [{id: 'n' }]})
//     var graph = Graph([node, r1])
//     t.equal(graph.remove(r1).parentRelations(node)).to.eql([])
//   })
// })

// describe('#replace', function (t) {
//   test('is a no-op if the replacement is identical to the existing entity', function (t) {
//     var node = Node()
//     var graph = Graph([node])
//     t.equal(graph.replace(node)).to.equal(graph)
//   })

//   test('returns a new graph', function (t) {
//     var node = Node()
//     var graph = Graph([node])
//     t.equal(graph.replace(node.update())).not.to.equal(graph)
//   })

//   test("doesn't modify the receiver", function (t) {
//     var node = Node()
//     var graph = Graph([node])
//     graph.replace(node)
//     t.equal(graph.entity(node.id)).to.equal(node)
//   })

//   test('replaces the entity in the result', function (t) {
//     var node1 = Node()
//     var node2 = node1.update({})
//     var graph = Graph([node1])
//     t.equal(graph.replace(node2).entity(node2.id)).to.equal(node2)
//   })

//   test('adds parentWays', function (t) {
//     var node = Node({id: 'n' })
//     var w1 = iD.Way({id: 'w', nodes: ['n']})
//     var graph = Graph([node])
//     t.equal(graph.replace(w1).parentWays(node)).to.eql([w1])
//   })

//   test('removes parentWays', function (t) {
//     var node = Node({id: 'n' })
//     var w1 = iD.Way({id: 'w', nodes: ['n']})
//     var graph = Graph([node, w1])
//     t.equal(graph.remove(w1).parentWays(node)).to.eql([])
//   })

//   test("doesn't add duplicate parentWays", function (t) {
//     var node = Node({id: 'n' })
//     var w1 = iD.Way({id: 'w', nodes: ['n']})
//     var graph = Graph([node, w1])
//     t.equal(graph.replace(w1).parentWays(node)).to.eql([w1])
//   })

//   test('adds parentRelations', function (t) {
//     var node = Node({id: 'n' })
//     var r1 = iD.Relation({id: 'r', members: [{id: 'n'}]})
//     var graph = Graph([node])
//     t.equal(graph.replace(r1).parentRelations(node)).to.eql([r1])
//   })

//   test('removes parentRelations', function (t) {
//     var node = Node({id: 'n' })
//     var r1 = iD.Relation({id: 'r', members: [{id: 'n'}]})
//     var graph = Graph([node, r1])
//     t.equal(graph.remove(r1).parentRelations(node)).to.eql([])
//   })

//   test("doesn't add duplicate parentRelations", function (t) {
//     var node = Node({id: 'n' })
//     var r1 = iD.Relation({id: 'r', members: [{id: 'n'}]})
//     var graph = Graph([node, r1])
//     t.equal(graph.replace(r1).parentRelations(node)).to.eql([r1])
//   })
// })

// describe('#revert', function (t) {
//   test('is a no-op if the head entity is identical to the base entity', function (t) {
//     var n1 = Node({id: 'n'})
//     var graph = Graph([n1])
//     t.equal(graph.revert('n')).to.equal(graph)
//   })

//   test('returns a new graph', function (t) {
//     var n1 = Node({id: 'n'})
//     var n2 = n1.update({})
//     var graph = Graph([n1]).replace(n2)
//     t.equal(graph.revert('n')).not.to.equal(graph)
//   })

//   test("doesn't modify the receiver", function (t) {
//     var n1 = Node({id: 'n'})
//     var n2 = n1.update({})
//     var graph = Graph([n1]).replace(n2)
//     graph.revert('n')
//     t.equal(graph.hasEntity('n')).to.equal(n2)
//   })

//   test('removes a new entity', function (t) {
//     var n1 = Node({id: 'n'})
//     var graph = Graph().replace(n1)

//     graph = graph.revert('n')
//     t.equal(graph.hasEntity('n')).to.be.undefined
//   })

//   test('reverts an updated entity to the base version', function (t) {
//     var n1 = Node({id: 'n'})
//     var n2 = n1.update({})
//     var graph = Graph([n1]).replace(n2)

//     graph = graph.revert('n')
//     t.equal(graph.hasEntity('n')).to.equal(n1)
//   })

//   test('restores a deleted entity', function (t) {
//     var n1 = Node({id: 'n'})
//     var graph = Graph([n1]).remove(n1)

//     graph = graph.revert('n')
//     t.equal(graph.hasEntity('n')).to.equal(n1)
//   })

//   test('removes new parentWays', function (t) {
//     var n1 = Node({id: 'n'})
//     var w1 = iD.Way({id: 'w', nodes: ['n']})
//     var graph = Graph().replace(n1).replace(w1)

//     graph = graph.revert('w')
//     t.equal(graph.hasEntity('n')).to.equal(n1)
//     t.equal(graph.parentWays(n1)).to.eql([])
//   })

//   test('removes new parentRelations', function (t) {
//     var n1 = Node({id: 'n'})
//     var r1 = iD.Relation({id: 'r', members: [{id: 'n'}]})
//     var graph = Graph().replace(n1).replace(r1)

//     graph = graph.revert('r')
//     t.equal(graph.hasEntity('n')).to.equal(n1)
//     t.equal(graph.parentRelations(n1)).to.eql([])
//   })

//   test('reverts updated parentWays', function (t) {
//     var n1 = Node({id: 'n'})
//     var w1 = iD.Way({id: 'w', nodes: ['n']})
//     var w2 = w1.removeNode('n')
//     var graph = Graph([n1, w1]).replace(w2)

//     graph = graph.revert('w')
//     t.equal(graph.hasEntity('n')).to.equal(n1)
//     t.equal(graph.parentWays(n1)).to.eql([w1])
//   })

//   test('reverts updated parentRelations', function (t) {
//     var n1 = Node({id: 'n'})
//     var r1 = iD.Relation({id: 'r', members: [{id: 'n'}]})
//     var r2 = r1.removeMembersWithID('n')
//     var graph = Graph([n1, r1]).replace(r2)

//     graph = graph.revert('r')
//     t.equal(graph.hasEntity('n')).to.equal(n1)
//     t.equal(graph.parentRelations(n1)).to.eql([r1])
//   })

//   test('restores deleted parentWays', function (t) {
//     var n1 = Node({id: 'n'})
//     var w1 = iD.Way({id: 'w', nodes: ['n']})
//     var graph = Graph([n1, w1]).remove(w1)

//     graph = graph.revert('w')
//     t.equal(graph.hasEntity('n')).to.equal(n1)
//     t.equal(graph.parentWays(n1)).to.eql([w1])
//   })

//   test('restores deleted parentRelations', function (t) {
//     var n1 = Node({id: 'n'})
//     var r1 = iD.Relation({id: 'r', members: [{id: 'n'}]})
//     var graph = Graph([n1, r1]).remove(r1)

//     graph = graph.revert('r')
//     t.equal(graph.hasEntity('n')).to.equal(n1)
//     t.equal(graph.parentRelations(n1)).to.eql([r1])
//   })
// })

// describe('#update', function (t) {
//   test('returns a new graph if self is frozen', function (t) {
//     var graph = Graph()
//     t.equal(graph.update()).not.to.equal(graph)
//   })

//   test('returns self if self is not frozen', function (t) {
//     var graph = Graph([], true)
//     t.equal(graph.update()).to.equal(graph)
//   })

//   test("doesn't modify self is self is frozen", function (t) {
//     var node = Node()
//     var graph = Graph([node])

//     graph.update(function (graph) { graph.remove(node); })

//     t.equal(graph.entity(node.id)).to.equal(node)
//   })

//   test('modifies self is self is not frozen', function (t) {
//     var node = Node()
//     var graph = Graph([node], true)

//     graph.update(function (graph) { graph.remove(node); })

//     t.equal(graph.hasEntity(node.id)).to.be.undefined
//   })

//   test('executes all of the given functions', function (t) {
//     var a = Node()
//     var b = Node()
//     var graph = Graph([a])

//     graph = graph.update(
//       function (graph) { graph.remove(a); },
//       function (graph) { graph.replace(b); }
//     )

//     t.equal(graph.hasEntity(a.id)).to.be.undefined
//     t.equal(graph.entity(b.id)).to.equal(b)
//   })
// })

// describe('#parentWays', function (t) {
//   test('returns an array of ways that contain the given node id', function (t) {
//     var node = Node({id: 'n1'})
//     var way = iD.Way({id: 'w1', nodes: ['n1']})
//     var graph = Graph([node, way])
//     t.equal(graph.parentWays(node)).to.eql([way])
//     t.equal(graph.parentWays(way)).to.eql([])
//   })
// })

// describe('#parentRelations', function (t) {
//   test('returns an array of relations that contain the given entity id', function (t) {
//     var node = Node({id: 'n1'})
//     var nonnode = Node({id: 'n2'})
//     var relation = iD.Relation({id: 'r1', members: [{ id: 'n1', role: 'from' }]})
//     var graph = Graph([node, relation])
//     t.equal(graph.parentRelations(node)).to.eql([relation])
//     t.equal(graph.parentRelations(nonnode)).to.eql([])
//   })
// })

// describe('#childNodes', function (t) {
//   test('returns an array of child nodes', function (t) {
//     var node = Node({id: 'n1'})
//     var way = iD.Way({id: 'w1', nodes: ['n1']})
//     var graph = Graph([node, way])
//     t.equal(graph.childNodes(way)).to.eql([node])
//   })
// })
