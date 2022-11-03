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
import { useBottomSheetModal } from "../../../sharedComponents/BottomSheetModal";

const m = defineMessages({
  removeMap: {
    id: "screens.Settings.MapSettings.BackgroundMapInfo.removeMap",
    defaultMessage: "Remove Map",
  },
  cancel: {
    id: "screens.Settings.MapSettings.BackgroundMapInfo.cancel",
    defaultMessage: "Cancel",
  },
  subtitle: {
    id: "screens.Settings.MapSettings.BackgroundMapInfo.subtitle",
    defaultMessage:
      "This map and offline areas attached to it will be deleted. This cannot be undone",
  },
  mb: {
    id: "screens.Settings.MapSettings.BackgroundMapInfo.mb",
    defaultMessage: "MB",
    description: "abbreviation for megabyte",
  },
  zoomRange: {
    id: "screens.Settings.MapSettings.BackgroundMapInfo.zoomRange",
    defaultMessage: "Zoom Range",
    description:
      "Shows the user the range of zoom available for an offline map",
  },
  maxZoom: {
    id: "screens.Settings.MapSettings.BackgroundMapInfo.maxZoom",
    defaultMessage: "Max Zoom",
    description: "Shows the user the max zoom for an offline map",
  },
  minZoom: {
    id: "screens.Settings.MapSettings.BackgroundMapInfo.minZoom",
    defaultMessage: "Min Zoom",
    description: "Shows the user the min zoom for an offline map",
  },
  description: {
    id: "screens.Settings.MapSettings.BackgroundMapInfo.description",
    defaultMessage: "Level of Detail",
  },
  deleteMap: {
    id: "screens.Settings.MapSettings.BackgroundMapInfo.deleteMap",
    defaultMessage: "Delete Map",
  },
  useMap: {
    id: "screens.Settings.MapSettings.BackgroundMapInfo.useMap",
    defaultMessage: "Use Map",
  },
  // lvlOfDetail0to1: {
  //   id: "screens.Settings.MapSettings.BackgroundMapInfo.lvlOfDetail0to1",
  //   defaultMessage: "Whole world",
  // },
  // lvlOfDetail2: {
  //   id: "screens.Settings.MapSettings.BackgroundMapInfo.lvlOfDetail2",
  //   defaultMessage: "Subcontinental area ",
  // },
  // lvlOfDetail3to4: {
  //   id: "screens.Settings.MapSettings.BackgroundMapInfo.lvlOfDetail3to4",
  //   defaultMessage: "Largest country",
  // },
  // lvlOfDetail5: {
  //   id: "screens.Settings.MapSettings.BackgroundMapInfo.lvlOfDetail5",
  //   defaultMessage: "Large African country",
  // },
  // lvlOfDetail6: {
  //   id: "screens.Settings.MapSettings.BackgroundMapInfo.lvlOfDetail6",
  //   defaultMessage: "Large European country",
  // },
  // lvlOfDetail7to8: {
  //   id: "screens.Settings.MapSettings.BackgroundMapInfo.lvlOfDetail7to8",
  //   defaultMessage: "Small country, US state",
  // },
  // lvlOfDetail9: {
  //   id: "screens.Settings.MapSettings.BackgroundMapInfo.lvlOfDetail9",
  //   defaultMessage: "Wide area, large metropolitan area",
  // },
  // lvlOfDetail10: {
  //   id: "screens.Settings.MapSettings.BackgroundMapInfo.lvlOfDetail10",
  //   defaultMessage: "Metropolitan area",
  // },
  // lvlOfDetail11: {
  //   id: "screens.Settings.MapSettings.BackgroundMapInfo.lvlOfDetail11",
  //   defaultMessage: "City",
  // },
  // lvlOfDetail12: {
  //   id: "screens.Settings.MapSettings.BackgroundMapInfo.lvlOfDetail12",
  //   defaultMessage: "Town, or city district",
  // },
  // lvlOfDetail13to14: {
  //   id: "screens.Settings.MapSettings.BackgroundMapInfo.lvlOfDetail13to14",
  //   defaultMessage: "Village, or suburb",
  // },
  // lvlOfDetail15: {
  //   id: "screens.Settings.MapSettings.BackgroundMapInfo.lvlOfDetail15",
  //   defaultMessage: "Small road",
  // },
  // lvlOfDetail16: {
  //   id: "screens.Settings.MapSettings.BackgroundMapInfo.lvlOfDetail16",
  //   defaultMessage: "Street",
  // },
  // lvlOfDetail17: {
  //   id: "screens.Settings.MapSettings.BackgroundMapInfo.lvlOfDetail17",
  //   defaultMessage: "Block, park, addresses",
  // },
  // lvlOfDetail18: {
  //   id: "screens.Settings.MapSettings.BackgroundMapInfo.lvlOfDetail18",
  //   defaultMessage: "Some buildings, trees",
  // },
  // lvlOfDetail19: {
  //   id: "screens.Settings.MapSettings.BackgroundMapInfo.lvlOfDetail19",
  //   defaultMessage: "Local highway and crossing details",
  // },
  // lvlOfDetail20: {
  //   id: "screens.Settings.MapSettings.BackgroundMapInfo.lvlOfDetail20",
  //   defaultMessage: "A mid-sized building",
  // },
});

