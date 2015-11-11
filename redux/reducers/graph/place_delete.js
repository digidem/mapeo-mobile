import invariant from 'invariant'
import deleteNode from './delete_node'
import deleteWay from './delete_way'

/**
 * Deletes a place
 * @param {string} placeId Id of place to be deleted
 * @return {function} Accepts a Graph and returns new Graph with place deleted
 */
export default function PlaceDelete (placeId) {
  return function (graph) {
    const entity = graph.entity(placeId)
    invariant(!!entity, 'Place id:%s not found', placeId)

    if (entity.type === 'node') {
      return deleteNode(entity)
    } else if (entity.type === 'way') {
      return deleteWay(entity)
    } else {
      invariant(false, 'Entity id:%s is not a place', placeId)
    }
  }
}
