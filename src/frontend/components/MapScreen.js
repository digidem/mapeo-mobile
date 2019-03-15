// @flow

import React from "react";
import { View } from "react-native";

import MapView from "./MapView";
import ObservationsContext from "../context/ObservationsContext";

const MapScreen = () => (
  <View style={{ flex: 1 }}>
    <ObservationsContext.Consumer>
      {({ observations }) => (
        <MapView observations={observations} onPressObservation={console.log} />
      )}
    </ObservationsContext.Consumer>
  </View>
);

export default MapScreen;
