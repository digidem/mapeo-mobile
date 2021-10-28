/* eslint-disable promise/param-names */
const test = require("tape");
const AsyncService = require("../upgrade-manager/async-service");

// * - Calling `start()` when the service is "stopped" calls the `_start()` method
// *   and resolves when it completes.
// * - Calling `start()` when the service is "starting" (e.g. `start()` has been
// *   called but has not completed) will not call `_start()` again, but will
// *   resolve once the service has started
// * - Calling `start()` when the service is "started" will resolve immediately
// *   and do nothing.
// * - If `_start()` or `_stop()` throw, then the service is left in an
// *   unrecoverable "error" state.
// * - Calling `start()` or `stop()` when the service is in "error" state will
// *   throw with the error from the error state

class TestService extends AsyncService {
  constructor({ _start, _stop }) {
    super();
    _start && (this._start = _start);
    _stop && (this._stop = _stop);
  }
  // Testing overriding this method, it should not affect behaviour of service state
  getState() {
    return "instanceState";
  }
  getSuperState() {
    return super.getState();
  }
}

test('Calling `start()` when the service is "stopped" calls the `_start()` method and resolves when it completes.', async t => {
  let started = false;
  const service = new TestService({
    async _start() {
      await new Promise(res => setTimeout(res, 100));
      started = true;
    },
  });
  await service.start();
  t.true(started, "Service is started");
  t.deepEqual(service.getSuperState(), { value: "started" });
});

test('Calling `start()` when the service is "starting" (e.g. `start()` has been called but has not completed) will not call `_start()` again, but will resolve once the service has started.', async t => {
  let startCount = 0;
  const service = new TestService({
    async _start() {
      await new Promise(res => setTimeout(res, 100));
      startCount++;
    },
  });
  t.deepEqual(
    service.getSuperState(),
    { value: "stopped" },
    "Service is in stopped state"
  );
  service.start();
  service.start();
  await new Promise(res => setTimeout(res, 0));
  t.equal(startCount, 0, "_start() has not yes been called");
  t.deepEqual(
    service.getSuperState(),
    { value: "starting" },
    "Service is in starting state"
  );
  await service.start();
  t.equal(startCount, 1, "service _start() is only called once");
  t.deepEqual(
    service.getSuperState(),
    { value: "started" },
    "Service is in started state"
  );
});

test('Calling `start()` when the service is "started" will resolve immediately and do nothing.', async t => {
  let startCount = 0;
  const service = new TestService({
    async _start() {
      await new Promise(res => setTimeout(res, 100));
      startCount++;
    },
  });
  await service.start();
  t.equal(startCount, 1, "service has started");
  t.deepEqual(
    service.getSuperState(),
    { value: "started" },
    "Service is in started state"
  );
  const timeStart = Date.now();
  await service.start();
  t.true(
    Date.now() - timeStart < 10,
    "calling second time resolves immediately"
  );
  await new Promise(res => setTimeout(res, 0));
  t.equal(startCount, 1, "service _start() has only been called once");
});

test('If `_start()` throws, then the service is left in an unrecoverable "error" state.', async t => {
  let startCount = 0;
  const service = new TestService({
    async _start() {
      await new Promise(res => setTimeout(res, 100));
      startCount++;
      // Throw the first time, but not on subsequent calls, but this should
      // never be called after it has thrown once
      if (startCount === 1) throw new Error("MyError");
    },
  });
  try {
    await service.start();
  } catch (e) {
    t.ok(e instanceof Error, "throws on first call");
  }
  t.equal(service.getSuperState().value, "error", "in error state");
  try {
    await service.start();
  } catch (e) {
    t.ok(
      e instanceof Error,
      "throws once in error state, even if _start() does not throw on second call"
    );
  }
  t.equal(service.getSuperState().value, "error", "in error state");
});

test('Calling `start()` or `stop()` when the service is in "error" state will throw with the error from the error state', async t => {
  let startCount = 0;
  const testError = new Error("TestError");
  const service = new TestService({
    async _start() {
      startCount++;
      return Promise.reject(testError);
    },
  });
  try {
    await service.start();
    t.fail("should not reach here");
  } catch (e) {
    t.equal(e, testError, "start() throws with error from error state");
  }
  try {
    await service.start();
    t.fail("should not reach here");
  } catch (e) {
    t.equal(e, testError, "start() throws with error from error state");
  }
  try {
    await service.stop();
    t.fail("should not reach here");
  } catch (e) {
    t.equal(e, testError, "stop() throws with error from error state");
  }
  t.equal(startCount, 1, "Only called _start() once when first threw");
  t.deepEqual(service.getSuperState(), { value: "error", error: testError });
});

