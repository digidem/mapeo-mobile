// @flow
import * as React from "react";
import { View } from "react-native";
import MapboxGL from "@react-native-mapbox-gl/maps";
import debug from "debug";
import {
  NavigationActions,
  type NavigationScreenConfigProps
} from "react-navigation";

import MapView from "../sharedComponents/MapView";
import HomeHeader from "../sharedComponents/HomeHeader";
import ObservationsContext from "../context/ObservationsContext";
import LocationContext from "../context/LocationContext";
import {
  withDraft,
  type DraftObservationContext as DraftContextType
} from "../context/DraftObservationContext";
import api from "../api";

const log = debug("mapeo:MapScreen");

type Props = {
  ...$Exact<NavigationScreenConfigProps>,
  newDraft: $ElementType<DraftContextType, "newDraft">
};

class MapStyleProvider extends React.Component<
  { children: (styleURL: string) => React.Node },
  { styleURL: string }
> {
  state = {
    styleURL: MapboxGL.StyleURL.Outdoors
  };

  async componentDidMount() {
    try {
      const offlineStyleURL = api.getMapStyleUrl("default");
      // Check if the mapStyle exists on the server
      await api.getMapStyle("default");
      this.setState({ styleURL: offlineStyleURL });
    } catch (e) {
      // If we don't have a default offline style, don't do anything
    }
  }

  render() {
    return this.props.children(this.state.styleURL);
  }
}

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
