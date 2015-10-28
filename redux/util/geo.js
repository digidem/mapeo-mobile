export function isValidLocation (location) {
  if (!(location instanceof Array)) return false
  if (location.length !== 2) return false
  if (location[0] < -180 || location[0] > 180) return false
  if (location[1] < -90 || location[1] > 90) return false
  return true
}
