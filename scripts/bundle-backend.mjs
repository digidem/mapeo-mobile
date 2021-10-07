#!/usr/bin/env node
// @ts-check
import { rollup } from "rollup";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import alias from "@rollup/plugin-alias";

const [entry, outfile] = process.argv.slice(2);

/** @type {import('rollup').InputOptions} */
const inputOptions = {
  external: [
    "rn-bridge",
    "original-fs",
    "async_hooks",
    "utf-8-validate",
    "bufferutil",
    "worker_threads",
    "pino-pretty",
    "memcpy",
  ],
  input: entry,
  plugins: [
    commonjs(),
    nodeResolve({
      preferBuiltins: true,
    }),
    json(),
    alias(),
  ],
};

/** @type {import('rollup').OutputOptions} */
const outputOptions = {
  file: outfile,
  format: "cjs",
};

async function build() {
  const bundle = await rollup(inputOptions);
  await bundle.write(outputOptions);
  await bundle.close();
}

build();
