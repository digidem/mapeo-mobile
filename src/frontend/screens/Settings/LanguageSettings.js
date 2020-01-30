// @flow
import React from "react";
import { ScrollView } from "react-native";
import { FormattedMessage, defineMessages } from "react-intl";

import HeaderTitle from "../../sharedComponents/HeaderTitle";
import SelectOne from "./SelectOne";
import IntlContext, { supportedLanguages } from "../../context/IntlContext";

const m = defineMessages({
  title: {
    id: "screens.LanguageSettings.title",
    defaultMessage: "Language",
    description: "Title language settings screen"
  }
});

const LanguageSettings = () => {
  const [locale, setLocale] = React.useContext(IntlContext);

  const options = supportedLanguages.map(
    ({ locale, nativeName, englishName }) => ({
      value: locale,
      label: nativeName,
      hint: englishName
    })
  );

  return (
    <ScrollView>
      <SelectOne
        value={locale}
        options={options}
        onChange={selectedLocale => setLocale(selectedLocale)}
      />
    </ScrollView>
  );
};

LanguageSettings.navigationOptions = {
  headerTitle: (
    <HeaderTitle>
      <FormattedMessage {...m.title} />
    </HeaderTitle>
  )
};

export default LanguageSettings;
