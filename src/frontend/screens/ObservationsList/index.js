// @flow
import React from "react";
import type { NavigationScreenConfigProps } from "react-navigation";

import ObservationsListView from "./ObservationsListView";
import ObservationsContext from "../../context/ObservationsContext";
import PresetsContext from "../../context/PresetsContext";

class ObservationsList extends React.Component<NavigationScreenConfigProps> {
  static navigationOptions = {
    title: "Observaciones"
  };

  navigateToObservation = (observationId: string) => {
    const { navigation } = this.props;
    navigation.navigate("Observation", { observationId });
  };

  render() {
    return (
      <ObservationsContext.Consumer>
        {({ observations }) => (
          <PresetsContext.Consumer>
            {({ getPreset }) => (
              <ObservationsListView
                observations={observations}
                onPressObservation={this.navigateToObservation}
                getPreset={getPreset}
              />
            )}
          </PresetsContext.Consumer>
        )}
      </ObservationsContext.Consumer>
    );
  }
}

export default ObservationsList;
