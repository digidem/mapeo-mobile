// @flow
import React from "react";
import { Text, Platform, StyleSheet } from "react-native";
import type { NavigationScreenConfigProps } from "react-navigation";

import ObservationDetailView from "../components/ObservationDetailView";
import CenteredView from "../components/CenteredView";
import ObservationPreset from "../context/ObservationPreset";

// TODO: Add a better message for the user.
// In the future if we add deep-linking we could get here,
// otherwise we should never reach here unless there is a bug in the code
const ObservationNotFound = () => (
  <CenteredView>
    <Text>Observation not found</Text>
  </CenteredView>
);

const ObservationTitle = ({ navigation }: NavigationScreenConfigProps) => (
  <ObservationPreset id={navigation.getParam("observationId")}>
    {({ observation, preset }) => (
      <Text numberOfLines={1} style={styles.title}>
        {preset ? preset.name : "Observation"}
      </Text>
    )}
  </ObservationPreset>
);

const ObservationDetailScreen = ({
  navigation
}: NavigationScreenConfigProps) => (
  <ObservationPreset id={navigation.getParam("observationId")}>
    {({ observation, preset }) =>
      observation ? (
        <ObservationDetailView observation={observation} preset={preset} />
      ) : (
        <ObservationNotFound />
      )
    }
  </ObservationPreset>
);

ObservationDetailScreen.navigationOptions = ({ navigation }) => ({
  headerTitle: <ObservationTitle navigation={navigation} />
});

export default ObservationDetailScreen;

const styles = StyleSheet.create({
  title: {
    ...Platform.select({
      ios: {
        fontSize: 17,
        fontWeight: "600",
        color: "rgba(0, 0, 0, .9)",
        marginRight: 16
      },
      android: {
        fontSize: 20,
        fontWeight: "500",
        color: "rgba(0, 0, 0, .9)",
        marginRight: 16
      },
      default: {
        fontSize: 18,
        fontWeight: "400",
        color: "#3c4043"
      }
    })
  }
});
