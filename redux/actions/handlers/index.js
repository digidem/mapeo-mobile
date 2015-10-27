/**
 * All action handlers accept a payload and a Graph
 * and return a new Graph, of the form `handler(payload)(graph)`
 */
export default {
  OBSERVATION_CREATE: require('./observation_create')
}
