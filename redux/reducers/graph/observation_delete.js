import invariant from 'invariant'

/**
 * Deletes an observation
 * @param {string} observationId Id of observation to be deleted
 * @return {function} Accepts a Graph and returns new Graph with observation deleted
 */
export default function ObservationDelete (observationId) {
  return function (graph) {
    const entity = graph.entity(observationId)
    invariant(!!entity, 'Observation id:%s not found', observationId)
    invariant(entity.type === 'observation', 'Entity id:%s is not an observation', observationId)
    return graph.remove(entity)
  }
}
