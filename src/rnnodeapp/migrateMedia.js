const path = require('path')
const parallel = require('run-parallel')
const fs = require('fs')
const safe = require('safe-fs-blob-store')

// migrate blob stores
// 1. see if original/media has files
// 2. add each file to safe-fs-blob-store
// 3. remove old file

module.exports = function (mediaPath, cb) {
  migrateDirectory(path.join(mediaPath, 'original'), function (err) {
    if (err) return cb(err)
    migrateDirectory(path.join(mediaPath, 'thumbnail'), cb)
  })
}

function migrateDirectory (dir, cb) {
  var blobstore = safe(dir)
  var tasks = []
  fs.stat(dir, function (err, stat) {
    if (err) {
      if (err.code === 'ENOENT') return cb(new Error(`Directory ${dir} does not exist.`))
      else return cb(err)
    }

    fs.readdir(dir, function (err, files) {
      if (err) return cb(err)
      files.forEach(function (filename) {
        tasks.push((next) => {
          migrateFile(filename, next)
        })
      })
      parallel(tasks, cb)
    })
  })

  function migrateFile (key, cb) {
    var filename = path.join(dir, key)
    fs.stat(filename, function (err, stat) {
      if (err) return cb(err)
      if (stat.isFile()) {
        var cleanup = function (err) {
          if (err) return cb(err)
          fs.unlink(filename, cb)
        }
        var readStream = fs.createReadStream(filename)
        var keyWithPrefix = `${path.dirname(key).split('/').pop()}/${key}`
        var writeStream = blobstore.createWriteStream({key: keyWithPrefix}, cleanup)
        readStream.pipe(writeStream)
      }
    })
  }
}
