import * as React from "react";
import { StyleSheet, View, Text } from "react-native";
import MapboxGL from "@react-native-mapbox-gl/maps";
import { defineMessages, useIntl } from "react-intl";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import { ScrollView } from "react-native-gesture-handler";

import Loading from "./Loading";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import bottomSheetModal from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetModal";

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
});

// To do: We should get this all from one central place
// Perhaps as a Seperate Module published on npm
interface mapServerStyle {
  id: string;
  styleUrl: string;
  title?: string;
}

interface MapSelectorProps {
  /** Should come from `useBottomSheet()` */
  closeSheet: () => void;
}

/**
 * `ref` should come from - `useBottomSheet()`
 */
export const BGMapSelector = React.forwardRef<
  bottomSheetModal,
  MapSelectorProps
>(({ closeSheet }, ref) => {
  const [bgMapsList, setBgMapList] = React.useState<null | mapServerStyle[]>(
    null
  );
  const snapPoints = React.useMemo(() => ["0%", "20%"], []);

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
  }, []);

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal ref={ref} snapPoints={snapPoints}>
        <Text> {t(m.title)}</Text>
        <ScrollView style={styles.flexContainer} horizontal={true}>
          {bgMapsList?.map(mapStyle => (
            <MapThumbnail map={mapStyle} key={mapStyle.id} />
          ))}
        </ScrollView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
});

const MapThumbnail = ({ map }: { map: mapServerStyle }) => {
  return (
    <View style={{ width: 80, margin: 10 }}>
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
          allowUpdates={false}
        />
      </MapboxGL.MapView>
    </View>
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
});
