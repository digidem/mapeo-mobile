const fs = require("fs");
const crypto = require("crypto");
const pump = require("pump");

/*
  type Upgrade {
    hash: String
    hashType: 'sha256'
    version: String
    platform: 'windows' | 'macos' | 'linux' | 'android' | 'ios'
    arch: Array<'x86' | 'x86_64' | 'armeabi-v7a' | 'arm64-v8a'>
    size: Number,
    id: String
  }
}

# on init
1. copy apk at boot time (via 'copy-apk' ipc + report-back ipc) to stable location/filename
2. get metadata /w result caching on report-back ipc

# on request
3. stream apk data on GET /static/:id

*/

// opts?: {
//   binariesPath?: string
// }
module.exports = function(opts) {
  opts = opts || {};
  let apkPath;
  let apkMetadata = {};

  // http handler
  const handler = function(req, res) {
    let match;

    if (!handleList(req, res)) {
      if (!handleGetContent(req, res)) {
        return false;
      }
    }
    return true;
  };

  // Throws `err`
  handler.setApkInfo = function(_apkPath, version) {
    apkPath = _apkPath;
    const hash = hashFile(apkPath).toString("hex");
    apkMetadata = {
      hash,
      size: fs.statSync(apkPath).size,
      version,
      hashType: "sha256",
      platform: "android",
      arch: "arm64-v8a",
      id: hash
    };
  };

  return handler;

  function handleList(req, res) {
    if (req.method === "GET" && req.url === "/list") {
      let binaries = [];
      // XXX: future feature, for sharing binaries for other platforms.
      // if (opts.binariesPath) {
      //   binaries = binaries.concat(scanBinariesFromPath(opts.binariesPath))
      // }
      if (apkMetadata) {
        // TODO: if it's not ready yet, wait on it
        binaries.push(apkMetadata);
      }
      res.end(JSON.stringify(binaries));
      return true;
    }
    return false;
  }

  function handleGetContent(req, res) {
    if (req.method === "GET" && (m = req.url.match(/\/content\/(.*)$/))) {
      const hash = m[1];
      if (apkMetadata && hash === apkMetadata.hash && fs.existsSync(apkPath)) {
        // TODO: set content-type
        pump(fs.createReadStream(apkPath), res);
      } else {
        res.statusCode = 404;
        res.end("no such content");
      }
      return true;
    }
    return false;
  }
};

// String -> Buffer
function hashFile(filename) {
  const hash = crypto.createHash("sha256");
  hash.update(fs.readFileSync(filename));
  return hash.digest();
}
