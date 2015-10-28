/**
 * All action handlers accept a payload and a Graph
 * and return a new Graph, of the form `handler(payload)(graph)`
 */
export default {
  OBSERVATION_CREATE: require('./observation/create'),
  OBSERVATION_DELETE: require('./observation/delete'),
  OBSERVATION_MOVE: require('./shared/move_entity'),
  OBSERVATION_SET_LINK: require('./observation/set_link'),
  OBSERVATION_UPDATE_DETAILS: require('./shared/update_details')
}
