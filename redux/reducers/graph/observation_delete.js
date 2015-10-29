/**
 * Deletes an observation
 * @param {string} observationId Id of observation to be deleted
 */
export default function ObservationDelete (observationId) {
  return function (graph) {
    const entity = graph.entity(observationId)
    if (!entity || entity.type !== 'observation') {
      throw new Error('observation id:%s not found', observationId)
    }
    return graph.remove(entity)
  }
}
