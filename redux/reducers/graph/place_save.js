import invariant from 'invariant'
import AddEntity from './add_entity'
import UpdateEntity from './update_entity'
import { Node } from '../../core'
import { isValidLocation } from '../../util/geo'
import { prefixTags } from '../../util/utils'

/**
 * Creates a new place (node) or updates an existing place (node or way).
 * At this time the app will not allow the creation of new ways, or allow
 * modifying the geometry (vertices) or a way, only the tags.
 * @param {String} options.id        Entity id ('new' if a new Entity)
 * @param {Object} [options.gps]     GPS metadata (only for nodes)
 * @param {Array}  options.gps.loc   GPS coordinates [lon, lat] (required if `options.gps`)
 * @param {Object} [options.details] Object of key-value pairs, maps to OSM tags
 * @param {Object} [options.media]   Details of any attached media
 * @param {String} options.media.id  Unique identifier for media file (required if `options.media`)
 * @param {String} options.media.type One of `photo`, `video`, `audio` (required if `options.media`)
 * @return {function} Accepts a Graph and returns new Graph with place added/updated
 */
export default function PlaceSave ({
  id,
  gps,
  details,
  media
} = {}) {
  invariant(!!id, 'Missing id')
  invariant(!gps || isValidLocation(gps.loc), 'Invalid location [%s]', gps.loc.toString())
  invariant(!media || media.id, 'Missing media id')
  invariant(!media || media.type, 'Missing media type')

  // TODO: need to define a URI format for media ids - we are using a hash
  // for any media, so filenames will be unique. The URI should point to
  // a persistant store, that works online or offline.
  const mediaTags = prefixTags(media, media.type, ['id', 'type'])
  mediaTags[media.type + ':uri'] = media.id
  const gpsTags = prefixTags(gps, 'gps', ['loc'])
  const mergedTags = Object.assign({}, mediaTags, gpsTags, details)

  if (id === 'new') {
    return AddEntity(Node({
      id,
      loc: gps.loc,
      tags: mergedTags
    }))
  } else {
    return UpdateEntity(id, {
      loc: gps.loc,
      tags: mergedTags
    })
  }
}
