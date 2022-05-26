// @ts-check
const os = require("os");
const path = require("path");
// @ts-ignore
const rnBridge = require("rn-bridge");
const minimist = require("minimist");
const init = require("./index");

/** @typedef {import('../shared-types').ServerStartupConfig} ServerStartupConfig */
/** @type {Array<keyof import('type-fest').ConditionalPick<ServerStartupConfig, string>>} */
const stringConfigOptions = [
  "sharedStorage",
  "privateCacheStorage",
  "apkFilepath",
  "buildNumber",
  "bundleId",
  "version",
];
/** @type {Array<keyof import('type-fest').ConditionalPick<ServerStartupConfig, string[]>>} */
const stringArrayConfigOptions = ["supportedAbis"];
/** @type {Array<keyof import('type-fest').ConditionalPick<ServerStartupConfig, boolean>>} */
const booleanConfigOptions = ["isDev"];
/** @type {Array<keyof import('type-fest').ConditionalPick<ServerStartupConfig, number>>} */
const numberConfigOptions = ["sdkVersion"];

const config = parseArgs();

const nodejsProjectDir = path.resolve(rnBridge.app.datadir(), "nodejs-project");
os.homedir = () => nodejsProjectDir;
process.cwd = () => nodejsProjectDir;
process.env = process.env || {};
process.env.CHLORIDE_JS = "yes"; // Use WebAssembly libsodium

init(config);

function parseArgs() {
  /** @type {minimist.Opts} */
  const minimistOptions = {
    string: [...stringConfigOptions, ...stringArrayConfigOptions],
    boolean: booleanConfigOptions,
    unknown: arg => {
      // @ts-ignore
      if (numberConfigOptions.includes(arg)) return true;
      else throw new Error("Unknown server startup argument: " + arg);
    },
  };

  const { _, ...argv } = minimist(process.argv.slice(2), minimistOptions);
  for (const arg of stringArrayConfigOptions) {
    if (!argv[arg]) throw new Error(`Missing required argument: ${arg}`);
    argv[arg] = argv[arg].split(",");
  }
  validateArgs(argv);
  return argv;
}

/**
 * @param {{ [key: string]: unknown }} args
 * @returns {asserts args is ServerStartupConfig}
 */
function validateArgs(args) {
  for (const arg of stringConfigOptions) {
    if (typeof args[arg] !== "string")
      throw new Error(`Missing required argument: ${arg}`);
  }
  for (const arg of stringArrayConfigOptions) {
    if (!Array.isArray(args[arg]))
      throw new Error(`Missing required argument: ${arg}`);
  }
  for (const arg of booleanConfigOptions) {
    if (typeof args[arg] !== "boolean")
      throw new Error(`Missing required argument: ${arg}`);
  }
  for (const arg of numberConfigOptions) {
    if (typeof args[arg] === "number")
      throw new Error(`Missing required argument: ${arg}`);
  }
}
