import React, { useMemo } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { defineMessages, useIntl, FormattedMessage } from "react-intl";
import { StyleSheet, View, Text } from "react-native";
import { NavigationScreenProp } from "react-navigation";
import { useNavigation } from "react-navigation-hooks";
import { NavigationStackScreenComponent } from "react-navigation-stack";
import { StackNavigationProp } from "react-navigation-stack/lib/typescript/src/vendor/types";
import { MEDIUM_BLUE, WHITE } from "../../../lib/styles";
import Button from "../../../sharedComponents/Button";
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

export const SyncOnboardingScreen: NavigationStackScreenComponent = ({
  navigation,
}) => {
  //For UI testing purposes
  const [obsCompleted, setObsCompleted] = useState(1);
  const total = 30;

  // useEffect(()=>
  // {
  //     const timer = setTimeout(()=>{setObsCompleted(prev => prev+1)}, 100)
  //     if(obsCompleted === total) return(clearTimeout(timer))
  // }, [obsCompleted])

  //Start of real component
  const { syncing, completed } = SyncScreenStates;
  const [screenState, setScreenState] = useState(syncing);
  const { formatMessage: t } = useIntl();

  const progress = obsCompleted / total;

  const completedTextNode = useMemo(() => {
    return completedMessage(total, total);
  }, [total]);

  if (progress === 1) {
    // const completedTimer = setTimeout(()=>{
    //     clearTimeout(completedTimer)
    //     if(screenState !== completed)setScreenState(completed)
    // }, 1000)
  }

  function completedMessage(completed: number, totalObs: number) {
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
      {/*             
            { screenState === syncing &&
                <SyncLoading textNode={completedMessage(obsCompleted, total)} progress={progress} />
            }

            { screenState === completed &&
                <SyncOnboardingComplete textNode={completedTextNode} />
            }
             */}
      <Button
        color="light"
        onPress={() => {
          setObsCompleted(prev => prev + 1);
        }}
      >
        {t(m.startMapping)}
      </Button>
    </View>
  );
};

SyncOnboardingScreen.navigationOptions = {
  headerShown: false,
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
