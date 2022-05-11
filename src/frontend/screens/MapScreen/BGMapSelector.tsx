import * as React from "react";
import { StyleSheet, View, Text } from "react-native";
import MapboxGL from "@react-native-mapbox-gl/maps";
import { defineMessages, useIntl } from "react-intl";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

import Loading from "../../sharedComponents/Loading";
import { LIGHT_GREY, MEDIUM_BLUE } from "../../lib/styles";
import Button from "../../sharedComponents/Button";
import { useNavigation } from "react-navigation-hooks";
import { ListDivider } from "../../sharedComponents/List";
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
interface mapServerStyle {
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
  const [bgMapsList, setBgMapList] = React.useState<null | mapServerStyle[]>(
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
    async function getListStyles(): Promise<mapServerStyle[]> {
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
  }, [setBgMapList]);

  return (
    <BottomSheet
      ref={ref}
      snapPoints={snapPoints}
      backdropComponent={BottomSheetBackdrop}
      enableContentPanningGesture={false}
      enableHandlePanningGesture={false}
      handleHeight={0}
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
          <React.Fragment>
            <Text style={styles.title}> {t(m.title)}</Text>
            <TouchableOpacity
              onPress={() => {
                navigate("MapSettings");
              }}
            >
              <Text
                style={{
                  color: MEDIUM_BLUE,
                  fontSize: 16,
                  textAlign: "center",
                  marginBottom: 10,
                }}
              >
                {t(m.manageMaps)}
              </Text>
            </TouchableOpacity>
            <ListDivider style={{ marginBottom: 10 }} />
            <ScrollView style={styles.flexContainer} horizontal={true}>
              {bgMapsList?.map(mapStyle => (
                <MapThumbnail
                  onMapSelected={onMapSelected}
                  map={mapStyle}
                  key={mapStyle.id}
                />
              ))}
            </ScrollView>
          </React.Fragment>
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
  map: mapServerStyle;
  onMapSelected: (styleURL: string) => void;
}) => {
  const { position } = React.useContext(LocationContext);
  return (
    <TouchableOpacity
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
          centerCoordinate={[
            position?.coords.longitude,
            position?.coords.latitude,
          ]}
          allowUpdates={false}
        />
      </MapboxGL.MapView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    display: "flex",
    width: "100%",
    height: "auto",
    flexDirection: "row",
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
  divider: {
    borderBottomColor: LIGHT_GREY,
  },
});
