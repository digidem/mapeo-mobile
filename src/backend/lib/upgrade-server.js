const pump = require("pump");

class UpgradeServer {
  constructor(storage) {
    this.storage = storage;
  }

  // HttpRequest, HttpResponse -> Bool
  handleHttpRequest(req, res) {
    if (!this.handleListRequest(req, res)) {
      if (!this.handleGetContentRequest(req, res)) {
        return false;
      }
    }
    return true;
  }

  // HttpRequest, HttpResponse -> Void
  handleListRequest(req, res) {
    if (req.method !== "GET" || req.url !== "/list") return false;
    this.storage.getAvailableUpgrades((err, options) => {
      if (err) {
        res.statusCode = 500;
        res.end(err.toString());
      } else {
        res.statusCode = 200;
        res.end(JSON.stringify(options));
      }
    });
    return true;
  }

  // HttpRequest, HttpResponse -> Void
  handleGetContentRequest(req, res) {
    const m = req.url.match(/\/content\/(.*)$/);
    if (req.method !== "GET" || !m) return false;

    this.storage.getAvailableUpgrades((err, options) => {
      if (err) {
        res.statusCode = 500;
        res.end(err.toString());
        return;
      }

      const hash = m[1];
      const option = options.filter(o => o.hash === hash)[0];
      if (!option) {
        res.statusCode = 404;
        res.end('"no such upgrade"');
        return;
      }

      const rs = this.storage.createReadStream(hash);
      if (!rs) {
        res.statusCode = 500;
        res.end('"could not read upgrade data"');
        return;
      }

      res.statusCode = 200;
      pump(rs, res);
    });
    return true;
  }
}

module.exports = UpgradeServer;
