// @ts-check
const { installerCompare } = require("../../upgrade-manager/utils");
const test = require("tape");
const fixtures = require("../fixtures/installer-compare");

test("Test installer compare methods", t => {
  for (const { a, b, method, expected } of fixtures) {
    t.equal(installerCompare[method](a, b), expected);
  }
  t.end();
});
