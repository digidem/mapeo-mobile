
/**
 * Deletes an observation
 * @param {string} observationId Id of observation to be deleted
 */
export default function ObservationDelete (observationId) {
  return function (graph) {
    const entity = graph.entity(observationId)
    if (entity.type !== 'observation') {
      console.log('tried to delete non-observation with observation_delete')
      return graph
    }
    return graph.remove(entity)
  }
}
