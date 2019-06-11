// @flow
import React from "react";
import { Text, Platform, StyleSheet, Alert } from "react-native";
import debug from "debug";
import type { NavigationScreenConfigProps } from "react-navigation";

import ObservationView from "./ObservationView";
import CenteredView from "../../sharedComponents/CenteredView";
import {
  withObservations,
  type ObservationsContext
} from "../../context/ObservationsContext";
import ObservationPreset from "../../context/ObservationPreset";
import EditButton from "./EditButton";

const log = debug("mapeo:Observation");

// TODO: Add a better message for the user.
// In the future if we add deep-linking we could get here,
// otherwise we should never reach here unless there is a bug in the code
const ObservationNotFound = () => (
  <CenteredView>
    <Text>Observation not found</Text>
  </CenteredView>
);

type Props = {
  ...$Exact<NavigationScreenConfigProps>,
  delete: $PropertyType<ObservationsContext, "delete">
};

class Observation extends React.Component<Props> {
  static navigationOptions = ({ navigation }: any) => ({
    headerRight: <EditButton navigation={navigation} />
  });

  handlePressPhoto = (photoIndex: number) => {
    const { navigation } = this.props;
    navigation.navigate("PhotosModal", {
      photoIndex: photoIndex,
      observationId: navigation.getParam("observationId")
    });
  };

  async deleteObservation(observationId: string) {
    const { navigation, delete: deleteObservation } = this.props;
    log("Starting delete of " + observationId + " observation");

    try {
      await deleteObservation(observationId);
      // $FlowFixMe
      navigation.pop();
    } catch (e) {
      log("Error:", e);
      Alert.alert(
        "Error",
        "Disculpas, hay un error y no se puede borrar la observación",
        [
          {
            text: "OK",
            onPress: () => {}
          }
        ]
      );
    }
  }

  handlePressDelete = () => {
    const { navigation } = this.props;
    const observationId = navigation.getParam("observationId");
    if (typeof observationId !== "string")
      return log("Observation not found when trying to delete");
    Alert.alert("¿Queres borrar la observación?", undefined, [
      {
        text: "Cancelar",
        onPress: () => {}
      },
      {
        text: "Si, Borrar",
        onPress: () => this.deleteObservation(observationId)
      }
    ]);
  };

  render() {
    const { navigation } = this.props;
    return (
      <ObservationPreset id={navigation.getParam("observationId")}>
        {({ observation, preset }) =>
          observation ? (
            <ObservationView
              observation={observation}
              preset={preset}
              onPressPhoto={this.handlePressPhoto}
              onPressDelete={this.handlePressDelete}
            />
          ) : (
            <ObservationNotFound />
          )
        }
      </ObservationPreset>
    );
  }
}

export default withObservations(["delete"])(Observation);

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
