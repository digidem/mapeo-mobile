import React from "react";
import { defineMessages } from "react-intl";
import ObservationsListView from "./ObservationsListView";
import { useAllObservations } from "../../hooks/useAllObservations";
import { SettingsIcon } from "../../sharedComponents/icons";

import IconButton from "../../sharedComponents/IconButton";
import { useNavigation } from "../../hooks/useNavigationWithTypes";
import { NativeNavigationProp } from "../../sharedTypes";
import { useSetHeader } from "../../hooks/useSetHeader";

const m = defineMessages({
  observationListTitle: {
    id: "screens.ObservationList.observationListTitle",
    defaultMessage: "Observations",
    description: "Title of screen with list of observations",
  },
});

const ObservationsList = ({
  navigation,
}: NativeNavigationProp<"ObservationList">) => {
  const [{ observations, status }] = useAllObservations();

  useSetHeader({
    headerTitle: m.observationListTitle,
    headerRight: () => <SettingsButton />,
  });

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

export default ObservationsList;
