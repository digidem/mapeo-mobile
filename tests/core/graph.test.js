import test from 'tape'
import { Graph, Entity, Node, Way, Observation } from '../../src/core'
import deepEqual from 'deep-equal'

// Compares two objects deeply and also compares their prototypes.
// deepProtoEqual(Object.create({a: 'a'}), Object.create({a: 'a'})) === true
// deepProtoEqual(Object.create({a: 'a'}), Object.create({a: 'b'})) === false
function deepProtoEqual (a, b) {
  return deepEqual(a, b) && deepEqual(Object.getPrototypeOf(a), Object.getPrototypeOf(b))
}

test('constructor', function (t) {
  const entity = Entity()
  const graph1 = Graph([entity])
  const graph2 = Graph(graph1)

  t.equal(graph1.entity(entity.id), entity, 'accepts an entities Array')
  t.equal(Graph(graph1).entity(entity.id), entity, 'accepts a Graph')
  t.notEqual(graph1.entities, graph2.entities, "copies other's entities")
  t.true(deepProtoEqual(graph1.base().entities, graph2.base().entities), "rebases on other's base")
  t.true(Graph().frozen, 'freezes by default')
  t.false(Graph([], true).frozen, 'remains mutable if passed true as second argument')
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

test('#rebase', function (t) {
  var node = Node({id: 'n'})
  var graph = Graph([node])
  graph.rebase([], [graph])
  t.equal(graph.entity('n'), node, 'preserves existing entities')

  graph = Graph()
  graph.rebase([node], [graph])
  t.equal(graph.entity('n'), node, 'includes new entities')

  node = Node({id: 'n', visible: false})
  graph = Graph()
  graph.rebase([node], [graph])
  t.notOk(graph.hasEntity('n'), "doesn't rebase deleted entities")

  var a = Node({id: 'n'})
  var b = Node({id: 'n'})
  graph = Graph([a])
  graph.rebase([b], [graph])
  t.equal(graph.entity('n'), a, 'gives precedence to existing entities')

  graph = Graph([a])
  graph.rebase([b], [graph], true)
  t.equal(graph.entity('n'), b, 'gives precedence to new entities when force = true')

  graph = Graph()
  graph.rebase([Node({id: 'n'})], [graph])
  t.false(graph.entities.hasOwnProperty('n'), 'inherits entities from base prototypally')

  var n = Node({id: 'n'})
  var w1 = Way({id: 'w1', nodes: ['n']})
  var w2 = Way({id: 'w2', nodes: ['n']})
  graph = Graph([n, w1])
  graph.rebase([w2], [graph])
  t.deepEqual(graph.parentWays(n), [w1, w2], 'updates parentWays')
  t.false(graph._parentWays.hasOwnProperty('n'), 'parentWays inherits prototypally')

  graph = Graph([n, w1])
  graph.rebase([w1], [graph])
  t.deepEqual(graph.parentWays(n), [w1], 'avoids adding duplicate parentWays')

  var w3 = Way({id: 'w3', nodes: ['n']})
  graph = Graph([n, w1])
  var graph2 = graph.replace(w2)
  graph.rebase([w3], [graph, graph2])
  t.deepEqual(graph2.parentWays(n), [w1, w2, w3], 'updates parentWays for nodes with modified parentWays')

  var n1 = Node({id: 'n1'})
  var n2 = Node({id: 'n2'})
  w1 = Way({id: 'w1', nodes: ['n1', 'n2']})
  w2 = w1.removeNode('n2')
  graph = Graph([n1, n2, w1])
  graph2 = graph.replace(w2)
  graph.rebase([w1], [graph, graph2])
  t.deepEqual(graph2.parentWays(n2), [], 'avoids re-adding a modified way as a parent way')

  w1 = Way({id: 'w1', nodes: ['n']})
  graph = Graph([n, w1])
  graph2 = graph.remove(w1)
  graph.rebase([w1], [graph, graph2])
  t.deepEqual(graph2.parentWays(n), [], 'avoids re-adding a deleted way as a parent way')

  w1 = Way({id: 'w1', nodes: ['n']})
  w2 = Way({id: 'w2', nodes: ['n']})
  graph = Graph([n, w1])
  graph2 = graph.remove(n)
  graph.rebase([n, w2], [graph, graph2])
  t.equal(graph2.entity('n'), n, 're-adds a deleted node that is discovered to have another parent')

  var o1 = Observation({id: 'o1', link: {id: 'n'}})
  var o2 = Observation({id: 'o2', link: {id: 'n'}})

  graph = Graph([n, o1, o2])
  t.deepEqual(graph.observations(n), [o1, o2], 'links observations to nodes')

  var o3 = Observation({id: 'o3', link: {id: 'w1'}})
  graph = Graph([w1, o3])
  t.deepEqual(graph.observations(w1), [o3], 'links observations to ways')

  graph = Graph([n, o1])
  graph.rebase([o2], [graph])
  t.deepEqual(graph.observations(n), [o1, o2], 'updates linked observations')
  t.false(graph._observations.hasOwnProperty('n'), 'observations updated prototypally')

  o2 = o1.removeLink()
  graph = Graph([n, o1])
  graph2 = graph.replace(o2)
  graph.rebase([o1], [graph, graph2])
  t.deepEqual(graph2.observations(n), [], 'avoids re-adding an unlinked observation to a node')

  graph = Graph([n, o1])
  graph2 = graph.remove(o1)

  graph.rebase([o1], [graph, graph2])
  t.deepEqual(graph2.observations(n), [], 'avoids re-adding a deleted observation to a node')

  // test('updates parentRelations', function (t) {
  //   var n = Node({id: 'n'})
  //   var r1 = Relation({id: 'r1', members: [{id: 'n'}]})
  //   var r2 = Relation({id: 'r2', members: [{id: 'n'}]})
  //   var graph = Graph([n, r1])

  //   graph.rebase([r2], [graph])

  //   t.equal(graph.parentRelations(n)).to.eql([r1, r2])
  //   t.equal(graph._parentRels.hasOwnProperty('n')).to.be.false
  // })

  // test('avoids re-adding a modified relation as a parent relation', function (t) {
  //   var n = Node({id: 'n'})
  //   var r1 = Relation({id: 'r1', members: [{id: 'n'}]})
  //   var r2 = r1.removeMembersWithID('n')
  //   var graph = Graph([n, r1])
  //   var graph2 = graph.replace(r2)

  //   graph.rebase([r1], [graph, graph2])

  //   t.equal(graph2.parentRelations(n)).to.eql([])
  // })

  // test('avoids re-adding a deleted relation as a parent relation', function (t) {
  //   var n = Node({id: 'n'})
  //   var r1 = Relation({id: 'r1', members: [{id: 'n'}]})
  //   var graph = Graph([n, r1])
  //   var graph2 = graph.remove(r1)

  //   graph.rebase([r1], [graph, graph2])

  //   t.equal(graph2.parentRelations(n)).to.eql([])
  // })

  // test('updates parentRels for nodes with modified parentWays', function (t) {
  //   var n = Node({id: 'n'})
  //   var r1 = Relation({id: 'r1', members: [{id: 'n'}]})
  //   var r2 = Relation({id: 'r2', members: [{id: 'n'}]})
  //   var r3 = Relation({id: 'r3', members: [{id: 'n'}]})
  //   var graph = Graph([n, r1])
  //   var graph2 = graph.replace(r2)

  //   graph.rebase([r3], [graph, graph2])

  //   t.equal(graph2.parentRelations(n)).to.eql([r1, r2, r3])
  // })

  n = Node({id: 'n'})
  w1 = Way({id: 'w1', nodes: ['n']})
  w2 = Way({id: 'w2', nodes: ['n']})
  graph = Graph([n, w1])

  function numParents (entity) {
    return graph.transient(entity, 'numParents', function (t) {
      return graph.parentWays(entity).length
    })
  }

  t.equal(numParents(n), 1, 'invalidates transients')
  graph.rebase([w2], [graph])
  t.equal(numParents(n), 2, 'invalidates transients')

  t.end()
})

test('#remove', function (t) {
  var node = Node()
  var graph = Graph([node])
  t.notEqual(graph.remove(node), graph, 'returns a new graph')

  graph.remove(node)
  t.equal(graph.entity(node.id), node, "doesn't modify the receiver")

  t.true(typeof graph.remove(node).hasEntity(node.id) === 'undefined', 'removes the entity from the result')

  var w1 = Way({id: 'w', nodes: ['n']})
  t.deepEqual(Graph([node, w1]).remove(w1).parentWays(node), [], 'removes the entity as a parentWay')

  var o1 = Observation({id: 'o1', link: {id: 'n'}})
  t.deepEqual(Graph([node, o1]).remove(o1).observations(node), [], 'removes entity from linked observations')

  t.end()
})

// test('removes the entity as a parentRelation', function (t) {
//   var node = Node({id: 'n' })
//   var r1 = Relation({id: 'w', members: [{id: 'n' }]})
//   var graph = Graph([node, r1])
//   t.equal(graph.remove(r1).parentRelations(node)).to.eql([])
// })

test('#replace', function (t) {
  var node = Node({id: 'n'})
  var graph = Graph([node])
  t.equal(graph.replace(node), graph, 'is a no-op if the replacement is identical to the existing entity')

  t.notEqual(graph.replace(node.update()), graph, 'returns a new graph')

  t.equal(graph.replace(node).entity(node.id), node, "doesn't modify the receiver")

  var node2 = node.update({})
  t.equal(graph.replace(node2).entity(node2.id), node2, 'replaces the entity in the result')

  var w1 = Way({id: 'w', nodes: ['n']})
  t.deepEqual(Graph([node, w1]).replace(w1).parentWays(node), [w1], 'adds parentWays')

  t.deepEqual(Graph([node, w1]).remove(w1).parentWays(node), [], 'removes parentWays')

  t.deepEqual(Graph([node, w1]).replace(w1).parentWays(node), [w1], "doesn't add duplicate parentWays")

  // var r1 = Relation({id: 'r', members: [{id: 'n'}]})
  // t.deepEqual(Graph([node, r1]).replace(r1).parentRelations(node), [r1], 'adds parentRelations')
  // t.deepEqual(Graph([node, r1]).remove(r1).parentRelations(node), [], 'removes parentRelations')
  // t.deepEqual(Graph([node, r1]).replace(r1).parentRelations(node), [r1], "doesn't add duplicate parentRelations")

  var o1 = Observation({id: 'o', link: {id: 'n'}})
  t.deepEqual(Graph([node, o1]).replace(o1).observations(node), [o1], 'adds linked observations')

  t.deepEqual(Graph([node, o1]).remove(o1).observations(node), [], 'removes linked observations')

  t.deepEqual(Graph([node, o1]).replace(o1).observations(node), [o1], "doesn't add duplicate linked observations")

  t.end()
})

test('#revert', function (t) {
  var n1 = Node({id: 'n'})
  var graph = Graph([n1])
  t.equal(graph.revert('n'), graph, 'is a no-op if the head entity is identical to the base entity')

  var n2 = n1.update({})
  t.notEqual(graph.replace(n2).revert('n'), graph, 'returns a new graph')

  var graph2 = graph.replace(n2)
  graph2.revert('n')
  t.equal(graph2.hasEntity('n'), n2, "doesn't modify the receiver")

  t.equal(typeof Graph().replace(n1).revert('n').hasEntity('n'), 'undefined', 'removes a new entity')

  t.equal(graph.replace(n2).revert('n').hasEntity('n'), n1, 'reverts an updated entity to the base version')

  t.equal(graph.remove(n1).revert('n').hasEntity('n'), n1, 'restores a deleted entity')

  var w1 = Way({id: 'w', nodes: ['n']})
  var wGraph = Graph().replace(n1).replace(w1).revert('w')
  t.equal(wGraph.hasEntity('n'), n1, 'node remains after new parentWays reverted')
  t.deepEqual(wGraph.parentWays(n1), [], 'removes new parentWays')

  var o1 = Observation({id: 'o', link: {id: 'n'}})
  var oGraph = Graph().replace(n1).replace(o1).revert('o')
  t.equal(oGraph.hasEntity('n'), n1, 'node remains after new linked observation reverted')
  t.deepEqual(oGraph.parentWays(n1), [], 'removes new linked observations')

// test('removes new parentRelations', function (t) {
//   var n1 = Node({id: 'n'})
//   var r1 = Relation({id: 'r', members: [{id: 'n'}]})
//   var graph = Graph().replace(n1).replace(r1)
//   graph = graph.revert('r')
//   t.equal(graph.hasEntity('n')).to.equal(n1)
//   t.equal(graph.parentRelations(n1)).to.eql([])
// })

  var w2 = w1.removeNode('n')
  var wGraph2 = Graph([n1, w1]).replace(w2).revert('w')
  t.equal(wGraph2.hasEntity('n'), n1, 'node remains after updated parentWays reverted')
  t.deepEqual(wGraph2.parentWays(n1), [w1], 'reverts updated parentWays')

  var o2 = o1.removeLink('n')
  var oGraph2 = Graph([n1, o1]).replace(o2).revert('o')
  t.equal(oGraph2.hasEntity('n'), n1, 'node remains after updated linked observation reverted')
  t.deepEqual(oGraph2.observations(n1), [o1], 'reverts updated linked observations')

// test('reverts updated parentRelations', function (t) {
//   var n1 = Node({id: 'n'})
//   var r1 = Relation({id: 'r', members: [{id: 'n'}]})
//   var r2 = r1.removeMembersWithID('n')
//   var graph = Graph([n1, r1]).replace(r2)
//   graph = graph.revert('r')
//   t.equal(graph.hasEntity('n')).to.equal(n1)
//   t.equal(graph.parentRelations(n1)).to.eql([r1])
// })

  var wGraph3 = Graph([n1, w1]).remove(w1).revert('w')
  t.equal(wGraph3.hasEntity('n'), n1, 'node remains after deleted parentWays reverted')
  t.deepEqual(wGraph3.parentWays(n1), [w1], 'reverts deleted parentWays')

  var oGraph3 = Graph([n1, o1]).remove(o1).revert('o')
  t.equal(oGraph3.hasEntity('n'), n1, 'node remains after deleted linked observation reverted')
  t.deepEqual(oGraph3.observations(n1), [o1], 'reverts deleted linked observations')

  t.end()

// test('restores deleted parentRelations', function (t) {
//   var n1 = Node({id: 'n'})
//   var r1 = Relation({id: 'r', members: [{id: 'n'}]})
//   var graph = Graph([n1, r1]).remove(r1)
//   graph = graph.revert('r')
//   t.equal(graph.hasEntity('n')).to.equal(n1)
//   t.equal(graph.parentRelations(n1)).to.eql([r1])
// })
})

test('#update', function (t) {
  var node = Node()
  var graph = Graph([node])
  t.notEqual(graph.update(), graph, 'returns a new graph if self is frozen')

  var graphUnfrozen = Graph([], true)
  t.equal(graphUnfrozen.update(), graphUnfrozen, 'returns self if self is not frozen')

  graph.update(function (graph) { graph.remove(node) })
  t.equal(graph.entity(node.id), node, "doesn't modify self is self is frozen")

  graphUnfrozen.update(function (graph) { graphUnfrozen.remove(node) })
  t.equal(typeof graphUnfrozen.hasEntity(node.id), 'undefined', 'modifies self is self is not frozen')

  t.test('#update executes all of the given functions', function (st) {
    var a = Node()
    var b = Node()
    var graph = Graph([a])

    graph = graph.update(
      function (graph) { graph.remove(a) },
      function (graph) { graph.replace(b) }
    )

    st.equal(typeof graph.hasEntity(a.id), 'undefined', 'removed node a')
    st.equal(graph.entity(b.id), b, 'added node b')
    st.end()
  })

  t.end()
})

test('#parentWays returns an array of ways that contain the given node id', function (t) {
  var node = Node({id: 'n1'})
  var way = Way({id: 'w1', nodes: ['n1']})
  var graph = Graph([node, way])

  t.deepEqual(graph.parentWays(node), [way], 'returns parent ways of node')
  t.deepEqual(graph.parentWays(way), [], 'parent ways of way is empty')

  t.end()
})

test('#observations', function (t) {
  var node = Node({id: 'n1'})
  var way = Way({id: 'w1', nodes: ['n1']})
  var o1 = Observation({id: 'o1', link: {id: 'n1'}})
  var o2 = Observation({id: 'o2', link: {id: 'w1'}})
  var graph = Graph([node, way, o1, o2])

  t.deepEqual(graph.observations(node), [o1], 'returns observations linked to node')
  t.deepEqual(graph.observations(way), [o2], 'returns observations linked to way')
  t.deepEqual(graph.observations(o1), [], 'no observations linked to observation')

  t.end()
})

// describe('#parentRelations', function (t) {
//   test('returns an array of relations that contain the given entity id', function (t) {
//     var node = Node({id: 'n1'})
//     var nonnode = Node({id: 'n2'})
//     var relation = Relation({id: 'r1', members: [{ id: 'n1', role: 'from' }]})
//     var graph = Graph([node, relation])
//     t.equal(graph.parentRelations(node)).to.eql([relation])
//     t.equal(graph.parentRelations(nonnode)).to.eql([])
//   })
// })

// TODO: do we need something similar for observations?
test('#childNodes', function (t) {
  var node = Node({id: 'n1'})
  var way = Way({id: 'w1', nodes: ['n1']})
  var graph = Graph([node, way])
  t.deepEqual(graph.childNodes(way), [node], 'returns an array of child nodes')
  t.end()
})

