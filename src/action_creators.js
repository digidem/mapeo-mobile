import camelCase from 'camelcase'
import invariant from 'invariant'
import actionTypes from './constants'

/**
 * Makes a FSA action creator for a given type.
 * (exported for tests)
 * @param  {string} type Constant for action type
 * @return {function} A function which accepts a payload (can be anything) and
 *   returns an object (action) with properties `type`, `payload` and error.
 *   If `error` is `true` then payload should be an instance of `Error`
 */
export function makeActionCreator (type) {
  return function actionCreator (payload, error = false) {
    invariant(!error || (payload instanceof Error), '`error` was true but payload (%s) was not an error', payload)
    invariant(!(payload instanceof Error) || error, 'payload (%s) was an error, but error was false', payload)
    return {
      type,
      payload,
      error
    }
  }
}

const actionCreators = {}

// For each action type make an action creator
// e.g. for OBSERVATION_CREATE will create a function observationCreate(payload)
// which will return an action { type: 'OBSERVATION_CREATE', payload: payload }
Object.keys(actionTypes).map(actionType => {
  actionCreators[camelCase(actionType)] = makeActionCreator(actionType)
})

export default actionCreators
