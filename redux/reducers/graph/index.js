import { Graph } from '../../core'
import observationCreate from './observation_create'
import observationDelete from './observation_delete'
import observationSetLink from './observation_set_link'
import updateDetails from './update_details'
import actionTypes from './constants'

/**
 * This is a reducer that acts on the Graph where all our core data
 * (places, events, observations) are stored. Based on the action.type
 * it calls the relevant action handler if it exists.
 * @param  {Graph} state A Graph object
 * @param  {Object} action Should have `type` and `payload` properties
 * @return {Graph} A new Graph object with actions applied
 */
export default function graph (state = Graph(), {actionType, payload} = {}) {
  switch (actionType) {
    case actionTypes.OBSERVATION_CREATE:
      return observationCreate(payload)(state)

    case actionTypes.OBSERVATION_DELETE:
      return observationDelete(payload)(state)

    case actionTypes.OBSERVATION_SET_LINK:
      return observationSetLink(payload)(state)

    case actionTypes.OBSERVATION_UPDATE_DETAILS:
      return updateDetails(payload)(state)

    default:
      return state
  }
}
