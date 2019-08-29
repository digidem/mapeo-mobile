// @flow
import * as React from "react";
import { View } from "react-native";

import debug from "debug";
import { NavigationActions } from "react-navigation";

import MapView from "../sharedComponents/MapView";
import MapStyleProvider from "../sharedComponents/MapStyleProvider";
import HomeHeader from "../sharedComponents/HomeHeader";
import useDraftObservation from "../hooks/useDraftObservation";
import useAllObservations from "../hooks/useAllObservations";
import LocationContext from "../context/LocationContext";
import type { NavigationProp } from "../types";

const log = debug("mapeo:MapScreen");

type Props = {
  navigation: NavigationProp
};

const MapScreen = ({ navigation }: Props) => {
  const [, { newDraft }] = useDraftObservation();
  const [{ observations }] = useAllObservations();
  const location = React.useContext(LocationContext);

  const handleObservationPress = (observationId: string) =>
    navigation.navigate("Observation", { observationId });

  const handleAddPress = (e: any) => {
    log("pressed add button");
    newDraft(undefined, { tags: {} });
    navigation.navigate(
      "NewObservation",
      {},
      NavigationActions.navigate({ routeName: "CategoryChooser" })
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <MapStyleProvider>
        {styleURL => (
          <MapView
            location={location}
            observations={observations}
            onAddPress={handleAddPress}
            onPressObservation={handleObservationPress}
            styleURL={styleURL}
          />
        )}
      </MapStyleProvider>
      <HomeHeader navigation={navigation} />
    </View>
  );
};

export default MapScreen;
