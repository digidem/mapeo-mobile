// @flow
import React from "react";
import { Text, Platform, StyleSheet } from "react-native";
import type { NavigationScreenConfigProps } from "react-navigation";

import ObservationView from "./ObservationView";
import CenteredView from "../../sharedComponents/CenteredView";
import ObservationPreset from "../../context/ObservationPreset";

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

const Observation = ({ navigation }: NavigationScreenConfigProps) => (
  <ObservationPreset id={navigation.getParam("observationId")}>
    {({ observation, preset }) =>
      observation ? (
        <ObservationView observation={observation} preset={preset} />
      ) : (
        <ObservationNotFound />
      )
    }
  </ObservationPreset>
);

Observation.navigationOptions = ({ navigation }) => ({
  headerTitle: <ObservationTitle navigation={navigation} />
});

export default Observation;

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
