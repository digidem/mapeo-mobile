// @flow
import * as React from "react";
import { View } from "react-native";

import debug from "debug";
import {
  NavigationActions,
  type NavigationScreenConfigProps
} from "react-navigation";

import MapView from "../sharedComponents/MapView";
import MapStyleProvider from "../sharedComponents/MapStyleProvider";
import HomeHeader from "../sharedComponents/HomeHeader";
import ObservationsContext from "../context/ObservationsContext";
import LocationContext from "../context/LocationContext";
import {
  withDraft,
  type DraftObservationContext as DraftContextType
} from "../context/DraftObservationContext";


const log = debug("mapeo:MapScreen");

type Props = {
  ...$Exact<NavigationScreenConfigProps>,
  newDraft: $ElementType<DraftContextType, "newDraft">
};

class MapScreen extends React.Component<Props> {
  handleObservationPress = (observationId: string) =>
    this.props.navigation.navigate("Observation", { observationId });

  handleAddPress = (e: any) => {
    log("pressed add button");
    const { newDraft, navigation } = this.props;
    newDraft({ tags: {} });
    navigation.navigate(
      "NewObservation",
      {},
      NavigationActions.navigate({ routeName: "CategoryChooser" })
    );
  };

  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <ObservationsContext.Consumer>
          {({ observations }) => (
            <LocationContext.Consumer>
              {location => (
                <MapStyleProvider>
                  {styleURL => (
                    <MapView
                      location={location}
                      observations={observations}
                      onAddPress={this.handleAddPress}
                      onPressObservation={this.handleObservationPress}
                      styleURL={styleURL}
                    />
                  )}
                </MapStyleProvider>
              )}
            </LocationContext.Consumer>
          )}
        </ObservationsContext.Consumer>
        <HomeHeader navigation={navigation} />
      </View>
    );
  }
}

export default withDraft(["newDraft"])(MapScreen);
