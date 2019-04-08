// @flow
import React from "react";
import { Text } from "react-native";
import type { NavigationScreenConfigProps } from "react-navigation";

import ObservationDetailView from "../components/ObservationDetailView";
import SetNavigationParam from "../components/SetNavigationParam";
import CenteredView from "../components/CenteredView";
import ObservationsContext from "../context/ObservationsContext";
import PresetsContext from "../context/PresetsContext";

// TODO: Add a better message for the user.
// In the future if we add deep-linking we could get here,
// otherwise we should never reach here unless there is a bug in the code
const ObservationNotFound = () => (
  <CenteredView>
    <Text>Observation not found</Text>
  </CenteredView>
);

const ObservationDetailScreen = ({
  navigation
}: NavigationScreenConfigProps) => (
  <ObservationsContext.Consumer>
    {({ observations }) => (
      <PresetsContext.Consumer>
        {({ getPreset }) => {
          const id = navigation.getParam("observationId");
          const obs = typeof id === "string" && observations.get(id);
          if (!obs) return <ObservationNotFound />;
          const preset = getPreset(obs);
          const title = preset ? preset.name : "Observation";
          return (
            <>
              <SetNavigationParam name="observationTitle" value={title} />
              <ObservationDetailView observation={obs} preset={preset} />
            </>
          );
        }}
      </PresetsContext.Consumer>
    )}
  </ObservationsContext.Consumer>
);

ObservationDetailScreen.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam("observationTitle") || "Observation"
});

export default ObservationDetailScreen;
