// Placeholder for persisting error data to backend / localstorage for sync
// Could use Raven-js here, or log to our levelDB which we are replicating
function captureException (err, opts) {
  return console.log(err, opts)
}

export default {
  captureException
}
