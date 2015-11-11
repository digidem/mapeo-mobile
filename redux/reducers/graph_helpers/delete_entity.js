import invariant from 'invariant'
import deleteNode from './delete_node'
import deleteWay from './delete_way'

/**
 * Deletes an entity
 * @param {string} entityId  Id of entity to be deleted
 * @return {function}        Accepts a Graph and returns new Graph with entity deleted
 */
export default function EntityDelete (entityId) {
  invariant(!!entityId, 'entityId undefined')
  return function (graph) {
    const entity = graph.entity(entityId)
    invariant(!!entity, 'Entity id:%s not found', entityId)

    // If we're deleting a node or way we need to clean up any ways the node is part of,
    // or update the parentRelations on any node that is part of a deleted way.
    if (entity.type === 'node') {
      return deleteNode(entity)(graph)
    } else if (entity.type === 'way') {
      return deleteWay(entity)(graph)
    } else if (entity.type === 'observation') {
      return graph.remove(entity)
    } else {
      throw new Error('Unkown entity type')
    }
  }
}
