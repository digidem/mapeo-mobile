import test from 'tape'
import { Node, Way, Graph } from '../../src/core'

test('Way', function (t) {
  // if (debug) {
  //   it('freezes nodes', function () {
  //     t.equal(Object.isFrozen(Way().nodes)).to.be.true
  //   })
  // }

  t.true(Way() instanceof Way, 'returns instanceof Way')
  t.equal(Way().type, 'way', 'returns type "way"')
  t.deepEqual(Way().nodes, [], 'defaults nodes to an empty array')
  t.deepEqual(Way({nodes: ['n-1']}).nodes, ['n-1'], 'sets nodes as specified')
  t.deepEqual(Way().tags, {}, 'defaults tags to an empty object')
  t.deepEqual(Way({tags: {foo: 'bar'}}).tags, {foo: 'bar'}, 'sets tags as specified')
  t.end()
})

test('#copy', function (t) {
  var w1 = Way({id: 'w1', nodes: ['a', 'b', 'c', 'a']})
  var result = w1.copy()
  var w2 = result[0]

  t.equal(result.length, 1, 'returns Array of length 1')
  t.true(w2 instanceof Way, 'returns instanceof Way')
  t.notEqual(w1, w2, 'returns new Way')
  t.deepEqual(w1.nodes, w2.nodes, 'keeps same nodes when deep = false')

  t.test('makes new nodes when deep = true', function (st) {
    var a = Node({id: 'a'})
    var b = Node({id: 'b'})
    var c = Node({id: 'c'})
    var w1 = Way({id: 'w1', nodes: ['a', 'b', 'c', 'a']})
    var graph = Graph([a, b, c, w1])
    var result = w1.copy(true, graph)
    var w2 = result[0]

    st.equal(result.length, 4, 'deep copy with 3 linked nodes returns array length 4')
    st.true(result[0] instanceof Way)
    st.true(result[1] instanceof Node)
    st.true(result[2] instanceof Node)
    st.true(result[3] instanceof Node)

    st.notEqual(w2.nodes[0], w1.nodes[0])
    st.notEqual(w2.nodes[1], w1.nodes[1])
    st.notEqual(w2.nodes[2], w1.nodes[2])
    st.equal(w2.nodes[3], w2.nodes[0])
    st.end()
  })
  t.end()
})

test('#first', function (t) {
  t.equal(Way({nodes: ['a', 'b', 'c']}).first(), 'a', 'returns the first node')
  t.end()
})

test('#last', function (t) {
  t.equal(Way({nodes: ['a', 'b', 'c']}).last(), 'c', 'returns the last node')
  t.end()
})

test('#contains', function (t) {
  t.true(Way({nodes: ['a', 'b', 'c']}).contains('b'), 'returns true if the way contains the given node')
  t.false(Way({nodes: ['a', 'b', 'c']}).contains('d'), 'returns false if the way does not contain the given node')
  t.end()
})

// test('#affix', function (t) {
// it("returns 'prefix' if the way starts with the given node", function (t) {
//   t.equal(Way({nodes: ['a', 'b', 'c']}).affix('a')).to.equal('prefix')
// })

// it("returns 'suffix' if the way ends with the given node", function (t) {
//   t.equal(Way({nodes: ['a', 'b', 'c']}).affix('c')).to.equal('suffix')
// })

// it('returns falsy if the way does not start or end with the given node', function (t) {
//   t.equal(Way({nodes: ['a', 'b', 'c']}).affix('b')).not.to.be.ok
//   t.equal(Way({nodes: []}).affix('b')).not.to.be.ok
// })
// })

// test('#extent', function (t) {
// it('returns the minimal extent containing all member nodes', function (t) {
//   var node1 = Node({loc: [0, 0]}),
//     node2 = Node({loc: [5, 10]}),
//     way = Way({nodes: [node1.id, node2.id]}),
//     graph = Graph([node1, node2, way])
//   t.equal(way.extent(graph).equals([[0, 0], [5, 10]])).to.be.ok
// })
// })

// test('#isClosed', function (t) {
// it('returns false when the way has no nodes', function (t) {
//   t.equal(Way().isClosed()).to.equal(false)
// })

// it('returns false when the way ends are not equal', function (t) {
//   t.equal(Way({nodes: ['n1', 'n2']}).isClosed()).to.equal(false)
// })

// it('returns true when the way ends are equal', function (t) {
//   t.equal(Way({nodes: ['n1', 'n2', 'n1']}).isClosed()).to.equal(true)
// })
// })

