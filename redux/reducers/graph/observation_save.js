import invariant from 'invariant'
import AddEntity from './add_entity'
import UpdateEntity from './update_entity'
import { Observation } from '../../core'
import { isValidLocation } from '../../util/geo'
import { prefixTags } from '../../util/utils'

/**
 * Creates a new observation or updates an existing observation.
 * @param {String} options.id        Entity id ('new' if a new Entity)
 * @param {Object} [options.gps]     GPS metadata
 * @param {Array}  options.gps.loc   GPS coordinates [lon, lat] (required if `options.gps`)
 * @param {Object} [options.link]    node, way or event observation is linked to
 * @param {String} options.link.id   id linked entity (required if `options.link`)
 * @param {Object} [options.details] Object of key-value pairs, maps to OSM tags
 * @param {Object} [options.media]   Details of any attached media
 * @param {String} options.media.id  Unique identifier for media file (required if `options.media`)
 * @param {String} options.media.type One of `photo`, `video`, `audio` (required if `options.media`)
 * @return {function} Accepts a Graph and returns new Graph with observation added/updated
 */
export default function ObservationSave ({
  id,
  gps,
  link,
  details,
  media
} = {}) {
  invariant(!!id, 'Missing id')
  invariant(!gps || isValidLocation(gps.loc), 'Invalid location [%s]', gps.loc.toString())
  invariant(!link || link.id, 'Link missing id')
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
    return AddEntity(Observation({
      id,
      link,
      loc: gps.loc,
      tags: mergedTags
    }))
  } else {
    return UpdateEntity(id, {
      link,
      loc: gps.loc,
      tags: mergedTags
    })
  }
}
