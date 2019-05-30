// @flow
import * as React from "react";
import { View } from "react-native";
import MapboxGL from "@react-native-mapbox/maps";
import { withNavigationFocus } from "react-navigation";
import type { NavigationScreenConfigProps } from "react-navigation";

import MapView from "../sharedComponents/MapView";
import ObservationsContext from "../context/ObservationsContext";
import LocationContext from "../context/LocationContext";
import { getMapStyleUrl, checkMapStyle } from "../api";

type Props = {
  ...$Exact<NavigationScreenConfigProps>,
  isFocused: boolean,
  onAddPress: () => void
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
      const offlineStyleURL = getMapStyleUrl("default");
      // Check if the mapStyle exists on the server
      await checkMapStyle("default");
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

  render() {
    const { onAddPress, isFocused } = this.props;
    if (!isFocused) return null;
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
                      onAddPress={onAddPress}
                      onPressObservation={this.handleObservationPress}
                      styleURL={styleURL}
                    />
                  )}
                </MapStyleProvider>
              )}
            </LocationContext.Consumer>
          )}
        </ObservationsContext.Consumer>
      </View>
    );
  }
}

export default withNavigationFocus(MapScreen);
