// @flow
import * as React from "react";
import { View, Text } from "react-native";

import debug from "debug";

import MapView from "../sharedComponents/MapView";
import HomeHeader from "../sharedComponents/HomeHeader";
import Loading from "../sharedComponents/Loading";
import useDraftObservation from "../hooks/useDraftObservation";
import useMapStyle from "../hooks/useMapStyle";
import ObservationsContext from "../context/ObservationsContext";
import LocationContext from "../context/LocationContext";
import type { NavigationProp } from "../types";

const log = debug("mapeo:MapScreen");

type Props = {
  navigation: NavigationProp
};

const MapScreen = ({ navigation }: Props) => {
  const [, { newDraft }] = useDraftObservation();
  const [{ styleURL, loading, error }] = useMapStyle();

  const [{ observations, status }] = React.useContext(ObservationsContext);
  const location = React.useContext(LocationContext);

  const handleObservationPress = React.useCallback(
    (observationId: string) =>
      navigation.navigate("Observation", { observationId }),
    [navigation]
  );

  const handleAddPress = React.useCallback(
    (e: any) => {
      log("pressed add button");
      newDraft(undefined, { tags: {} });
      navigation.navigate("CategoryChooser");
    },
    [navigation, newDraft]
  );

  if (status === "loading") return <Loading />;
  if (status === "error") return <Text>Error</Text>;

  return (
    <View style={{ flex: 1 }}>
      <MapView
        location={location}
        observations={observations}
        onAddPress={handleAddPress}
        onPressObservation={handleObservationPress}
        styleURL={loading ? "loading" : error ? "error" : styleURL}
      />
      <HomeHeader navigation={navigation} />
    </View>
  );
};

export default MapScreen;
