import * as React from "react";
import { ScrollView } from "react-native";
import { FormattedMessage, defineMessages } from "react-intl";
import { SafeAreaView } from "react-native-safe-area-context";

import IntlContext, { supportedLanguages } from "../../context/IntlContext";
import HeaderTitle from "../../sharedComponents/HeaderTitle";
import SelectOne from "./SelectOne";

const m = defineMessages({
  title: {
    id: "screens.LanguageSettings.title",
    defaultMessage: "Language",
    description: "Title language settings screen",
  },
});

export const LanguageSettings = () => {
  const [locale, setLocale] = React.useContext(IntlContext);

  const options = supportedLanguages.map(
    ({ locale, nativeName, englishName }) => ({
      value: locale as string,
      label: nativeName as string,
      hint: englishName as string,
    })
  );

  return (
    <SafeAreaView edges={["bottom"]}>
      <ScrollView testID="languageScrollView">
        <SelectOne value={locale} options={options} onChange={setLocale} />
      </ScrollView>
    </SafeAreaView>
  );
};

LanguageSettings.navigationOptions = {
  headerTitle: () => (
    <HeaderTitle>
      <FormattedMessage {...m.title} />
    </HeaderTitle>
  ),
};
