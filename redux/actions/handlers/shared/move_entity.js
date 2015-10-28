/**
 * Moves a entity (observation and point place or event) to a new location,
 * or sets the location. Set `loc` to null or undefined to remove a location
 * https://github.com/openstreetmap/josm/blob/mirror/src/org/openstreetmap/josm/command/MoveCommand.java
 * https://github.com/openstreetmap/potlatch2/blob/master/net/systemeD/halcyon/connection/actions/MoveNodeAction.as
 *
 * @param {string} options.entityId Entity Id
 * @param {Array} options.loc Location as an array `[longitude, latitude]`
 */
export default function MoveEntity ({ entityId, loc }) {
  if (!(loc instanceof Array) || loc.length !== 2) {
    loc = []
  }
  return function (graph) {
    return graph.replace(graph.entity(entityId).move(loc))
  }
}