// test('#isConvex', function (t) {
// it('returns true for convex ways', function (t) {
//   //    d -- e
//   //    |     \
//   //    |      a
//   //    |     /
//   //    c -- b
//   var graph = Graph([
//     Node({id: 'a', loc: [ 0.0003, 0.0000]}),
//     Node({id: 'b', loc: [ 0.0002, -0.0002]}),
//     Node({id: 'c', loc: [-0.0002, -0.0002]}),
//     Node({id: 'd', loc: [-0.0002, 0.0002]}),
//     Node({id: 'e', loc: [ 0.0002, 0.0002]}),
//     Way({id: 'w', nodes: ['a', 'b', 'c', 'd', 'e', 'a']})
//   ])
//   t.equal(graph.entity('w').isConvex(graph)).to.be.true
// })

// it('returns false for concave ways', function (t) {
//   //    d -- e
//   //    |   /
//   //    |  a
//   //    |   \
//   //    c -- b
//   var graph = Graph([
//     Node({id: 'a', loc: [ 0.0000, 0.0000]}),
//     Node({id: 'b', loc: [ 0.0002, -0.0002]}),
//     Node({id: 'c', loc: [-0.0002, -0.0002]}),
//     Node({id: 'd', loc: [-0.0002, 0.0002]}),
//     Node({id: 'e', loc: [ 0.0002, 0.0002]}),
//     Way({id: 'w', nodes: ['a', 'b', 'c', 'd', 'e', 'a']})
//   ])
//   t.equal(graph.entity('w').isConvex(graph)).to.be.false
// })

// it('returns null for non-closed ways', function (t) {
//   //    d -- e
//   //    |
//   //    |  a
//   //    |   \
//   //    c -- b
//   var graph = Graph([
//     Node({id: 'a', loc: [ 0.0000, 0.0000]}),
//     Node({id: 'b', loc: [ 0.0002, -0.0002]}),
//     Node({id: 'c', loc: [-0.0002, -0.0002]}),
//     Node({id: 'd', loc: [-0.0002, 0.0002]}),
//     Node({id: 'e', loc: [ 0.0002, 0.0002]}),
//     Way({id: 'w', nodes: ['a', 'b', 'c', 'd', 'e']})
//   ])
//   t.equal(graph.entity('w').isConvex(graph)).to.be.null
// })

// it('returns null for degenerate ways', function (t) {
//   var graph = Graph([
//     Node({id: 'a', loc: [0.0000, 0.0000]}),
//     Way({id: 'w', nodes: ['a', 'a']})
//   ])
//   t.equal(graph.entity('w').isConvex(graph)).to.be.null
// })
// })

// test('#layer', function (t) {
// it('returns 0 when the way has no tags', function (t) {
//   t.equal(Way().layer()).to.equal(0)
// })

// it('returns the layer when the way has an explicit layer tag', function (t) {
//   t.equal(Way({tags: { layer: '2' }}).layer()).to.equal(2)
//   t.equal(Way({tags: { layer: '-5' }}).layer()).to.equal(-5)
// })

// it('clamps the layer to within -10, 10', function (t) {
//   t.equal(Way({tags: { layer: '12' }}).layer()).to.equal(10)
//   t.equal(Way({tags: { layer: '-15' }}).layer()).to.equal(-10)
// })

// it('returns 1 for location=overground', function (t) {
//   t.equal(Way({tags: { location: 'overground' }}).layer()).to.equal(1)
// })

// it('returns -1 for location=underground', function (t) {
//   t.equal(Way({tags: { location: 'underground' }}).layer()).to.equal(-1)
// })

// it('returns -10 for location=underwater', function (t) {
//   t.equal(Way({tags: { location: 'underwater' }}).layer()).to.equal(-10)
// })

// it('returns 10 for power lines', function (t) {
//   t.equal(Way({tags: { power: 'line' }}).layer()).to.equal(10)
//   t.equal(Way({tags: { power: 'minor_line' }}).layer()).to.equal(10)
// })

// it('returns 10 for aerialways', function (t) {
//   t.equal(Way({tags: { aerialway: 'cable_car' }}).layer()).to.equal(10)
// })

// it('returns 1 for bridges', function (t) {
//   t.equal(Way({tags: { bridge: 'yes' }}).layer()).to.equal(1)
// })

// it('returns -1 for cuttings', function (t) {
//   t.equal(Way({tags: { cutting: 'yes' }}).layer()).to.equal(-1)
// })

// it('returns -1 for tunnels', function (t) {
//   t.equal(Way({tags: { tunnel: 'yes' }}).layer()).to.equal(-1)
// })

// it('returns -1 for waterways', function (t) {
//   t.equal(Way({tags: { waterway: 'stream' }}).layer()).to.equal(-1)
// })

