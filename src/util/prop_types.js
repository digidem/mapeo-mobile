import { PropTypes } from 'react'

export default {
  stringOrNumber: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  stringOrObject: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ])
}
