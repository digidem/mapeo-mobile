/**
 * Adds an entity to the graph
 * @param  {Node|Way|Observation} entity Entity to add to graph
 * @return {function} Accepts a Graph and returns new Graph with entity added
 */
export default function AddEntity (entity) {
  return function (graph) {
    return graph.replace(entity)
  }
}
