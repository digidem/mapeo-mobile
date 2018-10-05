const concat = require('concat-stream')
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const pump = require('pump')
const blobstore = require('fs-blob-store')
const fs = require('fs')
const safeBlobstore = require('safe-fs-blob-store')
const path = require('path')
const test = require('tape')
const migrateMedia = require('../migrateMedia')
const os = require('os')

var key = 'mapeo-icon.png'
const TEST_IMAGES = path.join(__dirname, '..', '..', 'images')
const MEDIA_PATH = path.join(os.tmpdir(), 'media-test')

test('migrates files', function (t) {
  resetMediaPath()
  var original = blobstore(MEDIA_PATH)
  var testImage = path.join(TEST_IMAGES, key)

  function done (err) {
    t.error(err)
    fs.access(path.join(MEDIA_PATH, key), function (err) {
      t.ok(err, 'test image no longer exists in old blob store format')
      t.end()
    })
  }

  function doMigrate (err) {
    t.error(err)
    fs.access(path.join(MEDIA_PATH, key), function (err) {
      t.error(err, 'test image exists in media path')

      migrateMedia(MEDIA_PATH, function (err) {
        t.error(err, 'error on migrate')
        var safe = safeBlobstore(MEDIA_PATH)
        var newFile = safe.createReadStream({key})
        pump(newFile, concat(function (data) {
          t.same(fs.readFileSync(testImage), data)
        }), done)
      })
    })
  }

  var readStream = fs.createReadStream(testImage)
  var writeStream = original.createWriteStream({key}, doMigrate)
  readStream.pipe(writeStream)
})

test('when there is nothing to migrate, nothing happens', function (t) {
  resetMediaPath()
  migrateMedia(MEDIA_PATH, function (err) {
    t.error(err, 'error on migrate')
    t.end()
  })
})

function resetMediaPath () {
  rimraf.sync(MEDIA_PATH)
  mkdirp.sync(MEDIA_PATH)
}
