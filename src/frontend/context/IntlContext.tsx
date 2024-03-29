import * as React from "react";
import { Platform } from "react-native";
import { IntlProvider as IntlProviderOrig, CustomFormats } from "react-intl";
import * as Localization from "expo-localization";
import { useAppState } from "@react-native-community/hooks";

import createPersistedState from "../hooks/usePersistedState";
import messages from "../../../translations/messages.json";
import languages from "../languages.json";

// WARNING: This needs to change if we change the type of locale
const STORE_KEY = "@MapeoLocale@1";

export const formats: CustomFormats = {
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

type TranslatedLocales = keyof typeof messages;
type SupportedLanguageLocales = keyof typeof languages;

interface LanguageName {
  /** IETF BCP 47 langauge tag with region code. */
  locale: SupportedLanguageLocales;
  /** Localized name for language */
  nativeName: string;
  /** English name for language */
  englishName: string;
}

const translatedLocales = Object.keys(messages) as Array<TranslatedLocales>;

export const supportedLanguages: LanguageName[] = translatedLocales
  .filter(locale => {
    const hasAtLeastOneTranslatedString =
      Object.keys(messages[locale]).length > 0;
    // This will show a typescript error if the language name does not exist
    const hasTranslatedLanguageName = languages[locale];
    if (!hasTranslatedLanguageName) {
      console.warn(
        `Locale "${locale}" is not available in Mapeo because we do not have
a language name and translations in \`src/frontend/languages.json\``
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

type IntlContextType = Readonly<
  [string, React.Dispatch<React.SetStateAction<string | null>>]
>;

const IntlContext = React.createContext<IntlContextType>(["en", () => {}]);

export const IntlProvider = ({ children }: { children: React.ReactNode }) => {
  const [appLocale, persistStatus, setLocale] = usePersistedState<
    string | null
  >(null);
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

  const languageCode = locale.split("-")[0];

  // Add fallbacks for non-regional locales (e.g. "en" for "en-GB")
  const localeMessages = {
    ...messages[languageCode as TranslatedLocales],
    ...(messages[locale as TranslatedLocales] || {}),
  };

  const contextValue = React.useMemo(() => [locale, setLocale] as const, [
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
      wrapRichTextChunksInFragment
    >
      <IntlContext.Provider value={contextValue}>
        {children}
      </IntlContext.Provider>
    </IntlProviderOrig>
  );
};

export default IntlContext;

function onError(e: Error) {
  console.log(e);
}

// Device locale can be regional e.g. `en-US` but we might only have
// translations for `en`. If we don't have translations for a given device
// language, then we ignore it and fallback to `en` or the user selected
// language for the app
function getSupportedLocale(
  locale: string
): keyof typeof languages | undefined {
  if (supportedLanguages.find(lang => lang.locale === locale))
    return locale as keyof typeof languages;
  const nonRegionalLocale = locale.split("-")[0];
  if (supportedLanguages.find(({ locale }) => locale === nonRegionalLocale))
    return nonRegionalLocale as keyof typeof languages;
}
