import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import MapboxGL from "@react-native-mapbox-gl/maps";
import * as React from "react";
import { defineMessages, useIntl } from "react-intl";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import api from "../../../api";
import { MAPEO_BLUE, MEDIUM_GREY, WHITE } from "../../../lib/styles";
import Button from "../../../sharedComponents/Button";
import Loading from "../../../sharedComponents/Loading";
import { NativeRootNavigationProps } from "../../../sharedTypes";
import { DeleteMapBottomSheet } from "./DeleteMapBottomSheet";
import { useMapStyle } from "../../../hooks/useMapStyle";
import { convertBytesToMb, DEFAULT_MAP_ID } from "./BackgroundMaps";
import { DeleteIcon } from "../../../sharedComponents/icons";

const m = defineMessages({
  removeMap: {
    id: "screens.Settings.MapSettings.removeMap",
    defaultMessage: "Remove Map",
  },
  cancel: {
    id: "screens.Settings.MapSettings.cancel",
    defaultMessage: "Cancel",
  },
  subtitle: {
    id: "screens.Settings.MapSettings.subtitle",
    defaultMessage:
      "This map and offline areas attached to it will be deleted. This cannot be undone",
  },
  mb: {
    id: "screens.Settings.MapSettings.mb",
    defaultMessage: "MB",
    description: "abbreviation for megabyte",
  },
  zoomLevel: {
    id: "screens.Settings.MapSettings.zoomLevel",
    defaultMessage: "Zoom Level",
  },
  description: {
    id: "screens.Settings.MapSettings.description",
    defaultMessage: "Level of Detail",
  },
  deleteMap: {
    id: "screens.Settings.MapSettings.deleteMap",
    defaultMessage: "Delete Map",
  },
  useMap: {
    id: "screens.Settings.MapSettings.useMap",
    defaultMessage: "Use Map",
  },
});

// To Do: Get level of detail from programs team
export const BackgroundMapInfo = ({
  route,
  navigation,
}: NativeRootNavigationProps<"BackgroundMapInfo">) => {
  const { formatMessage: t } = useIntl();
  const { bytesStored, id, styleUrl, name } = route.params;
  const [zoom, setZoom] = React.useState<"loading" | number | null>("loading");

  const sheetRef = React.useRef<BottomSheetMethods>(null);

  const levelOfDetail = React.useMemo(() => {
    return "Level of detail";
  }, [zoom]);

  const { setStyleId } = useMapStyle();

  function setStyleAndNavigateHome() {
    setStyleId(id);
    navigation.navigate("Home", { screen: "Map" });
  }

  React.useEffect(() => {
    api.maps
      .getStyle(id)
      .then(style => {
        const tileSetIdArray = Object.values(style.sources).map(source => {
          if ("url" in source && source.url) {
            const url = source.url;
            const searchWord = "tilesets/";
            const startPosition = url.search(searchWord);
            if (startPosition === -1) return;
            const endPosition = url.length;
            return url.substring(
              startPosition + searchWord.length,
              endPosition
            );
          }
        });

        return Promise.all(
          tileSetIdArray.map(id => {
            if (id) {
              return api.maps.getTileset(id);
            }
          })
        );
      })
      .then(tileJson => {
        const maxZoom = tileJson.reduce((highest, tile) => {
          if (!tile || !tile.maxzoom) return highest;
          if (tile.maxzoom > highest) return tile.maxzoom;
          return highest;
        }, -1);

        if (maxZoom === -1) throw new Error("no max zoom available");

        setZoom(maxZoom);
      })
      .catch(err => {
        console.log(err);
        setZoom(null);
      });
  }, [id]);

  return (
    <React.Fragment>
      <View style={{ flex: 1, backgroundColor: WHITE }}>
        <MapboxGL.MapView
          styleURL={styleUrl}
          compassEnabled={false}
          zoomEnabled={false}
          logoEnabled={false}
          scrollEnabled={false}
          style={{ height: "60%" }}
        >
          <MapboxGL.Camera
            zoomLevel={0}
            animationDuration={0}
            animationMode={"linearTo"}
            allowUpdates={true}
          />
        </MapboxGL.MapView>
        <ScrollView style={styles.container}>
          {bytesStored && (
            <Text style={{ color: MEDIUM_GREY }}>
              {`${convertBytesToMb(bytesStored).toFixed(0)} ${t(m.mb)}`}
            </Text>
          )}
          {zoom === "loading" ? (
            <Loading />
          ) : zoom ? (
            <React.Fragment>
              <Text>{`${t(m.zoomLevel)}: ${zoom}`}</Text>
              <Text>{`${t(m.description)}: ${levelOfDetail}`}</Text>
            </React.Fragment>
          ) : null}

          {id !== DEFAULT_MAP_ID && (
            <Button
              style={styles.button}
              fullWidth
              variant="outlined"
              onPress={() => sheetRef.current?.snapTo(1)}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <DeleteIcon color={MAPEO_BLUE} />
                <Text style={styles.deleteButton}>{t(m.deleteMap)}</Text>
              </View>
            </Button>
          )}
          <Button
            style={[styles.button, { marginBottom: 20 }]}
            fullWidth
            onPress={setStyleAndNavigateHome}
          >
            {t(m.useMap)}
          </Button>
        </ScrollView>
      </View>

      <DeleteMapBottomSheet
        ref={sheetRef}
        closeSheet={() => {
          sheetRef.current?.close();
        }}
        mapName={name}
        mapId={id}
      />
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  button: {
    marginTop: 20,
  },
  deleteButton: {
    color: MAPEO_BLUE,
    fontWeight: "700",
    letterSpacing: 0.5,
    fontSize: 16,
  },
});
