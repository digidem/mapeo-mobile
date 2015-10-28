import { isValidLocation } from '../../../util/geo'

/**
 * Moves a entity (observation and point place or event) to a new location,
 * or sets the location. Set `loc` to null or undefined to remove a location
 * https://github.com/openstreetmap/josm/blob/mirror/src/org/openstreetmap/josm/command/MoveCommand.java
 * https://github.com/openstreetmap/potlatch2/blob/master/net/systemeD/halcyon/connection/actions/MoveNodeAction.as
 *
 * @param {string} options.entityId Entity Id
 * @param {Array} options.loc Location as an array `[longitude, latitude]`
 */
export default function MoveEntity ({ entityId, loc: [lon, lat] = [] } = {}) {
  return function (graph) {
    const entity = graph.entity(entityId)
    if (!entity) {
      throw new Error('entity id:%s not found', entityId)
    }
    const newLocation = [lon, lat]
    if (!isValidLocation(newLocation)) {
      throw new Error('invalid location: %s', newLocation)
    }
    return graph.replace(entity.move(newLocation))
  }
}
