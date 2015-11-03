import test from 'tape'
import { Entity, Node, Way, Observation, Graph } from '../redux/core'

test('returns a subclass of the appropriate type', function (t) {
  t.ok(Entity({type: 'node'}) instanceof Node)
  t.ok(Entity({type: 'way'}) instanceof Way)
  t.ok(Entity({type: 'observation'}) instanceof Observation)
  // t.ok(Entity({type: 'relation'})).be.an.instanceOf(iD.Relation)
  t.ok(Entity({id: 'n1'}) instanceof Node)
  t.ok(Entity({id: 'w1'}) instanceof Way)
  t.ok(Entity({id: 'o1'}) instanceof Observation)
  // t.ok(Entity({id: 'r1'})).be.an.instanceOf(iD.Relation)
  t.end()
})

// if (iD.debug) {
//   it('is frozen', function (t) {
//     t(Object.isFrozen(Entity())).to.be.true
//   })

//   it('freezes tags', function (t) {
//     t(Object.isFrozen(Entity().tags)).to.be.true
//   })
// }

test('static methods', function (t) {
  t.notEqual(Entity.id('node'), Entity.id('node'), '.id generates unique IDs')
  t.equal(Entity.id.fromOSM('node', '1'), 'n1', '.fromOSM returns a ID string unique across entity types')
  t.equal(Entity.id.toOSM(Entity.id.fromOSM('node', '1')), '1', '.toOSM reverses fromOSM')
  t.end()
})

test('#copy returns a new Entity', function (t) {
  var a = Entity()
  var result = a.copy()

  t.ok(result.length === 1)
  t.ok(result[0] instanceof Entity)
  t.notEqual(a, result[0])
  t.end()
})

test("#copy resets 'id', 'user', and 'version' properties", function (t) {
  var a = Entity({id: 'n1234', version: 10, user: 'bot-mode'})
  var b = a.copy()[0]

  t.ok(b.isNew())
  t.ok(typeof b.version === 'undefined')
  t.ok(typeof b.user === 'undefined')
  t.end()
})

test('#copy copies tags', function (t) {
  var a = Entity({id: 'n1234', version: 10, user: 'test', tags: {foo: 'foo'}})
  var b = a.copy()[0]
  t.deepEqual(b.tags, a.tags)
  t.end()
})

test('#update', function (t) {
  var a = Entity()
  var b = a.update({})
  var tags = {foo: 'bar'}
  var attrs = {tags: {foo: 'bar'}}

  t.ok(b instanceof Entity, 'returns instance of Entity')
  t.notEqual(a, b, 'returns a new Entity')
  t.equal(Entity().update({tags: tags}).tags, tags, 'updates the specified attributes')
  t.equal(Entity({id: 'w1'}).update({}).id, 'w1', 'preserves existing attributes')

  Entity().update(attrs)
  t.deepEqual(attrs, {tags: {foo: 'bar'}}, "doesn't modify the input")
  t.ok(!Entity().update({}).hasOwnProperty('update'), "doesn't copy prototype properties")
  t.equal(Entity().update({}).v, 1, 'sets v to 1 if previously undefined')
  t.equal(Entity({v: 1}).update({}).v, 2, 'increments v')
  t.end()
})

test('#mergeTags', function (t) {
  var a = Entity({tags: {a: 'a'}})
  var b = a.mergeTags({a: 'a'})
  var c = a.mergeTags({a: 'b'})
  var d = a.mergeTags({b: 'b'})
  var e = Entity({tags: {a: 'a;b'}})
  var f = Entity({tags: {a: 'a; b'}})
  var g = Entity({tags: {a: 'b'}})

  t.equal(a, b, 'returns self if unchanged')
  t.ok(b instanceof Entity)
  t.notEqual(a, c, 'returns a new Entity if changed')
  t.deepEqual(d.tags, {a: 'a', b: 'b'}, 'merges tags')
  t.deepEqual(b.tags, {a: 'a'}, 'combines non-conflicting tags')
  t.deepEqual(c.tags, {a: 'a;b'}, 'combines conflicting tags with semicolons')
  t.deepEqual(e.mergeTags(g.tags).tags, {a: 'a;b'}, 'combines combined tags')
  t.deepEqual(g.mergeTags(e.tags).tags, {a: 'b;a'}, 'combines combined tags')
  t.deepEqual(f.mergeTags(g.tags).tags, {a: 'a;b'}, 'combines combined tags with whitespace')
  t.deepEqual(g.mergeTags(f.tags).tags, {a: 'b;a'}, 'combines combined tags with whitespace')
  t.end()
})

test('#osmId', function (t) {
  t.equal(Entity({id: 'w1234'}).osmId(), '1234', 'way returns an OSM ID as a string')
  t.equal(Entity({id: 'n1234'}).osmId(), '1234', 'node returns an OSM ID as a string')
  t.equal(Entity({id: 'o1234'}).osmId(), '1234', 'observation returns an OSM ID as a string')
  t.end()
})

test('#intersects', function (t) {
  var node = Node({loc: [0, 0]})
  var way = Way({nodes: [node.id]})
  var graph = Graph([node, way])
  t.true(way.intersects([[-5, -5], [5, 5]], graph), 'returns true for a way with a node within the given extent')

  node = Node({loc: [6, 6]})
  way = Way({nodes: [node.id]})
  graph = Graph([node, way])
  t.false(way.intersects([[-5, -5], [5, 5]], graph), 'returns false for way with no nodes within the given extent')

  t.end()
})

test('#isUsed', function (t) {
  var node = Node()
  var graph = Graph([node])
  t.false(node.isUsed(graph), 'returns false for an entity without tags')

  node = Node({tags: {foo: 'bar'}})
  graph = Graph([node])
  t.true(node.isUsed(graph), 'returns true for an entity with tags')

  node = Node({tags: {area: 'yes'}})
  graph = Graph([node])
  t.false(node.isUsed(graph), 'returns false for an entity with only an area=yes tag')

  node = Node()
  var observation = Observation({nodeId: node.id})
  var little_way = Way({nodes: [node.id]})
  //graph = Graph([node, observation])
  graph = Graph()
  graph.load([node, observation, little_way])
  console.log('=====================')
  console.dir(node)
  console.dir(graph)
  console.log('little_way.isUsed(graph) = ' + little_way.isUsed(graph))
  t.true(node.isUsed(graph), 'returns true for an entity that has an observation')

  t.end()
})

// TODO:
// describe('#hasDeprecatedTags', function (t) {
//   it('returns false if entity has no tags', function (t) {
//     t(Entity().deprecatedTags()).to.eql({})
//   })

//   it('returns true if entity has deprecated tags', function (t) {
//     t(Entity({ tags: { barrier: 'wire_fence' } }).deprecatedTags()).to.eql({ barrier: 'wire_fence' })
//   })
// })

test('#hasInterestingTags', function (t) {
  t.false(Entity().hasInterestingTags(), 'returns false if the entity has no tags')
  t.true(Entity({tags: {foo: 'bar'}}).hasInterestingTags(), "returns true if the entity has tags other than 'attribution', 'created_by', 'source', 'odbl' and tiger tags")
  t.false(Entity({tags: {source: 'Bing'}}).hasInterestingTags(), 'return false if the entity has only uninteresting tags')
  t.false(Entity({tags: {'tiger:source': 'blah', 'tiger:foo': 'bar'}}).hasInterestingTags(), 'return false if the entity has only tiger tags')
  t.end()
})
