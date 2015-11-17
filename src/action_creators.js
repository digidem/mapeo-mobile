import camelCase from 'camelcase'
import actionTypes from './constants'

/**
 * Makes a FSA action creator for a given type
 * @param  {string} type Constant for action type
 * @return {function} A function which accepts a payload (can be anything)
 * and returns an object (action) with properties `type` and `payload`.
 */
function makeActionCreator (type) {
  return function (payload, error = false) {
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
