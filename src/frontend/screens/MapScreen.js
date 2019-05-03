// @flow
import * as React from "react";
import { View } from "react-native";
import MapboxGL from "@react-native-mapbox/maps";

import MapView from "../sharedComponents/MapView";
import ObservationsContext from "../context/ObservationsContext";
import { getMapStyleUrl, checkMapStyle } from "../api";

type Props = {
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

const MapScreen = ({ onAddPress, navigation }: Props) => (
  <View style={{ flex: 1 }}>
    <ObservationsContext.Consumer>
      {({ observations }) => (
        <MapStyleProvider>
          {styleURL => (
            <MapView
              observations={observations}
              onAddPress={onAddPress}
              onPressObservation={(observationId: string) =>
                navigation.navigate("Observation", { observationId })
              }
              styleURL={styleURL}
            />
          )}
        </MapStyleProvider>
      )}
    </ObservationsContext.Consumer>
  </View>
);

export default MapScreen;
