import { Node, Way, Observation } from '../../core'

const validTypes = [Node, Way, Observation]

/**
 * Adds an entity to the graph
 * @param  {Node|Way|Observation} entity Entity to add to graph
 * @return {function} Accepts a Graph and returns new Graph with entity added
 */
export default function AddEntity (entity) {
  return function (graph) {
    if (validTypes.filter(x => entity instanceof x) === []) {
      throw new Error('entity must be a Node, Way or Observation')
    }
    return graph.replace(entity)
  }
}
