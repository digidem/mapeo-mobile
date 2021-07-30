// @ts-check
const fakeApks = require("./fake-apk-info");

/** @typedef {import('../../upgrade-manager/types').InstallerInt} InstallerInt */

/**
 * @typedef {object} TestFixtureCompare
 * @property {InstallerInt} a
 * @property {InstallerInt} b
 * @property {-1 | 0 | 1} expected
 * @property {'compare' | 'rCompare'} method
 */

/**
 * @typedef {object} TestFixtureGtLt
 * @property {InstallerInt} a
 * @property {InstallerInt} b
 * @property {boolean} expected
 * @property {'gt' | 'lt' | 'lte' | 'gte'} method
 */

/** @type {Array<TestFixtureCompare | TestFixtureGtLt>} */
const fixtures = [
  {
    a: fakeApks.v0_0_1,
    b: fakeApks.v2_0_0,
    method: "compare",
    expected: -1,
  },
  {
    a: fakeApks.v0_0_1,
    b: fakeApks.v2_0_0,
    method: "gt",
    expected: false,
  },
  {
    a: fakeApks.v0_0_1,
    b: fakeApks.v2_0_0,
    method: "lt",
    expected: true,
  },
  {
    a: fakeApks.v0_0_1,
    b: fakeApks.v2_0_0,
    method: "rCompare",
    expected: 1,
  },
  {
    a: fakeApks.v0_0_1,
    b: fakeApks.v2_0_0,
    method: "gte",
    expected: false,
  },
  {
    a: fakeApks.v0_0_1,
    b: fakeApks.v2_0_0,
    method: "lte",
    expected: true,
  },
  {
    a: fakeApks.v2_0_0,
    b: fakeApks.v2_0_0,
    method: "gte",
    expected: true,
  },
  {
    a: fakeApks.v2_0_0,
    b: fakeApks.v2_0_0,
    method: "lte",
    expected: true,
  },
];

module.exports = fixtures;
