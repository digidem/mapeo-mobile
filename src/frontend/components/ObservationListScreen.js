// @flow
import React from "react";
import ObservationsContext from "../context/ObservationsContext";
import ObservationsList from "./ObservationsList";
import PresetsContext from "../context/PresetsContext";

const ObservationList = () => (
  <ObservationsContext.Consumer>
    {({ observations }) => (
      <PresetsContext.Consumer>
        {({ getPreset }) => (
          <ObservationsList
            observations={observations}
            onPressObservation={console.log}
            getPreset={getPreset}
          />
        )}
      </PresetsContext.Consumer>
    )}
  </ObservationsContext.Consumer>
);

export default ObservationList;
