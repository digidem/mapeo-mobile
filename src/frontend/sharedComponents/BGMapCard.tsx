import * as React from "react";
import { defineMessages, useIntl } from "react-intl";
import { StyleSheet, View, Text } from "react-native";
import MapboxGL from "@react-native-mapbox-gl/maps";
import { Bar } from "react-native-progress";

import { MapServerStyleInfo } from "../sharedTypes";
import { LIGHT_GREY, MAPEO_BLUE, MEDIUM_GREY } from "../lib/styles";
import LocationContext from "../context/LocationContext";
import { useMapImportProgress } from "../hooks/useMapImportProgress";
import { Pill } from "./Pill";
import { CUSTOM_MAP_ID, DEFAULT_MAP_ID } from "../hooks/useMapStyles";

const m = defineMessages({
  currentMap: {
    id: "sharedComponents.BGMapCard.currentMap",
    defaultMessage: "Current Map",
  },
  abbrevMegabyte: {
    id: "sharedComponents.BGMapCard.abbrevMegabyte",
    defaultMessage: "MB",
    description: "The abbreviation for megabyte",
  },
  unnamedStyle: {
    id: "sharedComponents.BGMapCard.unamedStyle",
    defaultMessage: "Unnamed Style",
    description: "The name for the default map style",
  },
  waitingForImport: {
    id: "sharedComponents.BGMapCard.waitingForImport",
    defaultMessage: "Waiting for import…",
    description:
      "Progress bar message indicating that import is waiting to start",
  },
  importInProgress: {
    id: "sharedComponents.BGMapCard.importInProgress",
    defaultMessage: "Import in progress…",
    description: "Progress bar message about the import being in progress",
  },
  errorOccurred: {
    id: "sharedComponents.BGMapCard.errorOccurred",
    defaultMessage: "Error occurred",
    description: "Message describing that error occurred for map import",
  },
});

function bytesToMegabytes(bytes: number) {
  return bytes / 2 ** 20;
}

const WithTopSeparation = ({ children }: React.PropsWithChildren<{}>) => (
  <View style={{ marginTop: 10 }}>{children}</View>
);

interface BGMapCardProps extends MapServerStyleInfo {
  isImporting: boolean;
  isSelected: boolean;
  onPress?: () => void;
}

export const BGMapCard = ({
  isImporting,
  isSelected,
  name,
  bytesStored,
  id: styleId,
  url: styleUrl,
}: BGMapCardProps) => {
  const { formatMessage: t } = useIntl();
  const { position } = React.useContext(LocationContext);

  const importInfo = useMapImportProgress(styleId);

  const showBytesStored =
    styleId !== DEFAULT_MAP_ID && styleId !== CUSTOM_MAP_ID && !isImporting;
  const showProgressBar = importInfo && importInfo.status !== "error";
  const showProgressBarMessage =
    importInfo?.status === "idle" || importInfo?.status === "progress";

  return (
    <View style={styles.container}>
      <MapboxGL.MapView
        styleURL={styleUrl}
        compassEnabled={false}
        zoomEnabled={false}
        logoEnabled={false}
        scrollEnabled={false}
        style={styles.mapPreview}
      >
        <MapboxGL.Camera
          zoomLevel={0}
          centerCoordinate={
            position
              ? [position.coords.longitude, position.coords.latitude]
              : undefined
          }
          animationDuration={0}
          animationMode={"linearTo"}
          allowUpdates={true}
        />
      </MapboxGL.MapView>
      <View style={styles.infoContainer}>
        <Text style={[styles.text, { fontWeight: "500" }]}>
          {name || t(m.unnamedStyle)}
        </Text>

        {showBytesStored && (
          <Text style={[styles.text, { color: MEDIUM_GREY }]}>
            {bytesToMegabytes(bytesStored).toFixed(0)} {t(m.abbrevMegabyte)}
          </Text>
        )}

        {importInfo && (
          <WithTopSeparation>
            {showProgressBar && (
              <Bar
                indeterminate={importStatus.status === "idle"}
                color={MAPEO_BLUE}
                width={null}
                progress={
                  importStatus.status === "idle"
                    ? undefined
                    : importInfo.progress
                }
              />
            )}
            {showProgressBarMessage && (
              <WithTopSeparation>
                <Text style={styles.text}>
                  {importStatus.status === "progress"
                    ? t(m.importInProgress)
                    : t(m.waitingForImport)}
                </Text>
              </WithTopSeparation>
            )}
          </WithTopSeparation>
        )}

        {importStatus.status === "error" && (
          <WithTopSeparation>
            <Text style={styles.text}>{t(m.errorOccurred)}</Text>
          </WithTopSeparation>
        )}

        {isSelected && (
          <WithTopSeparation>
            <Pill text={m.currentMap} />
          </WithTopSeparation>
        )}
      </View>
    </View>
  );
};

const borderRadius = 8;

const styles = StyleSheet.create({
  container: {
    borderColor: LIGHT_GREY,
    borderRadius,
    overflow: "hidden",
    flexDirection: "row",
    minHeight: 100,
  },
  infoContainer: {
    padding: 10,
    backgroundColor: LIGHT_GREY,
    borderWidth: 0.5,
    borderRightWidth: 1,
    borderBottomRightRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    flex: 3,
  },
  text: { fontSize: 14 },
  mapPreview: {
    flex: 1,
    maxWidth: 100,
  },
});
