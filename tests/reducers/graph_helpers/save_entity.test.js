import test from 'prova'
import saveEntity from '../../../src/reducers/graph_helpers/save_entity'
import { Graph, Observation } from '../../../src/core'

test('Save new Observation', function (t) {
  const graph = Graph()
  const attrs = {
    id: 'new',
    gps: { loc: [1, 2] },
    details: { category: 'contamination' },
    kind: 'observation'
  }
  const newGraph = saveEntity(attrs)(graph)
  const newEntityId = Object.keys(newGraph.entities)[0]
  const newObservation = newGraph.entities[newEntityId]
  const expectedTags = Object.assign({}, attrs.details, {'reporter:kind': attrs.kind})
  // 'survey:date' is automatically added to the tags with the current date.
  // It's hard to test with the other tags, so we'll test it separately.
  const newObservationTagsNoDate = Object.assign({}, newObservation.tags)
  delete newObservationTagsNoDate['survey:date']

  t.true(newObservation instanceof Observation, 'Adds a new entity, instance of Observation, to Graph')
  t.equal(newObservation.loc, attrs.gps.loc, 'New Observation has assigned location')
  t.deepEqual(newObservationTagsNoDate, expectedTags, 'Details are added as tags, kind tag is prefixed')
  t.end()
})

test('Save new Observation with GPS and media metadata', function (t) {
  const graph = Graph()
  const attrs = {
    id: 'new',
    gps: {
      loc: [1, 2],
      hdop: 5.6,
      source: 'Internal GPS'
    },
    media: {
      id: 'SomeUniqueId',
      type: 'image',
      caption: 'A Caption',
      cameraModel: 'Canon A10'
    },
    kind: 'observation'
  }
  const newGraph = saveEntity(attrs)(graph)
  const newEntityId = Object.keys(newGraph.entities)[0]
  const newObservation = newGraph.entities[newEntityId]
  const expectedTags = Object.assign({}, attrs.details, {
    'reporter:kind': attrs.kind,
    'gps:hdop': attrs.gps.hdop,
    'gps:source': attrs.gps.source,
    'image:uri': attrs.media.id,
    'image:caption': attrs.media.caption,
    'image:cameraModel': attrs.media.cameraModel
  })
  // 'survey:date' is automatically added to the tags with the current date.
  // It's hard to test with the other tags, so we'll test it separately.
  const newObservationTagsNoDate = Object.assign({}, newObservation.tags)
  delete newObservationTagsNoDate['survey:date']

  t.deepEqual(newObservationTagsNoDate, expectedTags, 'Expected metadata tags are prefixed and added')
  t.end()
})
