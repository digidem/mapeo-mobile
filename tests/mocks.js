export const createGeolocationMock = () => {
  let watches = []

  function watchPosition (successCallback, errorCallback, options) {
    const watch = {
      successCallback,
      errorCallback,
      options,
      watchId: Date.now()
    }
    watches.push(watch)
    return watch.watchId
  }

  function clearWatch (watchId) {
    watches = watches.filter(watch => watch.watchId !== watchId)
  }

  function sendPosition (position) {
    watches.map(watch => watch.successCallback(position))
  }

  function sendError (error) {
    watches.map(watch => watch.errorCallback(error))
  }

  function areWatchesRemoved () {
    return watches.length === 0
  }

  function reset () {
    watches = []
  }

  return {
    watchPosition,
    clearWatch,
    sendPosition,
    sendError,
    areWatchesRemoved,
    reset
  }
}
