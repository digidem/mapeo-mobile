const path = require('path')
const parallel = require('run-parallel')
const fs = require('fs')
const safe = require('safe-fs-blob-store')

// migrate blob stores
// 1. see if original/media has files
// 2. add each file to safe-fs-blob-store
// 3. remove old file

module.exports = migrateDirectory

function migrateDirectory (mediaPath, cb) {
  var blobstore = safe(mediaPath)
  var tasks = []
  fs.readdir(mediaPath, function (err, files) {
    if (err) throw err
    files.forEach(function (filename) {
      tasks.push((next) => {
        migrateFile(filename, next)
      })
    })
    parallel(tasks, cb)
  })

  function migrateFile (key, cb) {
    var filename = path.join(mediaPath, key)
    fs.stat(filename, function (err, stat) {
      if (err) return cb(err)
      if (stat.isFile()) {
        var cleanup = function (err) {
          if (err) return cb(err)
          fs.unlink(filename, cb)
        }
        var readStream = fs.createReadStream(filename)
        var writeStream = blobstore.createWriteStream({key}, cleanup)
        readStream.pipe(writeStream)
      }
    })
  }
}
