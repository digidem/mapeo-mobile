import * as React from "react";
import { defineMessages, useIntl } from "react-intl";
import { StyleSheet, View, Text } from "react-native";
import MapboxGL from "@react-native-mapbox-gl/maps";
import { EventSourceMessage } from "@microsoft/fetch-event-source";
import { Bar } from "react-native-progress";

import { MapServerStyleInfo } from "../sharedTypes";
import { LIGHT_GREY, MAPEO_BLUE, MEDIUM_GREY } from "../lib/styles";
import LocationContext from "../context/LocationContext";
import { useEventSource } from "../hooks/useEventSource";
import { useMapImportBackgrounder } from "../hooks/useBackgroundedMapImports";
import { DEFAULT_MAP_ID } from "../screens/Settings/MapSettings/BackgroundMaps";
import api from "../api";
import { Pill } from "./Pill";

class ImportError extends Error {}

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

type ImportStatus =
  | { status: "idle" }
  | { status: "error"; soFar?: number; total?: number }
  | {
      status: "progress" | "complete";
      soFar: number;
      total: number;
    };

function showProgressBar(
  importStatus: ImportStatus
): importStatus is
  | {
      status: "progress" | "complete";
      soFar: number;
      total: number;
    }
  | { status: "idle" } {
  return (
    importStatus.status === "idle" ||
    importStatus.status === "progress" ||
    importStatus.status === "complete"
  );
}

function showProgressBarMessage(
  importStatus: ImportStatus
): importStatus is
  | {
      status: "progress";
      soFar: number;
      total: number;
    }
  | { status: "idle" } {
  return importStatus.status === "idle" || importStatus.status === "progress";
}

function showBytesStored(
  mapStyleInfo: MapServerStyleInfo,
  activeImportId?: string
) {
  // Map is default map
  if (mapStyleInfo.id === DEFAULT_MAP_ID) return false;

  // Map has zero byte count
  if (mapStyleInfo.bytesStored === 0) return false;

  // Map import is still active
  if (activeImportId) return false;

  return true;
}

function bytesToMegabytes(bytes: number) {
  return bytes / 2 ** 20;
}

const WithTopSeparation = ({ children }: React.PropsWithChildren<{}>) => (
  <View style={{ marginTop: 10 }}>{children}</View>
);

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

  const [importStatus, setImportStatus] = React.useState<ImportStatus>({
    status: "idle",
  });

  useMapImportBackgrounder(mapStyleInfo.id, activeImportId);

  const eventSourceUrl = activeImportId
    ? api.maps.getImportProgressUrl(activeImportId)
    : undefined;

  const createEventSourceOptions = React.useCallback(
    (cancel: () => void) => ({
      onmessage: (message: EventSourceMessage) => {
        const data = JSON.parse(message.data);

        switch (data.type) {
          case "progress": {
            setImportStatus(prev => {
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

          // Once the map server sends this event, it will close the connection automatically
          // so it shouldn't be necessary to throw an error or cancel.
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
            throw new ImportError();
          }
        }
      },
      onerror(err: Error) {
        if (err instanceof ImportError) {
          setImportStatus(prev => ({ ...prev, status: "error" }));

          if (onImportError) {
            onImportError();
            cancel();
            return;
          }
        }

        throw err;
      },
    }),
    [onImportComplete, onImportError]
  );

  useEventSource(eventSourceUrl, createEventSourceOptions);

  return (
    <View style={styles.container}>
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
          {mapStyleInfo.name || t(m.unnamedStyle)}
        </Text>

        {showBytesStored(mapStyleInfo, activeImportId) && (
          <Text style={[styles.text, { color: MEDIUM_GREY }]}>
            {bytesToMegabytes(mapStyleInfo.bytesStored).toFixed(0)}{" "}
            {t(m.abbrevMegabyte)}
          </Text>
        )}

        {activeImportId && (
          <WithTopSeparation>
            {showProgressBar(importStatus) && (
              <Bar
                indeterminate={importStatus.status === "idle"}
                color={MAPEO_BLUE}
                width={null}
                progress={
                  importStatus.status === "idle"
                    ? undefined
                    : importStatus.soFar / importStatus.total
                }
              />
            )}
            {showProgressBarMessage(importStatus) && (
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
