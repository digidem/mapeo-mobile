import React from "react";
import ObservationsContext from "../context/ObservationsContext";
import ObservationsList from "./ObservationsList";

const ObservationList = () => (
  <ObservationsContext.Consumer>
    {({ observations }) => (
      <ObservationsList
        observations={observations}
        onPressObservation={console.log}
      />
    )}
  </ObservationsContext.Consumer>
);

export default ObservationList;
