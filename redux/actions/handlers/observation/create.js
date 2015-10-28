import AddEntity from '../shared/add_entity'
import { Observation } from '../../../core'

/**
 * Creates a new observation with given [optional] defaults
 * @param  {Object} [defaults]
 * @return {function} Accepts a Graph and returns new Graph with observation added
 */
export default function ObservationCreate (defaults) {
  return AddEntity(Observation(defaults))
}
