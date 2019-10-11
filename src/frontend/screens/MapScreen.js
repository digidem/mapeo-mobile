// @flow
import * as React from "react";
import { View, Text } from "react-native";

import debug from "debug";
import { NavigationActions } from "react-navigation";

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
      navigation.navigate(
        "NewObservation",
        {},
        NavigationActions.navigate({ routeName: "CategoryChooser" })
      );
    },
    [navigation, newDraft]
  );

  let viewContent;
  if (loading || status === "loading") {
    viewContent = (
      <Loading title="Cargando…" description="Cargando mapa y observaciones" />
    );
  } else if (error || status === "error") {
    viewContent = <Text>Error</Text>;
  } else {
    viewContent = (
      <MapView
        location={location}
        observations={observations}
        onAddPress={handleAddPress}
        onPressObservation={handleObservationPress}
        styleURL={styleURL}
      />
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {viewContent}
      <HomeHeader navigation={navigation} />
    </View>
  );
};

export default MapScreen;
