import invariant from 'invariant'
import { Graph } from '../core'
import actionTypes from '../constants'
import saveEntity from './graph_helpers/save_entity'
import deleteEntity from './graph_helpers/delete_entity'

/**
 * This is a reducer that acts on the Graph where all our core data
 * (places, events, observations) are stored. Based on the action.type
 * it calls the relevant action handler if it exists.
 * @param  {Graph} state A Graph object
 * @param  {String} options.actionType Action identifier
 * @param  {Object} options.payload    Payload for action
 * @return {Graph} A new Graph object with actions applied
 */
export default function graph (state = Graph(), {actionType, payload = {}} = {}) {
  invariant(state instanceof Graph, 'State should be instance of Graph')

  let attrs
  switch (actionType) {
    case actionTypes.OBSERVATION_SAVE:
      attrs = Object.assign({}, payload, {kind: 'observation'})
      return saveEntity(attrs)(state)

    case actionTypes.OBSERVATION_DELETE:
      return deleteEntity(payload.id)(state)

    case actionTypes.EVENT_SAVE:
      attrs = Object.assign({}, payload, {kind: 'event'})
      return saveEntity(attrs)(state)

    case actionTypes.EVENT_DELETE:
      return deleteEntity(payload.id)(state)

    case actionTypes.PLACE_SAVE:
      attrs = Object.assign({}, payload, {kind: 'place'})
      return saveEntity(attrs)(state)

    case actionTypes.PLACE_DELETE:
      return deleteEntity(payload.id)(state)

    default:
      return state
  }
}
