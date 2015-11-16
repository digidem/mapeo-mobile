import invariant from 'invariant'
import { Graph, Observation } from '../core'
import actionTypes from '../constants'
import saveEntity from './graph_helpers/save_entity'
import deleteEntity from './graph_helpers/delete_entity'
import fixtureObservations from '../../fixtures/observations'

const defaultState = Graph(fixtureObservations.map(attrs => Observation(attrs)))

/**
 * This is a reducer that acts on the Graph where all our core data
 * (places, events, observations) are stored. Based on the action.type
 * it calls the relevant action helper if it exists.
 * @param  {Graph} state A Graph object
 * @param  {String} options.type Action identifier
 * @param  {Object} options.payload    Payload for action
 * @return {Graph} A new Graph object with actions applied
 */
export default function graph (state = defaultState, {type, payload = {}} = {}) {
  invariant(state instanceof Graph, 'State should be instance of Graph')

  let attrs
  switch (type) {
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
