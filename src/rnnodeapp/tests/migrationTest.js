const concat = require('concat-stream')
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const blobstore = require('fs-blob-store')
const fs = require('fs')
const series = require('run-series')
const safeBlobstore = require('safe-fs-blob-store')
const path = require('path')
const test = require('tape')
const migrateMedia = require('../migrateMedia')
const os = require('os')

const TEST_IMAGES = path.join(__dirname, '..', '..', 'images')
const MEDIA_PATH = path.join(os.tmpdir(), 'media-test')
const ORIGINAL_PATH = path.join(MEDIA_PATH, 'original')
const THUMBNAIL_PATH = path.join(MEDIA_PATH, 'thumbnail')

function testMigration (keys, t) {
  var old = blobstore(MEDIA_PATH)
  var safe = safeBlobstore(MEDIA_PATH)

  var tasks = []
  keys.forEach(function (key) {
    tasks.push((next) => {
      var testImage = path.join(TEST_IMAGES, key)
      writeFile(testImage, 'original/' + key, function (err) {
        t.error(err, 'error in writing orignal for ' + key)
        writeFile(testImage, 'thumbnail/' + key, function (err) {
          t.error(err, 'error in writing thumbnail for ' + key)
          fs.access(path.join(ORIGINAL_PATH, key), function (err) {
            t.error(err, 'test image exists in media path (original)')
            fs.access(path.join(THUMBNAIL_PATH, key), function (err) {
              t.error(err, 'test image exists in media path (thumbnail)')
              next()
            })
          })
        })
      })
    })
  })

  series(tasks, function (err) {
    t.error(err)
    migrateMedia(MEDIA_PATH, function (err) {
      t.error(err, 'error on migrate')
      keys.forEach(testKey)
    })
  })

  function writeFile (testImage, key, cb) {
    var readStream = fs.createReadStream(testImage)
    var writeStream = old.createWriteStream(key, cb)
    readStream.pipe(writeStream)
  }

  let pending = keys.length

  function done () {
    pending--
    if (pending !== 0) return
    t.end()
  }

  function testKey (key) {
    var newFile = safe.createReadStream('original/' + key)
    newFile.on('error', function (err) {
      t.error(err, 'error on reading from safe blob store')
      t.end()
    })
    newFile.pipe(concat(function (data) {
      var testImage = path.join(TEST_IMAGES, key)
      t.same(fs.readFileSync(testImage), data)
      fs.access(path.join(ORIGINAL_PATH, key), function (err) {
        t.ok(err, 'test image no longer exists in old blob store format (original)')
        fs.access(path.join(THUMBNAIL_PATH, key), function (err) {
          t.ok(err, 'test image no longer exists in old blob store format (thumbnail)')
          done()
        })
      })
    }))
  }
}

test('migrates files', function (t) {
  resetMediaPath()
  testMigration(['mapeo-icon.png'], t)
})

test('when media folder has many items', function (t) {
  resetMediaPath()
  testMigration(['mapeo-icon.png', 'add-button.png'], t)
})

function resetMediaPath () {
  rimraf.sync(MEDIA_PATH)
  mkdirp.sync(MEDIA_PATH)
}
