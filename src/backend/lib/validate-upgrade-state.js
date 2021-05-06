var validate = require("valid-schema");
var Enum = require("valid-schema/enum");
var List = require("valid-schema/list");
const { UpgradeState } = require("./constants");

const Any = () => {};

module.exports = (function () {
  let serverState;
  let searchState;
  let downloadState;
  let checkState;

  function validateState(s) {
    const isValid = roughSchema(s);
    if (isValid) return isValid;

    serverState = s.server.state;
    searchState = s.downloader.search.state;
    downloadState = s.downloader.download.state;
    checkState = s.downloader.check.state;
    return fullSchema(s);
  }

  const roughSchema = validate({
    server: {
      state: Enum("IDLE", "SHARING", "DRAINING", "ERROR"),
      context: Any,
    },
    downloader: {
      search: {
        state: Enum("IDLE", "SEARCHING", "ERROR"),
        context: Any,
      },
      download: {
        state: Enum("IDLE", "DOWNLOADING", "ERROR"),
        context: Any,
      },
      check: {
        state: Enum("NOT_AVAILABLE", "AVAILABLE", "ERROR"),
        context: Any,
      },
    },
  });

  const fullSchema = validate({
    server: {
      state: Enum("IDLE", "SHARING", "DRAINING", "ERROR"),
      context: c => {
        switch (serverState) {
          case UpgradeState.Server.Idle:
            return c === null ? undefined : "context must be null";
          case UpgradeState.Server.Sharing:
            return uploadInfo({ c: c });
          case UpgradeState.Server.Draining:
            return uploadInfo({ c: c });
          case UpgradeState.Server.Error:
            return "object" === typeof c && c.message
              ? undefined
              : "context must be error";
        }
      },
    },
    downloader: {
      search: {
        state: Enum("IDLE", "SEARCHING", "ERROR"),
        context: c => {
          switch (searchState) {
            case UpgradeState.Search.Idle:
              return c === null ? undefined : "context must be null";
            case UpgradeState.Search.Searching:
              return searchContext(c);
            case UpgradeState.Search.Error:
              return "object" === typeof c && c.message
                ? undefined
                : "context must be error";
          }
        },
      },
      download: {
        state: Enum("IDLE", "DOWNLOADING", "ERROR"),
        context: c => {
          switch (downloadState) {
            case UpgradeState.Download.Idle:
              return c === null ? undefined : "context must be null";
            case UpgradeState.Download.Downloading:
              return downloadInfo({ c });
            case UpgradeState.Download.Error:
              return "object" === typeof c && c.message
                ? undefined
                : "context must be error";
          }
        },
      },
      check: {
        state: Enum("NOT_AVAILABLE", "AVAILABLE", "ERROR"),
        context: c => {
          switch (checkState) {
            case UpgradeState.Check.NotAvailable:
              return c === null ? undefined : "context must be null";
            case UpgradeState.Check.Available:
              return availableInfo(c);
            case UpgradeState.Download.Error:
              return "object" === typeof c && c.message
                ? undefined
                : "context must be error";
          }
        },
      },
    },
  });

  const uploadInfo = validate({
    c: List({
      sofar: Number,
      total: Number,
    }),
  });

  const downloadInfo = validate({
    c: {
      sofar: Number,
      total: Number,
    },
  });

  const availableInfo = validate({
    filename: String,
  });

  const searchContext = validate({
    startTime: Number,
    upgrades: List({
      hash: String,
      hashType: "sha256",
      version: String,
      platform: Enum("windows", "macos", "linux", "android", "ios"),
      arch: List(Enum("x86", "x86_64", "armeabi-v7a", "arm64-v8a")),
      size: Number,
      id: String,
      host: String,
      port: Number,
    }),
  });

  return validateState;
})();

// var input = {
//   server: {
//     state: UpgradeState.Server.Sharing,
//     // context: new Error('oh no')
//     context: [{sofar:10,total:12}]
//   },
//   downloader: {
//     search: {
//       state: UpgradeState.Search.Searching,
//       context: {
//         startTime: 2,
//         upgrades: [{
//           hash: 'fakehash',
//           hashType: 'sha256',
//           version: '1.0.0',
//           platform: 'linux',
//           arch: ['x86', 'x86_64'],
//           size: 10000000,
//           id: 'fakehash',
//           host: '192.168.1.12',
//           port: 4300
//         }]
//       }
//     },
//     download: {
//       state: UpgradeState.Download.Downloading,
//       context: {sofar:0, total: 100000}
//     },
//     check: {
//       state: UpgradeState.Check.Available,
//       context: {
//         filename: '/tmp/download.apk'
//       }
//     }
//   }
// }

// var result = module.exports()(input)
// console.log(result)
