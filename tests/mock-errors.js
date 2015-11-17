module.exports = function PositionError (message) {
  Error.captureStackTrace(this, this.constructor)
  this.name = this.constructor.name
  this.message = message || 'Mock Position Error'
  this.stack = (new Error()).stack
  this.code = 1
}
require('util').inherits(module.exports, Error)
