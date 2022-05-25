import * as React from "react";
import { StyleSheet, View, Text } from "react-native";
import MapboxGL from "@react-native-mapbox-gl/maps";
import { defineMessages, useIntl } from "react-intl";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import {
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

import Loading from "../../sharedComponents/Loading";
import { LIGHT_GREY, MEDIUM_BLUE, WHITE } from "../../lib/styles";
import Button from "../../sharedComponents/Button";
import { useNavigation } from "react-navigation-hooks";
import LocationContext from "../../context/LocationContext";

const m = defineMessages({
  title: {
    id: "sharedComponents.BGMapSelector.title",
    defaultMessage: "Background Maps",
    description: "Title for the background map selector",
  },
  close: {
    id: "sharedComponents.BGMapSelector.close",
    defaultMessage: "Close",
  },
  manageMaps: {
    id: "sharedComponents.BGMapSelector.manageMaps",
    defaultMessage: "Manage Maps",
  },
});

// To do: We should get this all from one central place
// Perhaps as a Seperate Module published on npm
interface MapServerStyle {
  id: string;
  styleUrl: string;
  title?: string;
}
interface MapSelectorProps {
  /** Should NOT come from `useBottomSheet()` */
  closeSheet: () => void;
  onMapSelected: (styleURL: string) => void;
}

/** `ref` should NOT come from - `useBottomSheet()` */
export const BGMapSelector = React.forwardRef<
  BottomSheetMethods,
  MapSelectorProps
>(({ closeSheet, onMapSelected }, ref) => {
  const [bgMapsList, setBgMapList] = React.useState<null | MapServerStyle[]>(
    null
  );

  const { navigate } = useNavigation();

  const [snapPoints, setSnapPoints] = React.useState<(number | string)[]>([
    0,
    "40%",
  ]);

  const { formatMessage: t } = useIntl();

  React.useEffect(() => {
    // To do: Api call to get list styles
    async function getListStyles(): Promise<MapServerStyle[]> {
      return [
        {
          id: "121",
          styleUrl: MapboxGL.StyleURL.Street,
        },
        {
          id: "7aj1",
          styleUrl: MapboxGL.StyleURL.Street,
        },
        {
          id: "as121",
          styleUrl: MapboxGL.StyleURL.Street,
        },
        {
          id: "7afaj1",
          styleUrl: MapboxGL.StyleURL.Street,
        },
        {
          id: "12eagg1",
          styleUrl: MapboxGL.StyleURL.Street,
        },
        {
          id: "7af323j1",
          styleUrl: MapboxGL.StyleURL.Street,
        },
      ];
    }

    getListStyles().then(stylesList => {
      setBgMapList(stylesList);
    });
  }, []);

  return (
    <BottomSheet
      ref={ref}
      snapPoints={snapPoints}
      backdropComponent={BottomSheetBackdrop}
      enableContentPanningGesture={false}
      enableHandlePanningGesture={false}
      handleHeight={0}
      handleComponent={() => null}
    >
      <View
        onLayout={e => {
          const { height } = e.nativeEvent.layout;
          setSnapPoints([0, height]);
        }}
        style={{ padding: 20 }}
      >
        {bgMapsList === null ? (
          <Loading />
        ) : (
          <View style={{ backgroundColor: WHITE }}>
            <Text style={styles.title}> {t(m.title)}</Text>
            <TouchableOpacity
              onPress={() => {
                navigate("MapSettings");
              }}
              style={{
                borderWidth: 1,
                borderColor: "red",
                alignSelf: "center",
                flex: 0,
              }}
            >
              <Text
                style={{
                  color: MEDIUM_BLUE,
                  fontSize: 16,
                  textAlign: "center",
                  marginBottom: 10,
                  fontWeight: "bold",
                }}
              >
                {t(m.manageMaps)}
              </Text>
            </TouchableOpacity>
            <View
              style={{
                borderBottomColor: LIGHT_GREY,
                borderBottomWidth: 1,
                marginBottom: 10,
                marginTop: 10,
              }}
            />
            <ScrollView style={styles.flexContainer} horizontal={true}>
              {bgMapsList?.map(mapStyle => (
                <MapThumbnail
                  onMapSelected={onMapSelected}
                  map={mapStyle}
                  key={mapStyle.id}
                />
              ))}
            </ScrollView>
          </View>
        )}

        <Button
          fullWidth
          variant="outlined"
          style={{ margin: 20 }}
          onPress={closeSheet}
        >
          {t(m.close)}
        </Button>
      </View>
    </BottomSheet>
  );
});

const MapThumbnail = ({
  map,
  onMapSelected,
}: {
  map: MapServerStyle;
  onMapSelected: (styleURL: string) => void;
}) => {
  const { position } = React.useContext(LocationContext);

  return (
    <TouchableHighlight
      activeOpacity={0.8}
      onPress={() => onMapSelected(map.styleUrl)}
      style={{ width: 80, margin: 10 }}
    >
      <MapboxGL.MapView
        compassEnabled={false}
        zoomEnabled={false}
        logoEnabled={false}
        scrollEnabled={false}
        styleURL={map.styleUrl}
        style={[styles.thumbnail]}
      >
        <MapboxGL.Camera
          animationDuration={0}
          animationMode="linearTo"
          centerCoordinate={
            position
              ? [position.coords.longitude, position.coords.latitude]
              : [0, 0]
          }
          allowUpdates
        />
      </MapboxGL.MapView>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    display: "flex",
    width: "100%",
    height: "auto",
    flexDirection: "row",
    backgroundColor: WHITE,
  },
  thumbnail: {
    width: "100%",
    height: 80,
  },
  title: {
    fontSize: 32,
    textAlign: "center",
    paddingBottom: 20,
  },
});
