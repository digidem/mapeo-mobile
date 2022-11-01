import * as React from "react";
import { defineMessages, useIntl } from "react-intl";
import { StyleSheet, View, Text } from "react-native";
import MapboxGL from "@react-native-mapbox-gl/maps";
import { EventSourceMessage } from "@microsoft/fetch-event-source";
import { Bar } from "react-native-progress";

import { DARK_GREY, LIGHT_GREY, MAPEO_BLUE, MEDIUM_GREY } from "../lib/styles";
import { MapServerStyleInfo } from "../sharedTypes";
import { Pill } from "./Pill";
import LocationContext from "../context/LocationContext";
import { useEventSource } from "../hooks/useEventSource";
import { useMapImportBackgrounder } from "../hooks/useBackgroundedMapImports";
import api from "../api";
import { DEFAULT_MAP_ID } from "../screens/Settings/MapSettings/BackgroundMaps";

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
    description: "Message indicating that import is waiting to start",
  },
  importInProgress: {
    id: "sharedComponents.BGMapCard.importInProgress",
    defaultMessage: "Import in progress…",
    description: "Message about the import being in progress",
  },
});

type ImportStatus =
  | { status: "error"; soFar?: number; total?: number }
  | {
      status: "progress" | "complete";
      soFar: number;
      total: number;
    }
  | null;

function shouldShowProgressBar(
  importStatus: ImportStatus
): importStatus is {
  status: "progress" | "complete";
  soFar: number;
  total: number;
} | null {
  return (
    importStatus === null ||
    (importStatus.status !== "error" && importStatus.status !== "complete")
  );
}

function showBytesStored(
  mapStyleInfo: MapServerStyleInfo,
  activeImportId?: string,
  importStatus?: ImportStatus
) {
  // Map is default map
  if (mapStyleInfo.id === DEFAULT_MAP_ID) return false;

  // Map import has started but has not yet been completed
  if (
    (activeImportId && !importStatus) ||
    (importStatus && importStatus.status !== "complete")
  )
    return false;

  // Map has zero byte count
  if (mapStyleInfo.bytesStored === 0) return false;

  return true;
}

function bytesToMegabytes(bytes: number) {
  return bytes / 2 ** 20;
}

interface BGMapCardProps {
  activeImportId?: string;
  isSelected: boolean;
  mapStyleInfo: MapServerStyleInfo;
  onImportComplete?: () => void;
  onImportError?: () => void;
}

export const BGMapCard = ({
  activeImportId,
  isSelected,
  mapStyleInfo,
  onImportComplete,
  onImportError,
}: BGMapCardProps) => {
  const { formatMessage: t } = useIntl();
  const { position } = React.useContext(LocationContext);

  const [importStatus, setImportStatus] = React.useState<ImportStatus>(null);

  useMapImportBackgrounder(mapStyleInfo.id, activeImportId);

  const importComplete = importStatus?.status === "complete";

  const eventSourceUrl = React.useMemo(
    () =>
      !importComplete && activeImportId
        ? api.maps.getImportProgressUrl(activeImportId)
        : undefined,
    [activeImportId, importComplete]
  );

  const createEventSourceOptions = React.useCallback(
    (cancel: () => void) => ({
      onmessage: (message: EventSourceMessage) => {
        const data = JSON.parse(message.data);

        switch (data.type) {
          case "progress": {
            setImportStatus(prev => {
              if (!prev) {
                return {
                  status: "progress",
                  soFar: data.soFar,
                  total: data.total,
                };
              }

              if (
                prev.status === "progress" &&
                prev.soFar === data.soFar &&
                prev.total === data.total
              ) {
                return prev;
              }

              return {
                status: "progress",
                soFar: data.soFar,
                total: data.total,
              };
            });

            break;
          }
          case "complete": {
            setImportStatus({
              status: "complete",
              soFar: data.soFar,
              total: data.total,
            });

            if (onImportComplete) onImportComplete();

            break;
          }
          case "error": {
            throw new Error("Error occurred during import");
          }
        }
      },
      onerror(err: Error) {
        console.error(err);

        setImportStatus(prev => ({ ...(prev || {}), status: "error" }));

        if (onImportError) onImportError();

        cancel();
      },
    }),
    [onImportComplete, onImportError]
  );

  useEventSource(eventSourceUrl, createEventSourceOptions);

  return (
    <View style={[styles.container]}>
      <MapboxGL.MapView
        styleURL={mapStyleInfo.url}
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
              ? [position?.coords.longitude, position?.coords.latitude]
              : undefined
          }
          animationDuration={0}
          animationMode={"linearTo"}
          allowUpdates={true}
        />
      </MapboxGL.MapView>
      <View style={styles.infoContainer}>
        <Text style={[styles.text, { fontWeight: "500" }]}>
          {mapStyleInfo.name || t(m.unnamedStyle)}
        </Text>

        {showBytesStored(mapStyleInfo, activeImportId, importStatus) && (
          <Text style={[styles.text, { color: MEDIUM_GREY }]}>
            {bytesToMegabytes(mapStyleInfo.bytesStored).toFixed(0)}{" "}
            {t(m.abbrevMegabyte)}
          </Text>
        )}

        {activeImportId && (
          <>
            {shouldShowProgressBar(importStatus) && (
              <View style={{ marginTop: 10 }}>
                <Bar
                  indeterminate={!importStatus}
                  color={MAPEO_BLUE}
                  width={null}
                  progress={
                    importStatus
                      ? importStatus.soFar / importStatus.total
                      : undefined
                  }
                />
              </View>
            )}
            {(importStatus === null || importStatus.status === "progress") && (
              <View style={{ marginTop: 10 }}>
                <Text>
                  {importStatus ? t(m.importInProgress) : t(m.waitingForImport)}
                </Text>
              </View>
            )}
            {importStatus?.status === "error" && (
              <Text style={styles.text}>Error Occurred</Text>
            )}
          </>
        )}
        {isSelected && (
          <View style={{ marginTop: 10 }}>
            <Pill text={m.currentMap} />
          </View>
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
    borderWidth: 1,
    overflow: "hidden",
    flexDirection: "row",
    minHeight: 100,
  },
  infoContainer: {
    padding: 10,
    backgroundColor: LIGHT_GREY,
    borderWidth: 1,
    borderColor: MEDIUM_GREY,
    borderBottomRightRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    flex: 3,
  },
  text: {
    fontSize: 14,
  },
  mapPreview: {
    flex: 1,
    maxWidth: 100,
  },
});
