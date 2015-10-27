import addEntity from '../helpers/add_entity'
import { Observation } from '../../core'

/**
 * Creates a new observation with given defaults
 * @param  {Object} [defaults]
 * @return {function} Accepts a Graph and returns new Graph with observation added
 */
export default function (defaults) {
  return function (graph) {
    return addEntity(Observation(defaults))(graph)
  }
}
