// @flow
import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import { useNavigation } from "@react-navigation/native";

import type { NavigationScreenConfigProps } from "react-navigation";

import HeaderTitle from "../../sharedComponents/HeaderTitle";
import ObservationsListView from "./ObservationsListView";
import useAllObservations from "../../hooks/useAllObservations";
import { SettingsIcon } from "../../sharedComponents/icons";
import IconButton from "../../sharedComponents/IconButton";

const m = defineMessages({
  observationListTitle: {
    id: "screens.ObservationList.observationListTitle",
    defaultMessage: "Observations",
    description: "Title of screen with list of observations",
  },
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

const SettingsButton = () => {
  const { navigate } = useNavigation();
  return (
    <IconButton onPress={() => navigate("Settings")} testID="settingsButton">
      <SettingsIcon color="rgba(0, 0, 0, 0.54)" />
    </IconButton>
  );
};

ObservationsList.navigationOptions = {
  headerTitle: () => (
    <HeaderTitle>
      <FormattedMessage {...m.observationListTitle} />
    </HeaderTitle>
  ),
  headerRight: () => <SettingsButton />,
};

export default ObservationsList;
