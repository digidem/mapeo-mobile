// @ts-check

const { Type } = require("@sinclair/typebox");
const Ajv = require("ajv").default;
const addFormats = require("ajv-formats").default;

const ajv = addFormats(new Ajv(), ["uri", "regex"])
  .addKeyword("kind")
  .addKeyword("modifier");

const InstallerExtSchema = Type.Object({
  hash: Type.RegEx(/^[0-9a-fA-F]+$/, { minLength: 64, maxLength: 64 }),
  hashType: Type.Literal("sha256"),
  versionName: Type.String(),
  versionCode: Type.Integer(),
  applicationId: Type.String(),
  minSdkVersion: Type.Integer(),
  platform: Type.Union([
    Type.Literal("windows"),
    Type.Literal("macos"),
    Type.Literal("linux"),
    Type.Literal("android"),
    Type.Literal("ios"),
  ]),
  arch: Type.Array(
    Type.Union([
      Type.Literal("x86"),
      Type.Literal("x86_64"),
      Type.Literal("armeabi-v7a"),
      Type.Literal("arm64-v8a"),
    ]),
    { minItems: 1 }
  ),
  size: Type.Integer(),
  url: Type.String({ format: "uri" }),
});

const InstallerListSchema = Type.Array(InstallerExtSchema);

/** @type {import('ajv').ValidateFunction<import('@sinclair/typebox').Static<typeof InstallerListSchema>>} */
const isInstallerList = ajv.compile(InstallerListSchema);

module.exports = {
  InstallerExtSchema,
  InstallerListSchema,
  isInstallerList,
};
