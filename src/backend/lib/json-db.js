// @ts-check
// Adapted from https://github.com/typicode/lowdb to use CommonJS
const path = require("path");
const fs = require("fs");

/**
 * @template T
 * @typedef {object} SyncAdapter
 * @property {() => T | null} read
 * @property {(data: T) => void} write
 */

/**
 * @template T
 * @implements {SyncAdapter<T>}
 */
class JSONFileSync {
  #filename;
  #tempFilename;

  /** @param {string} filename */
  constructor(filename) {
    this.#filename = filename;
    this.#tempFilename = path.join(
      path.dirname(filename),
      `.${path.basename(filename)}.tmp`
    );
  }

  /** @returns {T | null} */
  read() {
    let data;

    try {
      data = fs.readFileSync(this.#filename, "utf-8");
    } catch (e) {
      if (/** @type {NodeJS.ErrnoException} */ (e).code === "ENOENT") {
        return null;
      }
      throw e;
    }

    if (data === null) {
      return null;
    } else {
      return JSON.parse(data);
    }
  }

  /** @param {T} obj */
  write(obj) {
    const str = JSON.stringify(obj, null, 2);
    fs.writeFileSync(this.#tempFilename, str);
    fs.renameSync(this.#tempFilename, this.#filename);
  }
}

/**
 * @template [T=unknown]
 */
class JsonDb {
  /** @type {T} */
  data;
  /** @type {SyncAdapter<T>} */
  #adapter;

  /**
   * @param {string} filename
   * @param {T} initial
   */
  constructor(filename, initial) {
    this.#adapter = new JSONFileSync(filename);
    const data = this.#adapter.read();
    if (data === null) {
      this.data = initial;
      this.write();
    } else {
      this.data = data;
    }
  }

  write() {
    if (this.data !== null) {
      this.#adapter.write(this.data);
    }
  }
}

module.exports = JsonDb;
