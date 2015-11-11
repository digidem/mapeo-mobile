import errorReporter from '../backend/error_reporter'

export default store => next => action => {
  try {
    return next(action)
  } catch (err) {
    console.error('Logging error:', err)
    errorReporter.captureException(err, {
      extra: {
        action,
        state: store.getState()
      }
    })
  }
}
