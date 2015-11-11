import invariant from 'invariant'
import { Graph } from '../../core'
import observationSave from './observation_save'
import observationDelete from './observation_delete'
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
  invariant(state instanceof Graph, 'State should be instance of Graph')

  switch (actionType) {
    case actionTypes.OBSERVATION_SAVE:
      return observationSave(payload)(state)

    case actionTypes.OBSERVATION_DELETE:
      return observationDelete(payload)(state)

    default:
      return state
  }
}
