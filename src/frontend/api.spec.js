/* eslint-env jest/globals */
import ky from "ky";
import nodejs from "nodejs-mobile-react-native";
import RNFS from "react-native-fs";
import { Api, Constants, SERVER_START_TIMEOUT } from "./api";
import AppInfo from "./lib/AppInfo";
import FakeTimers from "@sinonjs/fake-timers";

// require("debug").enable("*");

jest.mock("ky");
jest.mock("react-native-fs");

describe.skip("Server startup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    // This is a hack to make sure the server is stopped before the next test
    nodejs.channel.emit("status", { value: Constants.CLOSED });
    nodejs.channel.removeAllListeners();
  });

  test("Initialization sets up nodejs status listener", () => {
    const spy = jest.spyOn(nodejs.channel, "addListener");
    new Api({ baseUrl: "__URL__" }); // eslint-disable-line no-new
    expect(spy).toHaveBeenCalled();
  });

  test("Start server", async () => {
    expect.assertions(5);
    const api = new Api({ baseUrl: "__URL__" });
    const serverStartPromise = api.startServer();
    nodejs.channel.emit("status", { value: Constants.LISTENING });
    await expect(serverStartPromise).resolves.toBeUndefined();
    expect(nodejs.start.mock.calls.length).toBe(1);
    expect(nodejs.start.mock.calls[0][0]).toBe("loader.js");
    expect(nodejs.channel.post.mock.calls.length).toBe(2);
    expect(nodejs.channel.post.mock.calls[1][1]).toStrictEqual({
      sharedStorage: RNFS.ExternalDirectoryPath,
      apkFilepath: AppInfo.sourceDir,
      privateCacheStorage: RNFS.CachesDirectoryPath,
      deviceInfo: {
        sdkVersion: -1, // mocked value
        supportedAbis: [], // mocked value
      },
      isDev: __DEV__,
    });
  });

  test("Start server timeout", () => {
    jest.useFakeTimers();
    expect.assertions(4);
    const api = new Api({ baseUrl: "__URL__" });
    const serverStartPromise = api.startServer();
    jest.runAllTimers();
    expect(api.startServer()).rejects.toThrow("Server start timeout");
    expect(nodejs.start.mock.calls.length).toBe(1);
    expect(nodejs.start.mock.calls[0][0]).toBe("loader.js");
    expect(nodejs.channel.post.mock.calls.length).toBe(1);
    jest.useRealTimers();
  });
});

describe("Server status", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Timeout", async () => {
    const { stateListener, cleanup, clock } = startServer();
    await clock.runAllAsync();
    expect(stateListener).toHaveBeenCalledWith(Constants.TIMEOUT);
    await cleanup();
  });
  test("Timeout only happens once if no other server status message", async () => {
    const { stateListener, cleanup, clock } = startServer();
    await clock.tickAsync(SERVER_START_TIMEOUT + 1);
    await clock.tickAsync(SERVER_START_TIMEOUT + 1);
    expect(stateListener).toHaveBeenCalledTimes(1);
    expect(stateListener).toHaveBeenNthCalledWith(1, Constants.TIMEOUT);
    await cleanup();
  });
  test("After timeout, if server starts listening, timeout starts again", async () => {
    const { serverStatus, stateListener, cleanup, clock } = startServer();
    await clock.tickAsync(SERVER_START_TIMEOUT + 1);
    serverStatus({ value: Constants.LISTENING });
    await clock.tickAsync(SERVER_START_TIMEOUT + 1);
    expect(stateListener).toHaveBeenCalledTimes(3);
    expect(stateListener).toHaveBeenNthCalledWith(1, Constants.TIMEOUT);
    expect(stateListener).toHaveBeenNthCalledWith(2, Constants.LISTENING);
    expect(stateListener).toHaveBeenNthCalledWith(3, Constants.TIMEOUT);
    await cleanup();
  });
  test("After timeout, if server is starting, timeout starts again", async () => {
    const { serverStatus, stateListener, cleanup, clock } = startServer();
    await clock.tickAsync(SERVER_START_TIMEOUT + 1);
    serverStatus({ value: Constants.STARTING });
    await clock.tickAsync(SERVER_START_TIMEOUT + 1);
    expect(stateListener).toHaveBeenCalledTimes(3);
    expect(stateListener).toHaveBeenNthCalledWith(1, Constants.TIMEOUT);
    expect(stateListener).toHaveBeenNthCalledWith(2, Constants.STARTING);
    expect(stateListener).toHaveBeenNthCalledWith(3, Constants.TIMEOUT);
    await cleanup();
  });
  test("After error, timeout will not happen", async () => {
    const { serverStatus, stateListener, cleanup, clock } = startServer();
    serverStatus({ value: Constants.ERROR });
    await clock.tickAsync(SERVER_START_TIMEOUT + 1);
    expect(stateListener).toHaveBeenCalledWith(Constants.ERROR);
    await cleanup();
  });
  test("After server close, timeout will not happen until it restarts", async () => {
    const {
      serverStart,
      serverStatus,
      stateListener,
      cleanup,
      clock,
    } = startServer();
    serverStatus({ value: Constants.LISTENING });
    await serverStart;
    serverStatus({ value: Constants.CLOSED });
    await clock.runAllAsync();
    serverStatus({ value: Constants.LISTENING });
    await clock.runAllAsync();
    expect(stateListener).toHaveBeenCalledTimes(4);
    expect(stateListener).toHaveBeenNthCalledWith(1, Constants.LISTENING);
    expect(stateListener).toHaveBeenNthCalledWith(2, Constants.CLOSED);
    expect(stateListener).toHaveBeenNthCalledWith(3, Constants.LISTENING);
    expect(stateListener).toHaveBeenNthCalledWith(4, Constants.TIMEOUT);
    await cleanup();
  });
  test("Unsubscribe works", async () => {
    const {
      subscription,
      serverStatus,
      stateListener,
      cleanup,
    } = startServer();
    subscription.remove();
    serverStatus({ value: Constants.LISTENING });
    expect(stateListener).toHaveBeenCalledTimes(0);
    await cleanup();
  });
});

