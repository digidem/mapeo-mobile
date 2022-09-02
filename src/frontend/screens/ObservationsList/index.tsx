import React from "react";
import { defineMessages } from "react-intl";
import ObservationsListView from "./ObservationsListView";
import { useAllObservations } from "../../hooks/useAllObservations";
import { SettingsIcon } from "../../sharedComponents/icons";

import IconButton from "../../sharedComponents/IconButton";
import { useNavigationFromRoot } from "../../hooks/useNavigationWithTypes";
import { NativeNavigationComponent } from "../../sharedTypes";

const m = defineMessages({
  observationListTitle: {
    id: "screens.ObservationList.observationListTitle",
    defaultMessage: "The List",
    description: "Title of screen with list of observations",
  },
});

const ObservationsList: NativeNavigationComponent<"ObservationList"> = ({
  navigation,
}) => {
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

export const SettingsButton = () => {
  const { navigate } = useNavigationFromRoot();
  return (
    <IconButton onPress={() => navigate("Settings")} testID="settingsButton">
      <SettingsIcon color="rgba(0, 0, 0, 0.54)" />
    </IconButton>
  );
};

ObservationsList.navTitle = m.observationListTitle;

export default ObservationsList;