test('Multiple calls to `start()` or `stop()` when the service is in "error" state will throw the same error', async t => {
  let stopCount = 0;
  const testError = new Error("TestError");
  const service = new TestService({
    async _start() {
      return Promise.reject(testError);
    },
    async _stop() {
      stopCount++;
    },
  });

  for (let i = 0; i < 10; i++) {
    try {
      await service.start();
      t.fail("should not reach here");
    } catch (e) {
      t.equal(e, testError, "start() throws with error from error state");
    }
  }
  for (let i = 0; i < 10; i++) {
    try {
      await service.stop();
      t.fail("Should not reach here");
    } catch (e) {
      t.equal(e, testError, "stop() throws with error from error state");
    }
  }
  t.equal(stopCount, 0, "_stop() is never called due to error state");
  t.deepEqual(service.getSuperState(), { value: "error", error: testError });
});

test('Calling `stop()` when the service is "started" calls the `_stop()` method and resolves when it completes.', async t => {
  let started = false;
  const service = new TestService({
    async _start() {
      started = true;
    },
    async _stop() {
      started = false;
    },
  });
  await service.start();
  t.true(started, "Service is in started state");
  t.deepEqual(service.getSuperState(), { value: "started" });
  await service.stop();
  t.false(started, "Service is stopped once `stop()` resolves");
  t.deepEqual(service.getSuperState(), { value: "stopped" });
});

test('Calling `stop()` when the service is "stopping" (e.g. `stop()` has been called but has not completed) will not call `_stop()` again, but will resolve once the service has stopped.', async t => {
  let stopCount = 0;
  const service = new TestService({
    async _stop() {
      await new Promise(res => setTimeout(res, 100));
      stopCount++;
    },
  });
  await service.start();
  service.stop();
  service.stop();
  await new Promise(res => setTimeout(res, 0));
  t.equal(stopCount, 0, "Service not yet stopped");
  t.deepEqual(service.getSuperState(), { value: "stopping" });
  await service.stop();
  t.equal(stopCount, 1, "service _stop() is only called once");
  t.deepEqual(service.getSuperState(), { value: "stopped" });
});

test('Calling `stop()` when the service is "stopped" will resolve immediately and do nothing.', async t => {
  let stopCount = 0;
  const service = new TestService({
    async _stop() {
      await new Promise(res => setTimeout(res, 100));
      stopCount++;
    },
  });
  await service.start();
  await service.stop();
  t.equal(stopCount, 1, "service has stopped");
  t.deepEqual(service.getSuperState(), { value: "stopped" });
  const timeStart = Date.now();
  await service.stop();
  t.true(
    Date.now() - timeStart < 10,
    "calling second time resolves immediately"
  );
  await new Promise(res => setTimeout(res, 0));
  t.equal(stopCount, 1, "service _stop() has only been called once");
  t.deepEqual(service.getSuperState(), { value: "stopped" });
});

test('If `_stop()` throws, then the service is left in an unrecoverable "error" state.', async t => {
  let stopCount = 0;
  const service = new TestService({
    async _stop() {
      await new Promise(res => setTimeout(res, 20));
      stopCount++;
      // Throw the first time, but not on subsequent calls, but this should
      // never be called after it has thrown once
      if (stopCount === 1) throw new Error("MyError");
    },
  });
  await service.start();
  try {
    await service.stop();
    t.fail("Should not reach here");
  } catch (e) {
    t.ok(e instanceof Error, "throws on first call");
  }
  t.equal(service.getSuperState().value, "error", "in error state");
  try {
    await service.stop();
  } catch (e) {
    t.ok(
      e instanceof Error,
      "throws once in error state, even if _start() does not throw on second call"
    );
  }
  t.equal(service.getSuperState().value, "error", "in error state");
});

test("Calling start() and stop() multiple times ends in expected state", async t => {
  let started = false;
  const service = new TestService({
    async _start() {
      await new Promise(res => setTimeout(res, 60));
      started = true;
    },
    async _stop() {
      await new Promise(res => setTimeout(res, 20));
      started = false;
    },
  });
  service.start();
  await nextTick();
  service.start();
  await nextTick();
  service.stop();
  await nextTick();
  await service.start();
  t.true(started, "service is started");
  t.deepEqual(service.getSuperState(), { value: "started" });

  service.stop();
  await nextTick();
  service.start();
  await nextTick();
  await service.stop();
  t.false(started, "service is stopped");
  t.deepEqual(service.getSuperState(), { value: "stopped" });
});

async function nextTick() {
  return new Promise(res => process.nextTick(res));
}
