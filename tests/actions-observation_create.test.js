import test from 'tape'
import { Observation, Graph } from '../redux/core'
import { OBSERVATION_CREATE } from '../redux/reducers/graph/observation_create'

// TODO: FIX THIS!

// test('OBSERVATION_CREATE handler', function (t) {
//  var graph = OBSERVATION_CREATE()(Graph())
  // ok now I see the problem... we're not returning the observation.
  // t.equal(graph.entity(entity.id), entity, 'adds an entity to the graph')
// })