// it('returns -10 for pipelines', function (t) {
//   t.equal(Way({tags: { man_made: 'pipeline' }}).layer()).to.equal(-10)
// })

// it('returns -10 for boundaries', function (t) {
//   t.equal(Way({tags: { boundary: 'administrative' }}).layer()).to.equal(-10)
// })

// })

// test('#isOneWay', function (t) {
// it('returns false when the way has no tags', function (t) {
//   t.equal(Way().isOneWay()).to.be.false
// })

// it('returns false when the way has tag oneway=no', function (t) {
//   t.equal(Way({tags: { oneway: 'no' }}).isOneWay()).to.be.false
//   t.equal(Way({tags: { oneway: '0' }}).isOneWay()).to.be.false
// })

// it('returns true when the way has tag oneway=yes', function (t) {
//   t.equal(Way({tags: { oneway: 'yes' }}).isOneWay()).to.be.true
//   t.equal(Way({tags: { oneway: '1' }}).isOneWay()).to.be.true
//   t.equal(Way({tags: { oneway: '-1' }}).isOneWay()).to.be.true
// })

// it('returns true when the way has implied oneway tag (waterway=river, waterway=stream, etc)', function (t) {
//   t.equal(Way({tags: { waterway: 'river' }}).isOneWay()).to.be.true
//   t.equal(Way({tags: { waterway: 'stream' }}).isOneWay()).to.be.true
//   t.equal(Way({tags: { highway: 'motorway' }}).isOneWay()).to.be.true
//   t.equal(Way({tags: { highway: 'motorway_link' }}).isOneWay()).to.be.true
//   t.equal(Way({tags: { junction: 'roundabout' }}).isOneWay()).to.be.true
// })

// it('returns false when oneway=no overrides implied oneway tag', function (t) {
//   t.equal(Way({tags: { junction: 'roundabout', oneway: 'no' }}).isOneWay()).to.be.false
//   t.equal(Way({tags: { highway: 'motorway', oneway: 'no' }}).isOneWay()).to.be.false
// })
// })

// test('#isArea', function (t) {
// it('returns false when the way has no tags', function (t) {
//   t.equal(Way().isArea()).to.equal(false)
// })

// it('returns true if the way has tag area=yes', function (t) {
//   t.equal(Way({tags: { area: 'yes' }}).isArea()).to.equal(true)
// })

// it('returns false if the way is closed and has no tags', function (t) {
//   t.equal(Way({nodes: ['n1', 'n1']}).isArea()).to.equal(false)
// })

// it('returns true if the way is closed and has a key in areaKeys', function (t) {
//   t.equal(Way({nodes: ['n1', 'n1'], tags: {building: 'yes'}}).isArea()).to.equal(true)
// })

// it('returns false if the way is closed and has no keys in areaKeys', function (t) {
//   t.equal(Way({nodes: ['n1', 'n1'], tags: {a: 'b'}}).isArea()).to.equal(false)
// })

// it('returns false if the way is closed and has tag area=no', function (t) {
//   t.equal(Way({nodes: ['n1', 'n1'], tags: {area: 'no', building: 'yes'}}).isArea()).to.equal(false)
// })

// it('returns false for coastline', function (t) {
//   t.equal(Way({nodes: ['n1', 'n1'], tags: {natural: 'coastline'}}).isArea()).to.equal(false)
// })
// })

// test('#isDegenerate', function (t) {
// it('returns true for a linear way with zero or one nodes', function (t) {
//   t.equal(Way({nodes: []}).isDegenerate()).to.equal(true)
//   t.equal(Way({nodes: ['a']}).isDegenerate()).to.equal(true)
// })

// it('returns true for a circular way with only one unique node', function (t) {
//   t.equal(Way({nodes: ['a', 'a']}).isDegenerate()).to.equal(true)
// })

// it('returns false for a linear way with two or more nodes', function (t) {
//   t.equal(Way({nodes: ['a', 'b']}).isDegenerate()).to.equal(false)
// })

// it('returns true for an area with zero, one, or two unique nodes', function (t) {
//   t.equal(Way({tags: {area: 'yes'}, nodes: []}).isDegenerate()).to.equal(true)
//   t.equal(Way({tags: {area: 'yes'}, nodes: ['a', 'a']}).isDegenerate()).to.equal(true)
//   t.equal(Way({tags: {area: 'yes'}, nodes: ['a', 'b', 'a']}).isDegenerate()).to.equal(true)
// })

// it('returns false for an area with three or more unique nodes', function (t) {
//   t.equal(Way({tags: {area: 'yes'}, nodes: ['a', 'b', 'c', 'a']}).isDegenerate()).to.equal(false)
// })
// })

