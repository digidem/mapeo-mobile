// @flow
import React from "react";
import { StyleSheet, View } from "react-native";
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

  const options = supportedLanguages.map(({ locale, nativeName }) => ({
    value: locale,
    label: nativeName
  }));

  return (
    <View style={styles.root}>
      <SelectOne
        value={locale}
        options={options}
        onChange={selectedLocale => setLocale(selectedLocale)}
      />
    </View>
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

const styles = StyleSheet.create({
  root: {
    paddingVertical: 8
  }
});
