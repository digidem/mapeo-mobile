import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import { Image, View, Text, StyleSheet } from "react-native";
import { WHITE } from "../../../lib/styles";

const m = defineMessages({
  complete: {
    id: "screens.Onboarding.Sync.Loader.complete",
    defaultMessage: "Complete!",
  },
});

interface SyncCompleteProps {
  textNode: React.ReactNode;
}

export const SyncOnboardingComplete = ({ textNode }: SyncCompleteProps) => {
  return (
    <View style={styles.container}>
      <Image
        style={{ marginBottom: 30 }}
        source={require("../../../images/completed/checkComplete.png")}
      />

      <Text style={styles.title}>
        <FormattedMessage {...m.complete} />
      </Text>

      {textNode}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    color: WHITE,
    fontSize: 24,
    fontWeight: "500",
    marginBottom: 15,
  },
  container: {
    alignItems: "center",
  },
});
