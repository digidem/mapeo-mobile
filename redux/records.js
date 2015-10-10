import { Record, Map } from 'immutable'

/**
 * Observations, places and events are defined as OSM nodes, ways and relations
 * These are the common properties to all OSM Elements, an extension of standard
 * OSM data types for a distributed data model.
 *
 * @property {number} id        OSM id, `undefined` in a decentralized DB.
 * @property {number} uid       OSM user id, `undefined` in a decentralized DB.
 * @property {string} user      OSM user name, `undefined` in a decentralized DB.
 * @property {number} version   OSM version number, `undefined` in a decentralized DB.
 * @property {number} lat       Latitude, 7 decimal places
 * @property {number} lon       Longitude, 7 decimal places
 * @property {string} timestamp ISO 8601 timestamp - can't be guaranteed but needed for OSM
 * @property {string} vclock    Vector clock hash - used to calculate order without time
 * @property {string} uuid      Element uuid
 * @property {string} user_uuid Globally unique user uuid - may or may not map to OSM uid
 * @property {string} hash      Hash of current version
 * @property {string} prev      Previous version hash
 * @property {object} tags      Map of key-value pairs
 * @property {array}  relations Array of relation `uuid`s this is a member of
 * @property {array}  ways      Array of way `uuid`s
 */
const OsmElement = Record({
  id: undefined,
  uid: undefined,
  user: undefined,
  version: undefined,
  lat: undefined,
  lon: undefined,
  timestamp: undefined,
  vclock: undefined,
  uuid: undefined,
  user_uuid: undefined,
  hash: undefined,
  prev: undefined,
  tags: Record({}),
  relations: [],
  ways: []
})

