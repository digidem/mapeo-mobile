/* eslint-disable promise/param-names */
const test = require("tape");
const AsyncService = require("../lib/async-service");

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
  constructor({ _start, _stop, setState, getState }) {
    super();
    _start && (this._start = _start);
    _stop && (this._stop = _stop);
    setState && (this.setState = setState);
    getState && (this.getState = getState);
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
  t.true(started, "Service is started once `start()` resolves");
});

test('Calling `start()` when the service is "starting" (e.g. `start()` has been called but has not completed) will not call `_start()` again, but will resolve once the service has started.', async t => {
  let startCount = 0;
  const service = new TestService({
    async _start() {
      await new Promise(res => setTimeout(res, 100));
      startCount++;
    },
  });
  service.start();
  service.start();
  await new Promise(res => setTimeout(res, 0));
  t.equal(startCount, 0, "Service not yet started");
  await service.start();
  t.equal(startCount, 1, "service _start() is only called once");
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
  t.equal(service.getState().value, "error", "in error state");
  try {
    await service.start();
  } catch (e) {
    t.ok(
      e instanceof Error,
      "throws once in error state, even if _start() does not throw on second call"
    );
  }
  t.equal(service.getState().value, "error", "in error state");
});

test('Calling `start()` or `stop()` when the service is in "error" state will throw with the error from the error state', async t => {
  let startCount = 0;
  const service = new TestService({
    async _start() {
      await new Promise(res => setTimeout(res, 100));
      startCount++;
    },
  });
  service.setState({ value: "error", error: new Error("TestError") });
  try {
    await service.start();
    t.fail("should not reach here");
  } catch (e) {
    t.equal(
      e.message,
      "TestError",
      "start() throws with error from error state"
    );
  }
  try {
    await service.stop();
    t.fail("should not reach here");
  } catch (e) {
    t.equal(
      e.message,
      "TestError",
      "stop() throws with error from error state"
    );
  }
  t.equal(startCount, 0, "Service never started");
});

test('Multiple calls to `start()` or `stop()` when the service is in "error" state will throw the same error', async t => {
  let startCount = 0;
  const service = new TestService({
    async _start() {
      await new Promise(res => setTimeout(res, 100));
      startCount++;
    },
  });
  service.setState({ value: "error", error: new Error("TestError") });

  for (let i = 0; i < 10; i++) {
    try {
      await service.start();
      t.fail("should not reach here");
    } catch (e) {
      t.equal(
        e.message,
        "TestError",
        "start() throws with error from error state"
      );
    }
  }
  for (let i = 0; i < 10; i++) {
    try {
      await service.stop();
      t.fail("Should not reach here");
    } catch (e) {
      t.equal(
        e.message,
        "TestError",
        "stop() throws with error from error state"
      );
    }
  }
  t.equal(startCount, 0, "Service never started");
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
  await service.stop();
  t.false(started, "Service is stopped once `stop()` resolves");
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
  t.equal(stopCount, 0, "Service not yet started");
  await service.stop();
  t.equal(stopCount, 1, "service _stop() is only called once");
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
  const timeStart = Date.now();
  await service.stop();
  t.true(
    Date.now() - timeStart < 10,
    "calling second time resolves immediately"
  );
  await new Promise(res => setTimeout(res, 0));
  t.equal(stopCount, 1, "service _stop() has only been called once");
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
  } catch (e) {
    t.ok(e instanceof Error, "throws on first call");
  }
  t.equal(service.getState().value, "error", "in error state");
  try {
    await service.stop();
  } catch (e) {
    t.ok(
      e instanceof Error,
      "throws once in error state, even if _start() does not throw on second call"
    );
  }
  t.equal(service.getState().value, "error", "in error state");
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

  service.stop();
  await nextTick();
  service.start();
  await nextTick();
  await service.stop();
  t.false(started, "service is stopped");
});

async function nextTick() {
  return new Promise(res => process.nextTick(res));
}
