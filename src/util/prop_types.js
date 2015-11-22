import { PropTypes } from 'react'

export default {
  stringOrNumber: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  stringOrObject: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  location: PropTypes.shape({
    coords: PropTypes.arrayOf(PropTypes.number),
    meta: PropTypes.object,
    positionError: PropTypes.instanceOf(Error),
    timestamp: PropTypes.number
  })
}
