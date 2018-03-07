const ecstatic = require('ecstatic')
const url = require('url')
const path = require('path')
const fs = require('fs')

module.exports = function createStyleServer (root) {
  const styleFile = path.join(root, 'style.json')

  return function (req, res) {
    if (url.parse(req.url).pathname.indexOf('/tiles') > -1) {
      res.setHeader('content-encoding', 'gzip')
    }
    if (url.parse(req.url).pathname.endsWith('style.json')) {
      return serveStyleFile(req, res)
    }
    ecstatic({ root: root, cors: true })(req, res)
  }

  function serveStyleFile (req, res) {
    fs.stat(styleFile, function (err, stat) {
      if (err) return onError(err)
      fs.readFile(styleFile, 'utf8', function (err, data) {
        if (err) console.error(err)
        data = new Buffer(data.replace(/\{host\}/gm, 'http://' + req.headers.host))
        res.setHeader('content-type', 'application/json; charset=utf-8')
        res.setHeader('last-modified', (new Date(stat.mtime)).toUTCString())
        res.setHeader('content-length', data.length)
        res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, If-Match, If-Modified-Since, If-None-Match, If-Unmodified-Since')
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.statusCode = 200
        res.write(data)
        res.end()
      })
    })

    function onError (err) {
      console.error('Error serving ' + styleFile + ':', err)
      res.statusCode = 404
      res.end()
    }
  }
}
