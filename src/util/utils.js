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

export const geolocation = (function () {
  if (!global.navigator || !('geolocation' in global.navigator)) {
    return
  }
  return global.navigator.geolocation
})()

/**
 * Parse a style object for `translateX`, `translateY`, `translateZ` and `scale` and
 * built a CSS transform string.
 * @param  {Object} style         Style object
 * @param  {String} options.units Units, defaults to `%`, could be `px`
 * @return {Object}               New style object with translate/scale properties combined as `transform`
 */
export const parseTransformStyle = (style, {units = '%'} = {}) => {
  let {translateX = 0, translateY = 0, translateZ = 0, scale = 1, ...nonTransformStyles} = style
  let [x, y, z] = [translateX, translateY, translateZ].map(v => v.toFixed(1))
  return {
    ...nonTransformStyles,
    transform: `translate3d(${x}${units},${y}${units},${z}px) scale(${scale.toFixed(4)})`
  }
}