type Zoom = (number | undefined)[] | "loading";

// To Do: Get level of detail from programs team
export const BackgroundMapInfo = ({
  route,
  navigation,
}: NativeRootNavigationProps<"BackgroundMapInfo">) => {
  const { formatMessage: t } = useIntl();
  const { bytesStored, id, styleUrl, name } = route.params;
  const [zoom, setZoom] = React.useState<Zoom>("loading");

  const { closeSheet, openSheet, sheetRef } = useBottomSheetModal({
    openOnMount: false,
  });

  const { setStyleId } = useMapStyle();

  function setStyleAndNavigateHome() {
    setStyleId(id);
    navigation.navigate("Home", { screen: "Map" });
  }

  React.useEffect(() => {
    api.maps
      .getStyle(id)
      .then(style => {
        let tileSetIds: string[] = [];
        for (const source of Object.values(style.sources)) {
          if ("url" in source && source.url) {
            const url = new URL(source.url);

            if (url.pathname.startsWith("/tilesets/")) {
              const splitPathname = url.pathname.split("/");
              tileSetIds.push(splitPathname[splitPathname.length - 1]);
            }
          }
        }
        // Promise.allSettled does not work in React Native
        // See https://github.com/facebook/react-native/issues/30236
        return allSettled(tileSetIds.map(id => api.maps.getTileset(id)));
      })
      .then(tileJson => {
        const initialVal: (undefined | number)[] = [undefined, undefined];
        const zoomRanges: (undefined | number)[] = tileJson.reduce(
          (ranges, tilePromise) => {
            if (!("value" in tilePromise)) return ranges;
            const tile = tilePromise.value;

            if (tile.minzoom) {
              const min = ranges[0];
              if (min === undefined || tile.minzoom < min) {
                ranges[0] = tile.minzoom;
              }
            }

            if (tile.maxzoom) {
              const max = ranges[1];
              if (max === undefined || tile.maxzoom > max) {
                ranges[1] = tile.maxzoom;
              }
            }

            return ranges;
          },
          initialVal
        );

        setZoom(zoomRanges);

        if (zoomRanges[0] === undefined && zoomRanges[1] === undefined)
          throw new Error("no zoom range available");
      })
      .catch(err => {
        console.log(err);
      });
  }, [id]);

  const [min, max] = zoom !== "loading" ? zoom : [undefined, undefined];

  return (
    <React.Fragment>
      <View style={{ flex: 1, backgroundColor: WHITE, paddingBottom: 20 }}>
        <MapboxGL.MapView
          styleURL={styleUrl}
          compassEnabled={false}
          zoomEnabled={false}
          logoEnabled={false}
          scrollEnabled={false}
          style={{ height: "55%" }}
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
          ) : min && max ? (
            <Text>{`${t(m.zoomRange)}: ${min} - ${max}`}</Text>
          ) : min && !max ? (
            <Text>{`${t(m.minZoom)}: ${min}`}</Text>
          ) : !min && max ? (
            <Text>{`${t(m.maxZoom)}: ${max}`}</Text>
          ) : null}

          {id !== DEFAULT_MAP_ID && (
            <Button
              style={styles.button}
              fullWidth
              variant="outlined"
              onPress={openSheet}
            >
              <View style={styles.deleteButtonContainer}>
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
        mapName={name}
        mapId={id}
        closeSheet={closeSheet}
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
  deleteButtonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

function allSettled<T>(promises: Promise<T>[]) {
  return Promise.all(
    promises.map(promise => {
      return promise
        .then(value => ({ state: "fulfilled", value }))
        .catch(reason => ({ state: "rejected", reason }));
    })
  );
}
