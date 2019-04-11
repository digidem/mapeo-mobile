// @flow
import React from "react";
import { View } from "react-native";

import MapView from "../components/MapView";
import ObservationsContext from "../context/ObservationsContext";

type Props = {
  onAddPress: () => void
};

const MapScreen = ({ onAddPress }: Props) => (
  <View style={{ flex: 1 }}>
    <ObservationsContext.Consumer>
      {({ observations }) => (
        <MapView observations={observations} onAddPress={onAddPress} />
      )}
    </ObservationsContext.Consumer>
  </View>
);

export default MapScreen;
