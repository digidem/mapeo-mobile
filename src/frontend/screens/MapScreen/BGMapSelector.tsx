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
import LocationContext from "../../context/LocationContext";
import { useNavigationFromRoot } from "../../hooks/useNavigationWithTypes";
import { useMapStyles } from "../../hooks/useMapStyles";
import MapThumbnail from "../../sharedComponents/MapThumbnail";

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

interface MapSelectorProps {
  /** Should NOT come from `useBottomSheet()` */
  closeSheet: () => void;
}

/** `ref` should NOT come from - `useBottomSheet()` */
export const BGMapSelector = React.forwardRef<
  BottomSheetMethods,
  MapSelectorProps
>(({ closeSheet }, ref) => {
  const { navigate } = useNavigationFromRoot();

  const { status, styles: stylesList, setSelectedStyleId } = useMapStyles();

  const [snapPoints, setSnapPoints] = React.useState<(number | string)[]>([
    0,
    "40%",
  ]);

  const { formatMessage: t } = useIntl();

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
        <View style={{ backgroundColor: WHITE }}>
          <Text style={styles.title}> {t(m.title)}</Text>
          {status === "loading" ? (
            <View style={{ margin: 40 }}>
              <Loading />
            </View>
          ) : status === "success" ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  closeSheet();
                  navigate("MapSettings");
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
                {stylesList
                  .filter(({ isImporting }) => !isImporting)
                  .map(({ id, url, name }) => (
                    <MapCard
                      key={id}
                      onMapSelected={() => {
                        closeSheet();
                        console.log("ID", id);
                        setSelectedStyleId(id);
                      }}
                      styleUrl={url}
                      title={name}
                    />
                  ))}
              </ScrollView>
            </>
          ) : null}
        </View>

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

const MapCard = ({
  onMapSelected,
  styleUrl,
  title,
}: {
  onMapSelected: () => void;
  styleUrl: string;
  title: string | null;
}) => {
  return (
    <View>
      <TouchableHighlight
        activeOpacity={0.8}
        onPress={onMapSelected}
        style={{ width: 80, margin: 10 }}
      >
        <MapThumbnail styleUrl={styleUrl} style={styles.thumbnail} />
      </TouchableHighlight>
      {title && (
        <Text style={styles.thumbnailTitle} numberOfLines={1}>
          {title}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    display: "flex",
    width: "100%",
    height: "auto",
    flexDirection: "row",
    backgroundColor: WHITE,
    paddingBottom: 20,
  },
  thumbnail: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 32,
    textAlign: "center",
    paddingBottom: 20,
  },
  thumbnailTitle: {
    textAlign: "center",
    fontSize: 16,
    maxWidth: 80,
  },
});
