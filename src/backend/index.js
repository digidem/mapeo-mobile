// @ts-check
const minimist = require("minimist");
const init = require("./app");

/** @typedef {import('../shared-types').ServerStartupConfig} Config */
/**
 * @template T
 * @typedef {Array<keyof import('type-fest').ConditionalPick<Config, T>>} ConfigArray
 */

/** @type {ConfigArray<string>} */
const stringConfigOptions = [
  "sharedStorage",
  "privateCacheStorage",
  "apkFilepath",
  "buildNumber",
  "bundleId",
  "version",
];
/** @type {ConfigArray<string[]>} */
const stringArrayConfigOptions = ["supportedAbis"];
/** @type {ConfigArray<boolean>} */
const booleanConfigOptions = ["isDev"];
/** @type {ConfigArray<number>} */
const numberConfigOptions = ["sdkVersion"];

try {
  const config = parseArgs();
  init(config);
} catch (e) {
  console.log("Server startup error:", e);
}

function parseArgs() {
  /** @type {minimist.Opts} */
  const minimistOptions = {
    string: [...stringConfigOptions, ...stringArrayConfigOptions],
    boolean: booleanConfigOptions,
    unknown: arg => {
      const parsedArg = arg.split("=")[0].replace(/^-{1,2}/, "");
      // @ts-ignore
      if (numberConfigOptions.includes(parsedArg)) return true;
      else throw new Error("Unknown server startup argument: " + parsedArg);
    },
  };

  const { _, "--": __, ...argv } = minimist(
    process.argv.slice(2),
    minimistOptions
  );
  for (const arg of stringArrayConfigOptions) {
    if (!argv[arg]) throw new Error(`Missing required argument: ${arg}`);
    argv[arg] = argv[arg].split(",");
  }
  validateArgs(argv);
  return argv;
}

/**
 * @param {{ [key: string]: unknown }} args
 * @returns {asserts args is Config}
 */
function validateArgs(args) {
  for (const arg of stringConfigOptions) {
    if (typeof args[arg] !== "string")
      throw new Error(
        `Expected ${arg} to be a string, got ${typeof args[arg]}`
      );
  }
  for (const arg of stringArrayConfigOptions) {
    if (!Array.isArray(args[arg]))
      throw new Error(
        `Expected ${arg} to be an array, got ${typeof args[arg]}`
      );
  }
  for (const arg of booleanConfigOptions) {
    if (typeof args[arg] !== "boolean")
      throw new Error(
        `Expected ${arg} to be a boolean, got ${typeof args[arg]}`
      );
  }
  for (const arg of numberConfigOptions) {
    if (typeof args[arg] !== "number")
      throw new Error(
        `Expected ${arg} to be a number, got ${typeof args[arg]}`
      );
  }
}
