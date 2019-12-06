import * as Localization from "expo-localization";

const locale = Localization.locale || "en";
// TODO: Dynamic requires for device language?

if (!Intl.PluralRules) {
  require("@formatjs/intl-pluralrules/polyfill");
  require("@formatjs/intl-pluralrules/dist/locale-data/en"); // Add locale data for de
}
if (!Intl.RelativeTimeFormat) {
  require("@formatjs/intl-relativetimeformat/polyfill");
  require("@formatjs/intl-relativetimeformat/dist/locale-data/en"); // Add locale data for de
}
