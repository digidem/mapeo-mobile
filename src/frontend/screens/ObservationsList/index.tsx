import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import HeaderTitle from "../../sharedComponents/HeaderTitle";
import ObservationsListView from "./ObservationsListView";
import { useAllObservations } from "../../hooks/useAllObservations";
import { SettingsIcon } from "../../sharedComponents/icons";

import IconButton from "../../sharedComponents/IconButton";
import { AppStackList } from "../../Navigation/AppStack";
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

type ObservationListProps = NativeNavigationProp<"ObservationList">;

const ObservationsList = ({ navigation }: ObservationListProps) => {
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

ObservationsList.navigationOptions = {
  headerTitle: () => (
    <HeaderTitle>
      <FormattedMessage {...m.observationListTitle} />
    </HeaderTitle>
  ),
  headerRight: () => <SettingsButton />,
};

export default ObservationsList;
