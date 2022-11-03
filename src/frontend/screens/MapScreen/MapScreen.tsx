import * as React from "react";
import { StyleSheet, View } from "react-native";
import debug from "debug";

import MapView from "../../sharedComponents/Map/MapView";
import Loading from "../../sharedComponents/Loading";
import { useDraftObservation } from "../../hooks/useDraftObservation";
import { useMapStyle } from "../../hooks/useMapStyle";
import ObservationsContext from "../../context/ObservationsContext";
import LocationContext from "../../context/LocationContext";
import { AddButton } from "../../sharedComponents/AddButton";

import { BGMapSelector } from "./BGMapSelector";
import IconButton from "../../sharedComponents/IconButton";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { MEDIUM_GREY } from "../../lib/styles";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { useExperiments } from "../../hooks/useExperiments";
import { NativeHomeTabsNavigationProps } from "../../sharedTypes";

const log = debug("mapeo:MapScreen");

export const MapScreen = ({
  navigation,
}: NativeHomeTabsNavigationProps<"Map">) => {
  const [, { newDraft }] = useDraftObservation();
  const { styleType, styleUrl } = useMapStyle();

  const [experiments] = useExperiments();

  const sheetRef = React.useRef<BottomSheetMethods>(null);

  const [{ observations }] = React.useContext(ObservationsContext);
  const location = React.useContext(LocationContext);

  const handleObservationPress = React.useCallback(
    (observationId: string) =>
      navigation.navigate("Observation", { observationId }),
    [navigation]
  );

  const handleAddPress = React.useCallback(() => {
    log("pressed add button");
    newDraft(undefined, undefined);
    navigation.navigate("CategoryChooser");
  }, [navigation, newDraft]);

  return (
    <View style={styles.container}>
      {styleUrl === null ? (
        <Loading />
      ) : (
        <MapView
          location={location}
          observations={observations}
          onPressObservation={handleObservationPress}
          styleURL={styleUrl}
          styleType={styleType}
        />
      )}
      <AddButton testID="addButtonMap" onPress={handleAddPress} />
      {experiments.backgroundMaps && (
        <>
          <View style={styles.mapSelectorButtonContainer}>
            <IconButton
              style={styles.mapSelectorButton}
              onPress={() => sheetRef.current?.snapTo(1)}
            >
              <MaterialIcon color={MEDIUM_GREY} name="layers" size={40} />
            </IconButton>
          </View>
          <BGMapSelector
            ref={sheetRef}
            closeSheet={() => sheetRef.current?.close()}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapSelectorButtonContainer: {
    position: "absolute",
    top: 100,
    right: 10,
  },
  mapSelectorButton: { backgroundColor: "#fff", borderRadius: 50 },
});
