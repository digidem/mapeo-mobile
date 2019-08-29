// @flow
import React from "react";
import { Text, Alert } from "react-native";

import ObservationView from "./ObservationView";
import CenteredView from "../../sharedComponents/CenteredView";
import useObservation from "../../hooks/useObservation";
import EditButton from "./EditButton";
import type { NavigationProp } from "../../types";

// TODO: Add a better message for the user.
// In the future if we add deep-linking we could get here,
// otherwise we should never reach here unless there is a bug in the code
const ObservationNotFound = () => (
  <CenteredView>
    <Text>Observation not found</Text>
  </CenteredView>
);

type Props = {
  navigation: NavigationProp
};

const Observation = ({ navigation }: Props) => {
  const observationId = navigation.getParam("observationId");

  const [
    // TODO: handle loadingStatus and deletingStatus state
    { observation, preset },
    deleteObservation
  ] = useObservation(observationId);

  function handlePressPhoto(photoIndex: number) {
    navigation.navigate("PhotosModal", {
      photoIndex: photoIndex,
      observationId: navigation.getParam("observationId")
    });
  }

  function handlePressDelete() {
    Alert.alert("¿Queres borrar la observación?", undefined, [
      {
        text: "Cancelar",
        onPress: () => {}
      },
      {
        text: "Si, Borrar",
        onPress: () => {
          deleteObservation();
          navigation.pop();
        }
      }
    ]);
  }

  if (!observation) return <ObservationNotFound />;

  return (
    <ObservationView
      observation={observation}
      preset={preset}
      onPressPhoto={handlePressPhoto}
      onPressDelete={handlePressDelete}
    />
  );
};

Observation.navigationOptions = ({ navigation }: NavigationProp) => ({
  headerRight: <EditButton navigation={navigation} />
});

export default Observation;
