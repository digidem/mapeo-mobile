/* eslint-disable promise/param-names */
const { beforeAfterStream } = require("../../lib/utils");
const test = require("tape");
const stream = require("stream");

// WriteableStream keeps chunks written to it for testing
function collectStream() {
  return new stream.Writable({
    write(chunk, encoding, cb) {
      if (this.chunks) this.chunks.push(chunk.toString());
      else this.chunks = [chunk.toString()];
      cb();
    },
  });
}

test("beforeAfterStream: run order is correct", t => {
  t.plan(3);
  const testChunks = ["hello", "world", "goodbye"];
  const events = [];
  const outerStream = beforeAfterStream({
    async createStream() {
      const innerStream = collectStream();
      innerStream.on("finish", () => {
        events.push("innerStreamFinish");
      });
      innerStream.on("error", e => {
        t.fail(e.message);
      });
      await new Promise(res => setTimeout(res, 100));
      return innerStream;
    },
    async finalize(innerStream) {
      await new Promise(res => setTimeout(res, 100));
      t.deepEqual(
        innerStream.chunks,
        testChunks,
        "All data is flushed to innerStream"
      );
      t.deepEqual(events, ["innerStreamFinish"], "innerStream has finished");
      events.push("finalizeFunctionDone");
    },
  });
  outerStream.on("error", e => {
    t.fail(e.message);
  });
  outerStream.on("finish", () => {
    events.push("outerStreamFinish");
    t.deepEqual(
      events,
      [
        "innerStreamFinish",
        "finalizeFunctionDone",
        "outerStreamEnd",
        "outerStreamFinish",
      ],
      "Order is correct: inner stream finishes; finalize function executes; outer stream finishes"
    );
  });
  (async () => {
    outerStream.write(testChunks[0]);
    outerStream.write(testChunks[1]);
    await new Promise(res => setTimeout(res, 100));
    outerStream.write(testChunks[2]);
    outerStream.end(e => {
      events.push("outerStreamEnd");
    });
  })();
});

test("beforeAfterStream: Errors propogate", t => {
  t.plan(2);
  let innerStream;
  const outerStream = beforeAfterStream({
    async createStream() {
      innerStream = new stream.Writable();
      return innerStream;
    },
    async finalize(innerStream) {},
  });
  setTimeout(() => {
    innerStream.destroy(new Error("destroyed"));
  }, 100);
  outerStream.on("error", e => {
    t.true(e instanceof Error, "Emitted error event");
    t.equal(e.message, "destroyed", "Error is from innerStream");
  });
});

test("beforeAfterStream: destroying stream destroys wrapped stream", t => {
  t.plan(3);
  let innerStream;
  const outerStream = beforeAfterStream({
    async createStream() {
      innerStream = new stream.Writable();
      innerStream.on("close", () => {
        t.pass("inner stream is closed");
      });
      innerStream.on("error", e => {
        t.equal(e.message, "destroyed", "destroy error propogated");
      });
      return innerStream;
    },
    async finalize(innerStream) {},
  });
  outerStream.on("error", e => {
    t.pass("outerStream threw error after destroy");
  });
  setTimeout(() => {
    outerStream.destroy(new Error("destroyed"));
  }, 100);
});

test("beforeAfterStream: if createStream throws, the stream will emit error (create() throw before write)", t => {
  t.plan(2);
  const testError = new Error("CreateError");
  const outerStream = beforeAfterStream({
    async createStream() {
      throw testError;
    },
    finalize() {},
  });
  outerStream.on("error", e => {
    t.equal(e, testError, "emits error thrown from createStream()");
  });

  setTimeout(() => {
    outerStream.write("hello");
    outerStream.write("world");
    outerStream.end(e => {
      t.equal(
        e.code,
        "ERR_STREAM_DESTROYED",
        "Attempt to call end() returns ERR_STREAM_DESTROYED"
      );
    });
  }, 100);
});

test("beforeAfterStream: if createStream throws, the stream will emit error (write before create() throw)", t => {
  t.plan(2);
  const testError = new Error("CreateError");
  const outerStream = beforeAfterStream({
    async createStream() {
      await new Promise(res => setTimeout(res, 200));
      throw testError;
    },
    finalize() {},
  });
  outerStream.on("error", e => {
    t.equal(e, testError, "emits error thrown from createStream()");
  });
  outerStream.write("hello");
  outerStream.write("world");
  setTimeout(() => {
    outerStream.end(e => {
      t.equal(
        e.code,
        "ERR_STREAM_DESTROYED",
        "Attempt to call end() returns ERR_STREAM_DESTROYED"
      );
    });
  }, 100);
});

test("beforeAfterStream: if finalize throws, the stream will end with error", t => {
  t.plan(2);
  let innerStream;
  const testError = new Error("FinalizeError");
  const outerStream = beforeAfterStream({
    async createStream() {
      innerStream = collectStream();
      return innerStream;
    },
    finalize() {
      throw testError;
    },
  });
  outerStream.on("error", e => {
    t.equal(e, testError, "emits error thrown from finalize()");
  });
  outerStream.write("hello");
  outerStream.write("world");
  setTimeout(() => {
    outerStream.end(e => {
      t.equal(e, testError, "ends with error thrown from finalize()");
    });
  }, 200);
});
