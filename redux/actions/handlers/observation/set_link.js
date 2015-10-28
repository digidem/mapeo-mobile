/**
 * Links an observation to an event or place.
 * @param {string} options.entityId Id of the observation to be linked
 * @param {Object} options.linkId Id of the entity to be linked
 */
export default function ObservationSetLink ({ entityId, linkId }) {
  return function (graph) {
    const entity = graph.entity(entityId)
    if (!entity || entity.type !== 'observation') {
      throw new Error('observation id:%s not found', entityId)
    }
    const linkedEntity = graph.entity(linkId)
    if (!linkedEntity) {
      throw new Error('linked entity id:%s not found', linkId)
    }
    if (linkedEntity.type === 'observation') {
      throw new Error('cannot link an observation to another observation')
    }
    return graph.replace(entity.setLink({ id: linkId, type: linkedEntity.type }))
  }
}
