var fs = require('fs')
var ncp = require('ncp')
var path = require('path')
var glob = require('glob')
var once = require('once')

var ASSETS_PATH = path.join(__dirname, 'assets')
var PRESETS_PATH = path.join(ASSETS_PATH, 'presets')
var STYLES_PATH = path.join(ASSETS_PATH, 'styles')

module.exports = function (dst, cb) {
  if (!assetsAreNew(ASSETS_PATH, dst)) {
    console.log('assets are not new')
    return cb()
  }
  cb = once(cb)
  let pending = 3
  copySubFolders(PRESETS_PATH, path.join(dst, 'presets'), done)
  copySubFolders(STYLES_PATH, path.join(dst, 'styles'), done)
  ncp(path.join(ASSETS_PATH, 'VERSION'), path.join(dst, 'ASSETS_VERSION'), done)
  function done (err) {
    if (err) return cb(err)
    if (--pending) return
    console.log('Copied new assets')
    cb()
  }
}

function copySubFolders (src, dst, cb) {
  cb = once(cb)
  glob('*/', {cwd: src}, function (err, dirs) {
    if (err) return cb(err)
    let pending = dirs.length
    dirs.forEach(function (dir) {
      ncp(path.join(src, dir), path.join(dst, dir), done)
    })
    function done (err) {
      if (err) return cb(err)
      if (--pending) return
      cb()
    }
  })
}

function assetsAreNew (src, dst) {
  if (!fs.existsSync(path.join(dst, 'ASSETS_VERSION'))) return true
  const srcVersion = +fs.readFileSync(path.join(src, 'VERSION'), 'utf8')
  const dstVersion = +fs.readFileSync(path.join(dst, 'ASSETS_VERSION'), 'utf8')
  console.log('src assets version:', srcVersion)
  console.log('dst assets version:', dstVersion)
  return srcVersion > dstVersion
}
