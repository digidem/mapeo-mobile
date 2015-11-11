import invariant from 'invariant'
import AddEntity from './add_entity'
import UpdateEntity from './update_entity'
import { Observation, Node } from '../../core'
import { isValidLocation } from '../../util/geo'
import { prefixTags } from '../../util/utils'

// We use some custom tags specific to this application (currently only
// kind = Observation || Place || Event). We use this namespace prefix.
const TAG_NAMESPACE = 'reporter:'
const VALID_KINDS = ['observation', 'event', 'place']

/**
 * Creates a new entity or updates an existing entity.
 * @param {String} options.id        Entity id ('new' if a new Entity)
 * @param {Object} [options.gps]     GPS metadata
 * @param {Array}  options.gps.loc   GPS coordinates [lon, lat] (required if `options.gps`)
 * @param {Object} [options.link]    node, way or event entity is linked to
 * @param {String} options.link.id   id linked entity (required if `options.link`)
 * @param {Object} [options.details] Object of key-value pairs, maps to OSM tags
 * @param {Object} [options.media]   Details of any attached media
 * @param {String} options.media.id  Unique identifier for media file (required if `options.media`)
 * @param {String} options.media.type One of `photo`, `video`, `audio` (required if `options.media`)
 * @param {String} options.kind      One of `observation`, `event`, `place`
 * @return {function} Accepts a Graph and returns new Graph with entity added/updated
 */
export default function EntitySave ({
  id,
  gps,
  link,
  details,
  media,
  kind
} = {}) {
  invariant(!!id, 'Missing id')
  invariant(!gps || isValidLocation(gps.loc), 'Invalid location [%s]', gps.loc.toString())
  invariant(!link || kind !== 'observation', 'Attempting to set link on non-observation')
  invariant(!link || link.id, 'Link missing id')
  invariant(!media || media.id, 'Missing media id')
  invariant(!media || media.type, 'Missing media type')
  const isValidKind = VALID_KINDS.indexOf(kind) > -1
  invariant(isValidKind, '%s is not a valid kind of entity', kind)

  // TODO: need to define a URI format for media ids - we are using a hash
  // for any media, so filenames will be unique. The URI should point to
  // a persistant store, that works online or offline.
  const mediaTags = prefixTags(media, {prefix: media.type, blacklist: ['id', 'type']})
  mediaTags[media.type + ':uri'] = media.id
  const gpsTags = prefixTags(gps, {prefix: 'gps', blacklist: ['loc']})

  const attrs = {
    link,
    loc: gps.loc,
    tags: Object.assign({}, mediaTags, gpsTags, details)
  }

  if (id !== 'new') {
    return UpdateEntity(id, attrs)
  }

  attrs.tags[TAG_NAMESPACE + 'kind'] = kind

  // New events and places are always Nodes - we don't have functionality to create
  // new Ways at this time.
  let entity
  if (kind === 'observation') {
    entity = Observation(attrs)
  } else {
    entity = Node(attrs)
  }

  return AddEntity(entity)
}
