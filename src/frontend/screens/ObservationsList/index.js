// @flow
import React from "react";
import type { NavigationScreenConfigProps } from "react-navigation";

import ObservationsListView from "./ObservationsListView";
import useAllObservations from "../../hooks/useAllObservations";

const ObservationsList = ({ navigation }: NavigationScreenConfigProps) => {
  const [{ observations, status }] = useAllObservations();

  const navigateToObservation = (observationId: string) => {
    navigation.navigate("Observation", { observationId });
  };

  return (
    <ObservationsListView
      loading={status === "loading"}
      error={status === "error"}
      observations={observations}
      onPressObservation={navigateToObservation}
    />
  );
};

ObservationsList.navigationOptions = {
  title: "Observaciones"
};

export default ObservationsList;