// test('#areAdjacent', function (t) {
// it('returns false for nodes not in the way', function (t) {
//   t.equal(Way().areAdjacent('a', 'b')).to.equal(false)
// })

// it('returns false for non-adjacent nodes in the way', function (t) {
//   t.equal(Way({nodes: ['a', 'b', 'c']}).areAdjacent('a', 'c')).to.equal(false)
// })

// it('returns true for adjacent nodes in the way (forward)', function (t) {
//   var way = Way({nodes: ['a', 'b', 'c', 'd']})
//   t.equal(way.areAdjacent('a', 'b')).to.equal(true)
//   t.equal(way.areAdjacent('b', 'c')).to.equal(true)
//   t.equal(way.areAdjacent('c', 'd')).to.equal(true)
// })

// it('returns true for adjacent nodes in the way (reverse)', function (t) {
//   var way = Way({nodes: ['a', 'b', 'c', 'd']})
//   t.equal(way.areAdjacent('b', 'a')).to.equal(true)
//   t.equal(way.areAdjacent('c', 'b')).to.equal(true)
//   t.equal(way.areAdjacent('d', 'c')).to.equal(true)
// })
// })

// test('#geometry', function (t) {
// it("returns 'line' when the way is not an area", function (t) {
//   t.equal(Way().geometry(Graph())).to.equal('line')
// })

// it("returns 'area' when the way is an area", function (t) {
//   t.equal(Way({tags: { area: 'yes' }}).geometry(Graph())).to.equal('area')
// })
// })

// test('#addNode', function (t) {
// it('adds a node to the end of a way', function (t) {
//   var w = Way()
//   t.equal(w.addNode('a').nodes).to.eql(['a'])
// })

// it('adds a node to a way at index 0', function (t) {
//   var w = Way({nodes: ['a', 'b']})
//   t.equal(w.addNode('c', 0).nodes).to.eql(['c', 'a', 'b'])
// })

// it('adds a node to a way at a positive index', function (t) {
//   var w = Way({nodes: ['a', 'b']})
//   t.equal(w.addNode('c', 1).nodes).to.eql(['a', 'c', 'b'])
// })

// it('adds a node to a way at a negative index', function (t) {
//   var w = Way({nodes: ['a', 'b']})
//   t.equal(w.addNode('c', -1).nodes).to.eql(['a', 'c', 'b'])
// })
// })

// test('#updateNode', function (t) {
// it('updates the node id at the specified index', function (t) {
//   var w = Way({nodes: ['a', 'b', 'c']})
//   t.equal(w.updateNode('d', 1).nodes).to.eql(['a', 'd', 'c'])
// })
// })

// test('#removeNode', function (t) {
// it('removes the node', function (t) {
//   var a = Node({id: 'a'}),
//     w = Way({nodes: ['a']})

//   t.equal(w.removeNode('a').nodes).to.eql([])
// })

// it('prevents duplicate consecutive nodes', function (t) {
//   var a = Node({id: 'a'}),
//     b = Node({id: 'b'}),
//     c = Node({id: 'c'}),
//     w = Way({nodes: ['a', 'b', 'c', 'b']})

//   t.equal(w.removeNode('c').nodes).to.eql(['a', 'b'])
// })

// it('preserves circularity', function (t) {
//   var a = Node({id: 'a'}),
//     b = Node({id: 'b'}),
//     c = Node({id: 'c'}),
//     d = Node({id: 'd'}),
//     w = Way({nodes: ['a', 'b', 'c', 'd', 'a']})

//   t.equal(w.removeNode('a').nodes).to.eql(['b', 'c', 'd', 'b'])
// })

// it('prevents duplicate consecutive nodes when preserving circularity', function (t) {
//   var a = Node({id: 'a'}),
//     b = Node({id: 'b'}),
//     c = Node({id: 'c'}),
//     d = Node({id: 'd'}),
//     w = Way({nodes: ['a', 'b', 'c', 'd', 'b', 'a']})

//   t.equal(w.removeNode('a').nodes).to.eql(['b', 'c', 'd', 'b'])
// })
// })

// test('#asJXON', function (t) {
// it('converts a way to jxon', function (t) {
//   var node = Way({id: 'w-1', nodes: ['n1', 'n2'], tags: {highway: 'residential'}})
//   t.equal(node.asJXON()).to.eql({way: {
//       '@id': '-1',
//       '@version': 0,
//       nd: [{keyAttributes: {ref: '1'}}, {keyAttributes: {ref: '2'}}],
//   tag: [{keyAttributes: {k: 'highway', v: 'residential'}}]}})
// })

