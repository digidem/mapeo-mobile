#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const {
  shouldPolyfill,
} = require("@formatjs/intl-relativetimeformat/should-polyfill");

const messages = require("../translations/messages.json");
const languages = require("../src/frontend/languages.json");

// For @formatjs/intl-relativetimeformat and @formatjs/intl-locale, which are needed for jsc-intl runtime
buildIntlRelativeTimeFormat();

function buildIntlRelativeTimeFormat() {
  const outputPath = path.join(
    __dirname,
    "../src/frontend/polyfills/intl-relativetimeformat.ts"
  );

  const supportedLocales = Object.keys(messages).filter(locale => {
    const hasAtLeastOneTranslatedString =
      Object.keys(messages[locale]).length > 0;

    const hasTranslatedLanguageName = !!languages[locale];

    if (!hasTranslatedLanguageName) {
      console.warn(
        `Locale "${locale}" is not available in Mapeo because we do not have a language name and translations in \`src/frontend/languages.json\``
      );
    }

    return hasAtLeastOneTranslatedString && hasTranslatedLanguageName;
  });

  const localesToPolyfill = new Set();

  for (const l of supportedLocales) {
    try {
      const polyfillableLocale = shouldPolyfill(l);
      if (polyfillableLocale) {
        localesToPolyfill.add(polyfillableLocale);
      }
    } catch (err) {
      console.warn(err.message);
    }
  }

  const writer = fs.createWriteStream(outputPath, { flags: "w" });

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

  console.log(`Successfully added intl polyfill imports to ${outputPath}`);
}
