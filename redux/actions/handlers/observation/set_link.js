import Noop from '../shared/noop'

/**
 * Links an observation to an event or place.
 * @param {string} options.entityId Id of the observation to be linked
 * @param {Object} options.linkId Id of the entity to be linked
 */
export default function ObservationSetLink ({ entityId, linkId }) {
  if (!linkId) {
    console.log('missing link id')
    return Noop()
  }
  return function (graph) {
    const entity = graph.entity(entityId)
    if (entity.type !== 'observation') {
      console.log('setLink only works on observations')
      return graph
    }
    const linkedEntity = graph.entity(linkId)
    if (!linkedEntity) {
      console.log('linked entity Id not found on graph')
      return graph
    }
    return graph.replace(entity.setLink({ id: linkId, type: linkedEntity.type }))
  }
}
