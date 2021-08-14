import React, { useState } from "react";
import api from "../../../api";
import { Bar } from "react-native-progress";
import { View, Text, StyleSheet } from "react-native";
import { defineMessages, FormattedMessage } from "react-intl";
import { useMemo } from "react";
import { DARK_BLUE, MEDIUM_BLUE, WHITE } from "../../../lib/styles";

const m = defineMessages({
  syncing: {
    id: "screens.Onboarding.Sync.Loader.syncing",
    defaultMessage: "Syncing...",
  },
  numComplete: {
    id: "screens.Onboarding.Sync.Loader.numComplete",
    defaultMessage: "{num}/{total} observations complete",
  },
});

interface SyncLoadingProps {
  textNode: React.ReactNode;
  progress: number;
}

export const SyncLoading = ({ textNode, progress }: SyncLoadingProps) => {
  return (
    <View style={[styles.screenContainer]}>
      <Text style={[styles.text, styles.title]}>
        <FormattedMessage {...m.syncing} />
      </Text>

      {/* <Text style={[styles.text, styles.subText]}>
                <FormattedMessage {...m.numComplete} values={{num:completedObservations, total:totalObservations}}/>
            </Text> */}

      {textNode}

      <Bar
        style={[{ marginTop: 10 }]}
        color={DARK_BLUE}
        unfilledColor={WHITE}
        progress={progress}
        height={20}
        width={null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: MEDIUM_BLUE,
  },
  text: {
    color: WHITE,
    textAlign: "center",
    margin: 10,
  },
  title: {
    marginTop: 30,
    fontSize: 24,
    fontWeight: "500",
  },
  subText: {
    fontSize: 16,
    marginBottom: 20,
  },
});
