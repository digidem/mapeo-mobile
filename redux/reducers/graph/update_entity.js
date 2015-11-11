import invariant from 'invariant'
/**
 * Updates the attributes of an entity. DO NOT USE directly, instead use
 * `observationSave`, `eventSave`, or `placeSave` which do type checking on
 * which attrs keys are allowed.
 * @param {String} entityId id of Entity to update
 * @param {Object} attrs    Hash of values to update
 * @return {function} Accepts a Graph and returns new Graph with entity updated
 */
export default function UpdateEntity (entityId, attrs) {
  return function (graph) {
    const entity = graph.entity(entityId)
    invariant(!!entity, 'entity id:%s not found', entityId)
    if (entity.type === 'way' && attrs.loc) {
      console.warn('Cannot set location on way')
      delete attrs.loc
    }
    return graph.replace(entity.update(attrs))
  }
}
