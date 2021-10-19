/* eslint-disable promise/param-names */
const { beforeAfterStream } = require("../../upgrade-manager/utils");
const test = require("tape");
const stream = require("stream");
const net = require("net");
const concat = require("concat-stream");
const through = require("through2");

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
  t.plan(4);
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
      ["innerStreamFinish", "finalizeFunctionDone", "outerStreamFinish"],
      "Order is correct: inner stream finishes; finalize function executes; outer stream finishes"
    );
  });

  (async () => {
    outerStream.write(testChunks[0]);
    outerStream.write(testChunks[1]);
    await new Promise(res => setTimeout(res, 100));
    outerStream.write(testChunks[2]);
    outerStream.end(e => {
      t.error(e, "Ended without error");
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

  stream.finished(outerStream, e => {
    t.equal(e, testError, "finishes with error");
  });

  setTimeout(() => {
    outerStream.write("hello");
    outerStream.write("world");
    outerStream.end();
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
  stream.finished(outerStream, e => {
    t.equal(e, testError, "finishes with error");
  });
  outerStream.write("hello");
  outerStream.write("world");
  setTimeout(() => {
    outerStream.end();
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
  stream.finished(outerStream, e => {
    t.equal(e, testError, "finishes with error");
  });
  outerStream.write("hello");
  outerStream.write("world");
  setTimeout(() => {
    outerStream.end();
  }, 200);
});

// Tests from https://github.com/mafintosh/duplexify/blob/master/test.js

var HELLO_WORLD = Buffer.from("hello world");

test("passthrough", function (t) {
  t.plan(2);

  var pt = new stream.PassThrough();
  var ws = beforeAfterStream({
    async createStream() {
      return pt;
    },
    async finalize() {},
  });

  ws.end("hello world");
  ws.on("finish", function () {
    t.ok(true, "should finish");
  });
  pt.pipe(
    concat(function (data) {
      t.same(data.toString(), "hello world", "same in as out");
    })
  );
});

test("passthrough + double end", function (t) {
  t.plan(2);

  var pt = through();
  var ws = beforeAfterStream({
    async createStream() {
      return pt;
    },
    async finalize() {},
  });

  ws.end("hello world");
  ws.end();

  ws.on("finish", function () {
    t.ok(true, "should finish");
  });
  pt.pipe(
    concat(function (data) {
      t.same(data.toString(), "hello world", "same in as out");
    })
  );
});

test("async passthrough + end", function (t) {
  t.plan(2);

  var pt = through.obj({ highWaterMark: 1 }, function (data, enc, cb) {
    setTimeout(function () {
      cb(null, data);
    }, 100);
  });

  var ws = beforeAfterStream({
    async createStream() {
      return pt;
    },
    async finalize() {},
  });

  ws.write("hello ");
  ws.write("world");
  ws.end();

  ws.on("finish", function () {
    t.ok(true, "should finish");
  });
  pt.pipe(
    concat(function (data) {
      t.same(data.toString(), "hello world", "same in as out");
    })
  );
});

test("async", function (t) {
  var pt = through();

  var ws = beforeAfterStream({
    async createStream() {
      await new Promise(res => setTimeout(res, 50));
      return pt;
    },
    async finalize() {},
  });

  pt.pipe(
    concat(function (data) {
      t.same(data.toString(), "i was async", "same in as out");
      t.end();
    })
  );

  ws.write("i");
  ws.write(" was ");
  ws.end("async");
});

test("destroy", function (t) {
  t.plan(2);

  var pt = new stream.Transform({
    transform(chunk, encoding, cb) {
      cb(null, chunk);
    },
    destroy() {
      t.ok(true, "write destroyed");
    },
  });

  var ws = beforeAfterStream({
    async createStream() {
      return pt;
    },
    async finalize() {},
  });

  ws.on("close", function () {
    t.ok(true, "close emitted");
  });

  ws.destroy();
  ws.destroy(); // should only work once
});

test("bubble write errors", function (t) {
  t.plan(1);

  var pt = through();
  var ws = beforeAfterStream({
    async createStream() {
      return pt;
    },
    async finalize() {},
  });

  ws.on("error", function (err) {
    t.same(err.message, "write-error", "received write error");
  });

  ws.on("close", function () {
    // TODO: Should the outer stream close if the wrapped stream emits an error?
    // Or just forward the error?
    // t.ok(true, "close emitted");
  });

  setTimeout(() => {
    // Duplexify emits this synchronously, but we need to wait for the stream to
    // be created first
    pt.emit("error", new Error("write-error"));
  }, 0);
});

test("bubble errors from write()", function (t) {
  t.plan(1);

  // var errored = false;

  var ws = beforeAfterStream({
    async createStream() {
      return new stream.Writable({
        write: function (chunk, enc, next) {
          next(new Error("write-error"));
        },
      });
    },
    async finalize() {},
  });

  ws.on("error", function (err) {
    // errored = true;
    t.same(err.message, "write-error", "received write error");
  });
  ws.on("close", function () {
    // Same as above, should outer stream close on wrapped stream error?
    // t.pass("close emitted");
    // t.ok(errored, "error was emitted before close");
  });
  ws.end("123");
});

test("destroy while waiting for drain", function (t) {
  t.plan(1);

  // var errored = false;
  var ws = beforeAfterStream({
    async createStream() {
      return new stream.Writable({
        highWaterMark: 0,
        write: function () {},
      });
    },
    async finalize() {},
  });

  ws.on("error", function (err) {
    // errored = true;
    t.same(err.message, "destroy-error", "received destroy error");
  });
  ws.on("close", function () {
    // t.pass("close emitted");
    // t.ok(errored, "error was emitted before close");
  });
  ws.write("123");
  ws.destroy(new Error("destroy-error"));
});

test("works with node native streams (net)", function (t) {
  t.plan(1);

  var server = net.createServer(function (socket) {
    socket.once("data", function (chunk) {
      t.same(chunk, HELLO_WORLD);
      server.close();
      socket.end();
      t.end();
    });
  });

  server.listen(0, function () {
    var socket = net.connect(server.address().port);
    var ws = beforeAfterStream({
      async createStream() {
        return socket;
      },
      async finalize() {},
    });

    ws.write(HELLO_WORLD);
  });
});
