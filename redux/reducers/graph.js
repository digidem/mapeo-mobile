import { Graph } from '../core'
import handlers from '../handlers'

/**
 * This is a reducer that acts on the Graph where all our core data
 * (places, events, observations) are stored. Based on the action.type
 * it calls the relevant action handler if it exists.
 * @param  {Graph} state A Graph object
 * @param  {Object} action Should have `type` and `payload` properties
 * @return {Graph} A new Graph object with actions applied
 */
export default function graph (state = Graph(), action = {}) {
  if (handlers.hasOwnProperty(action.type)) {
    return handlers[action.type](action.payload)(state)
  } else {
    return state
  }
}
