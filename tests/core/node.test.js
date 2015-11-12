import test from 'tape'
import { Node, Way, Graph } from '../../src/core'

test('instantiation', function (t) {
  t.ok(Node() instanceof Node, 'returns instance of Node')
  t.equal(Node().type, 'node', 'returned type is node')
  t.deepEqual(Node().tags, {}, 'defaults tags to an empty object')
  t.deepEqual(Node({tags: {foo: 'bar'}}).tags, {foo: 'bar'}, 'sets tags as specified')
  t.end()
})

test('#extent', function (t) {
  t.ok(Node({loc: [5, 10]}).extent().equals([[5, 10], [5, 10]]), 'returns a point extent')
  t.end()
})

test('#intersects', function (t) {
  t.true(Node({loc: [0, 0]}).intersects([[-5, -5], [5, 5]]), 'returns true for a node within the given extent')
  t.false(Node({loc: [6, 6]}).intersects([[-5, -5], [5, 5]]), 'returns false for a node outside the given extend')
  t.end()
})

test('#geometry', function (t) {
  var node = Node()
  var way = Way({nodes: [node.id]})
  var graph = Graph([node, way])
  t.equal(node.geometry(graph), 'vertex', "returns 'vertex' if the node is a member of any way")

  graph = Graph([node])
  t.equal(node.geometry(graph), 'point', "returns 'point' if the node is not a member of any way")
  t.end()
})

test('#isIntersection', function (t) {
  var node = Node()
  var w1 = Way({nodes: [node.id], tags: {highway: 'residential'}})
  var w2 = Way({nodes: [node.id], tags: {highway: 'residential'}})
  var graph = Graph([node, w1, w2])
  t.true(node.isIntersection(graph), 'returns true for a node shared by more than one highway')

  w1 = Way({nodes: [node.id], tags: {waterway: 'river'}})
  w2 = Way({nodes: [node.id], tags: {waterway: 'river'}})
  graph = Graph([node, w1, w2])
  t.true(node.isIntersection(graph), 'returns true for a node shared by more than one waterway')

  t.end()
})

test('#isHighwayIntersection', function (t) {
  var node = Node()
  var w1 = Way({nodes: [node.id], tags: {highway: 'residential'}})
  var w2 = Way({nodes: [node.id], tags: {highway: 'residential'}})
  var graph = Graph([node, w1, w2])
  t.true(node.isHighwayIntersection(graph), 'returns true for a node shared by more than one highway')

  w1 = Way({nodes: [node.id], tags: {waterway: 'river'}})
  w2 = Way({nodes: [node.id], tags: {waterway: 'river'}})
  graph = Graph([node, w1, w2])
  t.false(node.isHighwayIntersection(graph), 'returns false for a node shared by more than one waterway')

  t.end()
})

test('#asJXON', function (t) {
  var node = Node({id: 'n-1', loc: [-77, 38], tags: {amenity: 'cafe'}})
  t.deepEqual(node.asJXON(), {
    node: {
      '@id': '-1',
      '@lon': -77,
      '@lat': 38,
      '@version': 0,
      tag: [{keyAttributes: {k: 'amenity', v: 'cafe'}}]
    }
  }, 'converts a node to jxon')
  t.equal(Node({loc: [0, 0]}).asJXON('1234').node['@changeset'], '1234', 'includes changeset if provided')
  t.end()
})

test('#asGeoJSON', function (t) {
  var node = Node({tags: {amenity: 'cafe'}, loc: [1, 2]})
  var json = node.asGeoJSON()

  t.equal(json.type, 'Point', 'converts to a GeoJSON Point geometry')
  t.deepEqual(json.coordinates, [1, 2], 'coordinates are correct')
  t.end()
})
