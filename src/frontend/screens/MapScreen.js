// @flow
import React from "react";
import { View } from "react-native";

import MapView from "../sharedComponents/MapView";
import ObservationsContext from "../context/ObservationsContext";
import { getMapStyleUrl } from "../api";

type Props = {
  onAddPress: () => void
};

const MapScreen = ({ onAddPress }: Props) => (
  <View style={{ flex: 1 }}>
    <ObservationsContext.Consumer>
      {({ observations }) => (
        <MapView
          observations={observations}
          onAddPress={onAddPress}
          mapStyle={getMapStyleUrl("default")}
        />
      )}
    </ObservationsContext.Consumer>
  </View>
);

export default MapScreen;
