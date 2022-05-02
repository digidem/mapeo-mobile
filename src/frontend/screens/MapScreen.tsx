import * as React from "react";
import { GestureResponderEvent, View } from "react-native";
import debug from "debug";

import Text from "../sharedComponents/Text";
import MapView from "../sharedComponents/Map/MapView";
import Loading from "../sharedComponents/Loading";
import { useDraftObservation } from "../hooks/useDraftObservation";
import useMapStyle from "../hooks/useMapStyle";
import ObservationsContext from "../context/ObservationsContext";
import LocationContext from "../context/LocationContext";
import { AddButton } from "../sharedComponents/AddButton";
import type { NavigationProp } from "../types";
import { BGMapSelector } from "../sharedComponents/BGMapSelector";
import IconButton from "../sharedComponents/IconButton";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { MEDIUM_GREY } from "../lib/styles";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
const log = debug("mapeo:MapScreen");

interface MapScreenProps {
  navigation: NavigationProp;
}

export const MapScreen = ({ navigation }: MapScreenProps) => {
  const [, { newDraft }] = useDraftObservation();
  const { styleURL, styleType } = useMapStyle();

  const sheetRef = React.useRef<BottomSheetModal>(null);
  const [{ observations, status }] = React.useContext(ObservationsContext);
  const location = React.useContext(LocationContext);

  const handleObservationPress = React.useCallback(
    (observationId: string) =>
      navigation.navigate("Observation", { observationId }),
    [navigation]
  );

  const handleAddPress = React.useCallback(() => {
    log("pressed add button");
    newDraft(undefined, null);
    navigation.navigate("CategoryChooser");
  }, [navigation, newDraft]);

  return (
    <View style={{ flex: 1 }}>
      {status === "loading" ? (
        <Loading />
      ) : status === "error" ? (
        <Text>Error</Text>
      ) : (
        <MapView
          location={location}
          observations={observations}
          onPressObservation={handleObservationPress}
          styleURL={styleURL}
          styleType={styleType}
        />
      )}
      <AddButton testID="addButtonMap" onPress={handleAddPress} />
      <BGMapButton
        openSheet={() => {
          sheetRef.current?.snapTo(1);
        }}
      />
      <BGMapSelector closeSheet={() => {}} ref={sheetRef} />
    </View>
  );
};

interface BGMapButtonProps {
  /** `openSheet()` should come from `useBottomSheetModal` */
  openSheet: () => void;
}

const BGMapButton = ({ openSheet }: BGMapButtonProps) => {
  return (
    <View style={{ position: "absolute", top: 100, right: 10 }}>
      <IconButton
        style={{ backgroundColor: "#fff", borderRadius: 50 }}
        onPress={openSheet}
      >
        <MaterialIcon color={MEDIUM_GREY} name="layers" size={40} />
      </IconButton>
    </View>
  );
};
