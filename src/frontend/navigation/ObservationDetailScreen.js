// @flow
import React from "react";
import ObservationsContext from "../context/ObservationsContext";
import ObservationDetailView from "../components/ObservationDetailView";
import SetNavigationParam from "../components/SetNavigationParam";
import PresetsContext from "../context/PresetsContext";

const ObservationDetailScreen = ({ navigation }) => (
  <ObservationsContext.Consumer>
    {({ observations }) => (
      <PresetsContext.Consumer>
        {({ getPreset }) => {
          const obs = observations[navigation.getParam("observationId")];
          const preset = getPreset(obs);
          return (
            <>
              <SetNavigationParam name="observationTitle" value={preset.name} />
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
