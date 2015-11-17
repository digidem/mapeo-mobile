export const isValidLocation = function isValidLocation (location) {
  if (!(location instanceof Array)) return false
  if (location.length !== 2) return false
  if (location[0] < -180 || location[0] > 180) return false
  if (location[1] < -90 || location[1] > 90) return false
  return true
}

/**
 * Compares two coordinates and does a quick rough-and-ready calc if they are
 * "pretty close" - default about 1.11m at the equator, <10cm at 45N/S
 * @param  {array}  coord1 [lon, lat]
 * @param  {array}  coord2 [lon, lat]
 * @param  {number} options.precision The number of decimal places to round decimal
 * coordinates for comparison. For meter equivalents of decimal degrees see
 * https://en.wikipedia.org/wiki/Decimal_degrees
 * @return {Boolean}
 */
export const isPrettyClose = function isPrettyClose (coord1, coord2, { precision = 5 } = {}) {
  return coord1[0].toFixed(precision) === coord2[0].toFixed(precision) &&
    coord1[1].toFixed(precision) === coord2[1].toFixed(precision)
}
