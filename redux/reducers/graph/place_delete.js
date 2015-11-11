import invariant from 'invariant'

/**
 * Deletes a place
 * @param {string} placeId Id of place to be deleted
 * @return {function} Accepts a Graph and returns new Graph with place deleted
 */
export default function PlaceDelete (placeId) {
  return function (graph) {
    const entity = graph.entity(placeId)
    invariant(!!entity, 'Place id:%s not found', placeId)
    const isPlace = entity.type === 'node' || entity.type === 'way'
    invariant(isPlace, 'Entity id:%s is not a place', placeId)
    return graph.remove(entity)
  }
}
