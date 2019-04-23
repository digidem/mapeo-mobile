// @flow
import React from "react";
import type { NavigationScreenConfigProps } from "react-navigation";

import ObservationsContext from "../context/ObservationsContext";
import ObservationsList from "../components/ObservationsList";
import PresetsContext from "../context/PresetsContext";

class ObservationList extends React.Component<NavigationScreenConfigProps> {
  static navigationOptions = {
    title: "Observations"
  };

  navigateToObservation = (observationId: string) => {
    const { navigation } = this.props;
    navigation.navigate("ObservationDetail", { observationId });
  };

  render() {
    return (
      <ObservationsContext.Consumer>
        {({ observations }) => (
          <PresetsContext.Consumer>
            {({ getPreset }) => (
              <ObservationsList
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

export default ObservationList;
