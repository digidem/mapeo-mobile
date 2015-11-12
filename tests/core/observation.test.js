import test from 'tape'
import { Observation } from '../../src/core'

test('instantiation', function (t) {
  t.ok(Observation() instanceof Observation, 'returns instance of Observation')
  t.ok(/o-\d/.test(Observation().id), 'is assigned id')
  t.equal(Observation().type, 'observation', 'returned type is observation')
  t.equal(Observation().link, null, 'default link is null')
  t.deepEqual(Observation({link: {id: 'n'}}).link, {id: 'n'}, 'sets link as specified')
  t.deepEqual(Observation().tags, {}, 'defaults tags to an empty object')
  t.deepEqual(Observation({tags: {foo: 'bar'}}).tags, {foo: 'bar'}, 'sets tags as specified')
  t.end()
})

test('#extent', function (t) {
  t.ok(Observation({loc: [5, 10]}).extent().equals([[5, 10], [5, 10]]), 'returns a point extent')
  t.end()
})

test('#intersects', function (t) {
  t.true(Observation({loc: [0, 0]}).intersects([[-5, -5], [5, 5]]), 'returns true for an observation within the given extent')
  t.false(Observation({loc: [6, 6]}).intersects([[-5, -5], [5, 5]]), 'returns false for an observation outside the given extend')
  t.end()
})

test('#setLink', function (t) {
  var obs = Observation()
  obs.setLink({id: 'n1'})
  t.equal(obs.link, null, 'does not mutate')
  t.deepEqual(Observation().setLink({id: 'n1'}).link, {id: 'n1'}, 'sets link id')

  var obs2 = Observation({link: {id: 'n1'}})
  t.equal(obs2.setLink({id: 'n1'}), obs2, 'is a no-op if link does not change')
  t.notEqual(obs2.setLink({id: 'n1', type: 'node'}), obs2, 'updates if link type changes')
  t.end()
})

test('#removeLink', function (t) {
  var obs = Observation({link: {id: 'n'}})
  t.equal(obs.removeLink().link, null, 'sets link to null')
  t.end()
})

test('#asJXON', function (t) {
  var observation = Observation({id: 'o-1', loc: [-77, 38], link: {id: 'n1', type: 'node'}, tags: {amenity: 'cafe'}})
  t.deepEqual(observation.asJXON(), {
    observation: {
      '@id': '-1',
      '@lon': -77,
      '@lat': 38,
      '@version': 0,
      link: [{keyAttributes: {ref: '1', type: 'node'}}],
      tag: [{keyAttributes: {k: 'amenity', v: 'cafe'}}]
    }
  }, 'converts an observation to jxon')
  t.equal(Observation({loc: [0, 0]}).asJXON('1234').observation['@changeset'], '1234', 'includes changeset if provided')
  t.end()
})

test('#asGeoJSON', function (t) {
  var observation = Observation({tags: {amenity: 'cafe'}, loc: [1, 2]})
  var json = observation.asGeoJSON()

  t.equal(json.type, 'Point', 'converts to a GeoJSON Point geometry')
  t.deepEqual(json.coordinates, [1, 2], 'coordinates are correct')
  t.end()
})