// describe("Server get requests", () => {
//   ky.extend.mockImplementation(() => ({
//     get: jest.fn(url => ({
//       json: jest.fn(() => {
//         if (url.startsWith("presets")) return { presets: {}, fields: {} };
//         return [];
//       }),
//     })),
//   }));

//   ["getObservations", "getPresets", "getFields", "getMapStyle"].forEach(
//     method => {
//       test(method + " with server ready", async () => {
//         const { api } = await startServer();
//         expect.assertions(1);
//         return expect(api[method]()).resolves.toEqual([]);
//       });
//       test(method + " doesn't resolve until server is ready", async () => {
//         const { api, serverStatus } = await startServer();
//         jest.useRealTimers();
//         let pending = true;
//         serverStatus({ value: Constants.STARTING });
//         expect.assertions(2);
//         const getPromise = api[method]().finally(() => {
//           pending = false;
//         });
//         setTimeout(() => {
//           expect(pending).toBe(true);
//           serverStatus({ value: Constants.LISTENING });
//         }, 200);
//         return expect(getPromise).resolves.toEqual([]);
//       });
//       test(method + " rejects if server timeout", async () => {
//         const { api, serverStatus } = await startServer();
//         jest.useFakeTimers("legacy");
//         serverStatus({ value: Constants.STARTING });
//         const getPromise = api[method]();
//         jest.runAllTimers();
//         expect.assertions(1);
//         return expect(getPromise).rejects.toThrow("Server Timeout");
//       });
//       test(method + " rejects if server error", async () => {
//         const { api, serverStatus } = await startServer();
//         serverStatus({ value: Constants.ERROR });
//         const getPromise = api[method]();
//         expect.assertions(1);
//         return expect(getPromise).rejects.toThrow("Server Error");
//       });
//     }
//   );
// });

function startServer() {
  const clock = FakeTimers.install();
  const stateListener = jest.fn();
  const api = new Api({ baseUrl: "__URL__" });
  const serverStart = api.startServer();
  const subscription = api.addServerStateListener(stateListener);
  const serverStatus = status => nodejs.channel.emit("status", status);

  async function cleanup() {
    subscription.remove();
    // This is a hack to make sure the server is stopped before the next test
    nodejs.channel.emit("status", { value: Constants.CLOSED });
    nodejs.channel.removeAllListeners();
    // This is necessary to wait a tick for pending promises, then run timeouts,
    // so that timeouts don't fire after the test has finished
    await clock.runAllAsync();
    clock.reset();
    clock.uninstall();
  }

  return {
    serverStart,
    subscription,
    serverStatus,
    stateListener,
    cleanup,
    clock,
  };
}
