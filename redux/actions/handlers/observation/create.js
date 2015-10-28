import AddEntity from '../shared/add_entity'
import { Observation } from '../../../core'
import { isValidLocation } from '../../../util/geo'

/**
 * Creates a new observation with given [optional] defaults
 * @param  {Object} [defaults]
 * @return {function} Accepts a Graph and returns new Graph with observation added
 */
export default function ObservationCreate ({
  loc: [lon, lat] = [],
  link: {id, type} = {},
  tags = {}
} = {}) {
  let loc = [lon, lat]
  if (!isValidLocation(loc)) {
    if (typeof lon === 'undefined' && typeof lat === 'undefined') {
      loc = []
    } else {
      throw new Error('invalid location: %s', loc)
    }
  }
  let link = {id, type}
  if (!link.id) {
    link = null
  }
  return AddEntity(Observation({loc, link, tags}))
}
