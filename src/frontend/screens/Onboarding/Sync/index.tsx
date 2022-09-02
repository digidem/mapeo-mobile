/**
 * Only reachable if the `onboarding` experiment is enabled
 * by doing either of the following:
 *   - Set `FEATURE_ONBOARDING=true` when running/building
 *   - Manually change the context value in `SettingsContext.tsx`
 */
import React, { useMemo, useEffect, useState } from "react";
import { defineMessages, useIntl, FormattedMessage } from "react-intl";
import { StyleSheet, View, Text } from "react-native";
import { MEDIUM_BLUE, WHITE } from "../../../lib/styles";
import Button from "../../../sharedComponents/Button";
import { NativeRootNavigationProps } from "../../../sharedTypes";
import { SyncOnboardingComplete } from "./Complete";
import { SyncLoading } from "./Loader";

enum SyncScreenStates {
  syncing,
  completed,
}

const m = defineMessages({
  startMapping: {
    id: "screens.Onboarding.Sync.startMapping",
    defaultMessage: "Start Mapping",
  },
  numComplete: {
    id: "screens.Onboarding.Sync.numComplete",
    defaultMessage: "{num}/{total} observations complete",
  },
});

export const SyncOnboardingScreen = ({
  navigation,
}: NativeRootNavigationProps<"SyncOnboardingScreen">) => {
  //For UI testing purposes
  const [obsCompleted, setObsCompleted] = useState(1);
  const total = 30;
  useEffect(() => {
    const timer = setTimeout(() => {
      setObsCompleted(prev => prev + 1);
    }, 100);
    if (obsCompleted === total) return clearTimeout(timer);
  }, [obsCompleted]);

  //Start of real component
  const { syncing, completed } = SyncScreenStates;
  const [screenState, setScreenState] = useState(syncing);
  const { formatMessage: t } = useIntl();

  const progress = obsCompleted / total;

  const completedTextNode = useMemo(() => {
    return progressMessage(total, total);
  }, [total]);

  if (progress === 1) {
    const completedTimer = setTimeout(() => {
      clearTimeout(completedTimer);
      if (screenState !== completed) setScreenState(completed);
    }, 1000);
  }

  //completed message as a JSX component
  function progressMessage(completed: number, totalObs: number) {
    return (
      <Text style={[styles.text, styles.subText]}>
        <FormattedMessage
          {...m.numComplete}
          values={{ num: completed, total: totalObs }}
        />
      </Text>
    );
  }

  return (
    <View style={styles.screenContainer}>
      {screenState === syncing && (
        <SyncLoading
          textNode={progressMessage(obsCompleted, total)}
          progress={progress}
        />
      )}

      {screenState === completed && (
        <SyncOnboardingComplete textNode={completedTextNode} />
      )}

      <Button
        onPress={() => navigation.navigate("Home", { screen: "Map" })}
        variant="outlined"
        color="light"
        disabled={screenState === syncing}
      >
        {t(m.startMapping)}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: MEDIUM_BLUE,
    justifyContent: "space-between",
    padding: "10%",
  },
  subText: {
    fontSize: 16,
    marginBottom: 20,
  },
  text: {
    color: WHITE,
    textAlign: "center",
    margin: 10,
  },
});
