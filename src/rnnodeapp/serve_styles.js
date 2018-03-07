const ecstatic = require('ecstatic');
const url = require('url');
const path = require('path');
const fs = require('fs');

module.exports = function createStyleServer(root) {
  const styleFile = path.join(root, '/style/style.json');

  const onError = err => {
    console.error(`Error serving ${styleFile}:`, err);
    res.statusCode = 404;
    res.write(err);
    res.end();
  };

  const serveStyleFile = (req, res) => {
    fs.stat(styleFile, (err, stat) => {
      if (err) return onError(err);

      return fs.readFile(styleFile, 'utf8', (error, data) => {
        if (err) return onError(error);

        data = Buffer.from(
          data.replace(/\{host\}/gm, `http://${req.headers.host}`)
        );

        res.setHeader('content-type', 'application/json; charset=utf-8');
        res.setHeader('last-modified', new Date(stat.mtime).toUTCString());
        res.setHeader('content-length', data.length);
        res.setHeader(
          'Access-Control-Allow-Headers',
          'Authorization, Content-Type, If-Match, If-Modified-Since, If-None-Match, If-Unmodified-Since'
        );
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.statusCode = 200;
        res.write(data);
        res.end();
        return null;
      });
    });
  };

  const listFiles = (req, res) => {
    const files = fs.readdirSync(root);
    res.statusCode = 200;
    const string = files.map(f => JSON.stringify(f)).join(',');
    console.log(root, files, string);
    res.write(string);
    res.end();
    return null;
  };

  const tiles = (req, res) => {
    const { pathname } = url.parse(req.url);
    const split = pathname.split('/');
    const file = fs.readFileSync(
      `${root}/composite/${split[split.length - 3]}/${
        split[split.length - 2]
      }/${split[split.length - 1]}`
    );
    res.statusCode = 200;
    res.write(file);
    res.end(file);
    return null;
  };

  return (req, res) => {
    if (url.parse(req.url).pathname.indexOf('/tiles') > -1) {
      res.setHeader('content-encoding', 'gzip');
    }
    if (url.parse(req.url).pathname.endsWith('style.json')) {
      return serveStyleFile(req, res);
    }

    if (url.parse(req.url).pathname.endsWith('listDirectory')) {
      return listFiles(req, res);
    }

    if (url.parse(req.url).pathname.match(/tiles\/\d+\/\d+\/\d+.pbf/)) {
      return tiles(req, res);
    }

    ecstatic({ root, cors: true })(req, res);
    return null;
  };
};
