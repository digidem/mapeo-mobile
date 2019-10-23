// @flow
import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";

import type { NavigationScreenConfigProps } from "react-navigation";

import HeaderTitle from "../../sharedComponents/HeaderTitle";
import ObservationsListView from "./ObservationsListView";
import useAllObservations from "../../hooks/useAllObservations";

const m = defineMessages({
  observationListTitle: {
    id: "screens.ObservationList.observationListTitle",
    defaultMessage: "Observations",
    description: "Title of screen with list of observations"
  }
});

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
  headerTitle: (
    <HeaderTitle>
      <FormattedMessage {...m.observationListTitle} />
    </HeaderTitle>
  )
};

export default ObservationsList;
