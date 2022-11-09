#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const {
  shouldPolyfill,
} = require("@formatjs/intl-relativetimeformat/should-polyfill");
const languages = require("../src/frontend/languages.json");

main();

function main() {
  // For @formatjs/intl-relativetimeformat and @formatjs/intl-locale, which are needed for jsc-intl runtime
  buildIntlRelativeTimeFormat();
}

function buildIntlRelativeTimeFormat() {
  const locales = Object.keys(languages);

  const localesToPolyfill = new Set();

  for (const l of locales) {
    try {
      const polyfillableLocale = shouldPolyfill(l);
      if (polyfillableLocale) {
        localesToPolyfill.add(polyfillableLocale);
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  const writer = fs.createWriteStream(
    path.join(
      __dirname,
      "../src/frontend/polyfills/intl-relativetimeformat.ts"
    ),
    { flags: "w" }
  );

  writer.write(createImportStatement("@formatjs/intl-locale/polyfill"));
  writer.write(
    createImportStatement("@formatjs/intl-relativetimeformat/polyfill")
  );

  for (const l of localesToPolyfill.values()) {
    writer.write(
      createImportStatement(
        `@formatjs/intl-relativetimeformat/locale-data/${l}`
      )
    );
  }

  writer.end();

  function createImportStatement(module) {
    return `import "${module}";\n`;
  }
}