// it('includes changeset if provided', function (t) {
//   t.equal(Way().asJXON('1234').way['@changeset']).to.equal('1234')
// })
// })

// test('#asGeoJSON', function (t) {
// it('converts a line to a GeoJSON LineString geometry', function (t) {
//   var a = Node({loc: [1, 2]}),
//     b = Node({loc: [3, 4]}),
//     w = Way({tags: {highway: 'residential'}, nodes: [a.id, b.id]}),
//     graph = Graph([a, b, w]),
//     json = w.asGeoJSON(graph)

//   t.equal(json.type).to.equal('LineString')
//   t.equal(json.coordinates).to.eql([a.loc, b.loc])
// })

// it('converts an area to a GeoJSON Polygon geometry', function (t) {
//   var a = Node({loc: [1, 2]}),
//     b = Node({loc: [5, 6]}),
//     c = Node({loc: [3, 4]}),
//     w = Way({tags: {area: 'yes'}, nodes: [a.id, b.id, c.id, a.id]}),
//     graph = Graph([a, b, c, w]),
//     json = w.asGeoJSON(graph, true)

//   t.equal(json.type).to.equal('Polygon')
//   t.equal(json.coordinates).to.eql([[a.loc, b.loc, c.loc, a.loc]])
// })

// it('converts an unclosed area to a GeoJSON LineString geometry', function (t) {
//   var a = Node({loc: [1, 2]}),
//     b = Node({loc: [5, 6]}),
//     c = Node({loc: [3, 4]}),
//     w = Way({tags: {area: 'yes'}, nodes: [a.id, b.id, c.id]}),
//     graph = Graph([a, b, c, w]),
//     json = w.asGeoJSON(graph, true)

//   t.equal(json.type).to.equal('LineString')
//   t.equal(json.coordinates).to.eql([a.loc, b.loc, c.loc])
// })
// })

// test('#area', function (t) {
// it('returns a relative measure of area', function (t) {
//   var graph = Graph([
//     Node({id: 'a', loc: [-0.0002, 0.0001]}),
//     Node({id: 'b', loc: [ 0.0002, 0.0001]}),
//     Node({id: 'c', loc: [ 0.0002, -0.0001]}),
//     Node({id: 'd', loc: [-0.0002, -0.0001]}),
//     Node({id: 'e', loc: [-0.0004, 0.0002]}),
//     Node({id: 'f', loc: [ 0.0004, 0.0002]}),
//     Node({id: 'g', loc: [ 0.0004, -0.0002]}),
//     Node({id: 'h', loc: [-0.0004, -0.0002]}),
//     Way({id: 's', tags: {area: 'yes'}, nodes: ['a', 'b', 'c', 'd', 'a']}),
//     Way({id: 'l', tags: {area: 'yes'}, nodes: ['e', 'f', 'g', 'h', 'e']})
//   ])

//   var s = Math.abs(graph.entity('s').area(graph)),
//     l = Math.abs(graph.entity('l').area(graph))

//   t.equal(s).to.be.lt(l)
// })

// it('treats unclosed areas as if they were closed', function (t) {
//   var graph = Graph([
//     Node({id: 'a', loc: [-0.0002, 0.0001]}),
//     Node({id: 'b', loc: [ 0.0002, 0.0001]}),
//     Node({id: 'c', loc: [ 0.0002, -0.0001]}),
//     Node({id: 'd', loc: [-0.0002, -0.0001]}),
//     Way({id: 's', tags: {area: 'yes'}, nodes: ['a', 'b', 'c', 'd', 'a']}),
//     Way({id: 'l', tags: {area: 'yes'}, nodes: ['a', 'b', 'c', 'd']})
//   ])

//   var s = graph.entity('s').area(graph),
//     l = graph.entity('l').area(graph)

//   t.equal(s).to.equal(l)
// })

// it('returns 0 for degenerate areas', function (t) {
//   var graph = Graph([
//     Node({id: 'a', loc: [-0.0002, 0.0001]}),
//     Node({id: 'b', loc: [ 0.0002, 0.0001]}),
//     Way({id: '0', tags: {area: 'yes'}, nodes: []}),
//     Way({id: '1', tags: {area: 'yes'}, nodes: ['a']}),
//     Way({id: '2', tags: {area: 'yes'}, nodes: ['a', 'b']})
//   ])

//   t.equal(graph.entity('0').area(graph)).to.equal(0)
//   t.equal(graph.entity('1').area(graph)).to.equal(0)
//   t.equal(graph.entity('2').area(graph)).to.equal(0)
// })
// })
// })
