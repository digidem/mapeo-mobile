import invariant from 'invariant'

/**
 * Takes an object of key-value pairs returns a new object with each key
 * prefixed with `prefix + ':'`, excluding any keys in `blacklist`.
 * We do this so that gps and media may have any number of additional
 * metadata fields, such as HDOP, or a media caption.
 * @param  {Object} o                 Object of key-value pairs
 * @param  {String} options.prefix    Prefix to append to each key
 * @param  {Array}  options.blacklist Array of keys names to exclude from returned object
 * @return {Object}           New object with prefixed keys
 */
export const prefixTags = function prefixTags (o, { prefix, blacklist = [] }) {
  invariant(!!prefix, 'Missing prefix')
  return Object.keys(o).reduce((prev, key) => {
    if (blacklist.indexOf(key) > -1) {
      return prev
    }
    prev[prefix + ':' + key] = o[key]
    return prev
  }, {})
}
