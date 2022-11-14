import * as React from "react";
import { Platform } from "react-native";
import { IntlProvider as IntlProviderOrig } from "react-intl";
import * as Localization from "expo-localization";
import { useAppState } from "@react-native-community/hooks";

import createPersistedState from "../hooks/usePersistedState";
import messages from "../../../translations/messages.json";
import languages from "../languages.json";

// WARNING: This needs to change if we change the type of locale
const STORE_KEY = "@MapeoLocale@1";

export const formats = {
  date: {
    long: {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  },
};

interface LanguageName {
  /** IETF BCP 47 langauge tag with region code. */
  locale: string;
  /** Localized name for language */
  nativeName: string;
  /** English name for language */
  englishName: string;
}

const translatedLocales = Object.keys(messages) as Array<keyof typeof messages>;

export const supportedLanguages: LanguageName[] = translatedLocales
  .filter(locale => {
    const hasAtLeastOneTranslatedString =
      Object.keys(messages[locale]).length > 0;
    const hasTranslatedLanguageName = languages[locale];
    if (!hasTranslatedLanguageName) {
      console.warn(
        `Locale "${locale}" is not available in Mapeo because we do not have a language name and translations in \`src/frontend/languages.json\``
      );
    }
    return hasAtLeastOneTranslatedString && hasTranslatedLanguageName;
  })
  .map(locale => ({
    locale,
    ...languages[locale],
  }))
  .sort((a, b) => {
    return a.englishName.localeCompare(b.englishName);
  });

const usePersistedState = createPersistedState(STORE_KEY);

type IntlContextType = [string, (locale: string) => void];

const IntlContext = React.createContext<IntlContextType>(["en", () => {}]);

export const IntlProvider = ({ children }: { children: React.Node }) => {
  const [appLocale, persistStatus, setLocale] = usePersistedState(null);
  const appState = useAppState();

  React.useEffect(() => {
    // Localization only changes in Android (in iOS the app is restarted) and
    // will only happen when the app comes back into the foreground
    if (Platform.OS !== "android" || appState !== "active") return;
    // Wait for use defined locale to load first
    if (persistStatus === "loading") return;
    // If the user has selected an app locale, ignore device locale
    if (appLocale) return;

    Localization.getLocalizationAsync()
      .then(({ locale: deviceLocale }) => {
        if (appLocale) return;
        setLocale(getSupportedLocale(deviceLocale) || null);
      })
      .catch(() => {});
  }, [appLocale, appState, setLocale, persistStatus]);

  // Prefer user selected locale, fallback to device locale, then to "en"
  const locale = appLocale || getSupportedLocale(Localization.locale) || "en";

  // Add fallbacks for non-regional locales (e.g. "en" for "en-GB")
  const localeMessages = {
    ...messages[locale.split("-")[0]],
    ...(messages[locale] || {}),
  };

  const contextValue = React.useMemo(() => [locale, setLocale], [
    locale,
    setLocale,
  ]);

  return persistStatus === "loading" ? null : (
    <IntlProviderOrig
      key={locale}
      locale={locale}
      messages={localeMessages}
      formats={formats}
      onError={onError}
    >
      <IntlContext.Provider wrapRichTextChunksInFragment value={contextValue}>
        {children}
      </IntlContext.Provider>
    </IntlProviderOrig>
  );
};

export default IntlContext;

function onError(e) {
  console.log(e);
}

// Device locale can be regional e.g. `en-US` but we might only have
// translations for `en`. If we don't have translations for a given device
// language, then we ignore it and fallback to `en` or the user selected
// language for the app
function getSupportedLocale(locale) {
  if (typeof locale !== "string") return;
  if (supportedLanguages.find(lang => lang.locale === locale)) return locale;
  const nonRegionalLocale = locale.split("-")[0];
  if (supportedLanguages.find(({ locale }) => locale === nonRegionalLocale))
    return nonRegionalLocale;
}
