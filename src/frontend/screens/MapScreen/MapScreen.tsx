import * as React from "react";
import { View } from "react-native";
import debug from "debug";

import Text from "../../sharedComponents/Text";
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
import { CompositeScreenProps } from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { AppStackList, HomeTabsList } from "../../Navigation/AppStack";
import { StackScreenProps } from "@react-navigation/stack";
import { NativeHomeTabsNavigationProps } from "../../sharedTypes";
const log = debug("mapeo:MapScreen");

export const MapScreen = ({
  navigation,
}: NativeHomeTabsNavigationProps<"Map">) => {
  const [, { newDraft }] = useDraftObservation();
  const { styleType, styleUrl } = useMapStyle();

  const [experiments] = useExperiments();

  const sheetRef = React.useRef<BottomSheetMethods>(null);

  const [{ observations, status }] = React.useContext(ObservationsContext);
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
    <View style={{ flex: 1 }}>
      {styleType === "loading" ? (
        <Loading />
      ) : status === "error" ? (
        <Text>Error</Text>
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
        <React.Fragment>
          <BGMapButton openSheet={() => sheetRef.current?.snapTo(1)} />
          <BGMapSelector
            // To do: Set map style here (useMapStyle needs to be updated)
            onMapSelected={() => {}}
            ref={sheetRef}
            closeSheet={() => sheetRef.current?.close()}
          />
        </React.Fragment>
      )}
    </View>
  );
};

interface BGMapButtonProps {
  /** `openSheet()` should NOT come from `useBottomSheetModal` */
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
