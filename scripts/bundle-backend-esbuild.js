#!/usr/bin/env node
// @ts-check

const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs");
const alias = require("esbuild-plugin-alias");
const { constant } = require("lodash");

const [entry, outfile] = process.argv.slice(2);
const nodeVersion = fs
  .readFileSync(path.join(__dirname, "../.nvmrc"), "utf8")
  .trim();

esbuild
  .build({
    entryPoints: [entry],
    bundle: true,
    outfile,
    platform: "node",
    target: "node" + nodeVersion,
    mainFields: ["module", "main"],
    metafile: true,
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
    minify: false,
    plugins: [alias({})],
  })
  .then(result => {
    const text = esbuild.analyzeMetafileSync(result.metafile);
    console.log(text);
  })
  .catch(() => process.exit(1));
