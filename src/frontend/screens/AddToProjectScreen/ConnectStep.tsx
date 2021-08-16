import * as React from "react";
import { StyleSheet, View } from "react-native";
import { FormattedMessage, defineMessages } from "react-intl";
import Text from "../../sharedComponents/Text";

const m = defineMessages({
  title: {
    id: "screens.AddToProjectScreen.ConnectStep.title",
    defaultMessage: "Connecting to device...",
  },
});

export const ConnectStep = () => (
  <View style={styles.container}>
    <View>
      <Text style={[styles.title, styles.centeredText]}>
        <FormattedMessage {...m.title} />
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
  },
  centeredText: {
    textAlign: "center",
  },
});
