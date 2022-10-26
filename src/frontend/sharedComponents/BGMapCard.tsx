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
import api from "../api";
import { ACTIVE_MAP_IMPORTS } from "../screens/Settings/MapSettings/BackgroundMaps";

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

function bytesToMegabytes(bytes: number) {
  return bytes / 2 ** 20;
}

interface BGMapCardProps {
  isSelected: boolean;
  mapStyleInfo: MapServerStyleInfo;
  onImportError?: () => void;
}

export const BGMapCard = ({
  isSelected,
  mapStyleInfo,
  onImportError,
}: BGMapCardProps) => {
  const activeImport = ACTIVE_MAP_IMPORTS.get(mapStyleInfo.id);

  const { formatMessage: t } = useIntl();
  const { position } = React.useContext(LocationContext);

  const [importStatus, setImportStatus] = React.useState<ImportStatus>(null);
  const [bytesStored, setBytesStored] = React.useState(
    activeImport?.id ? 0 : mapStyleInfo.bytesStored
  );

  const importComplete = importStatus?.status === "complete";

  const eventSourceUrl = React.useMemo(
    () =>
      !importComplete && activeImport?.id
        ? api.maps.getImportProgressUrl(activeImport.id)
        : undefined,
    [activeImport?.id, importComplete]
  );

  const createEventSourceOptions = React.useCallback(
    (_cancel: () => void) => {
      return {
        // TODO: Ideally throttle this but can't get it to work with Lodash
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

              ACTIVE_MAP_IMPORTS.delete(mapStyleInfo.id);

              api.maps
                .getStyleList()
                .then(list => {
                  const styleInfoAfterImport = list.find(
                    styleInfo => styleInfo.id === mapStyleInfo.id
                  );

                  if (styleInfoAfterImport) {
                    setBytesStored(styleInfoAfterImport.bytesStored);
                  }
                })
                .catch(err => {
                  console.error(err);
                });

              break;
            }
            case "error": {
              throw new Error("Error occurred during import");
            }
          }
        },
        onclose() {
          console.log("CLOSED");
        },
        onerror(err: Error) {
          console.error(err);

          if (activeImport) {
            ACTIVE_MAP_IMPORTS.set(mapStyleInfo.id, {
              id: activeImport.id,
              error: true,
            });
          }

          setImportStatus(prev => ({ ...(prev || {}), status: "error" }));

          if (onImportError) onImportError();
        },
      };
    },
    [activeImport, onImportError]
  );

  useEventSource(eventSourceUrl, createEventSourceOptions);

  const showBytesStored =
    bytesStored > 0 &&
    (!activeImport?.id || importStatus?.status === "complete");

  return (
    <View style={[styles.container]}>
      <MapboxGL.MapView
        styleURL={mapStyleInfo.url}
        compassEnabled={false}
        zoomEnabled={false}
        logoEnabled={false}
        scrollEnabled={false}
        style={[styles.map]}
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
      <View style={[styles.infoContainer]}>
        <Text style={[styles.text, { fontWeight: "bold" }]}>
          {mapStyleInfo.name || t(m.unnamedStyle)}
        </Text>

        {showBytesStored && (
          <Text style={[styles.text, { color: DARK_GREY }]}>
            {bytesToMegabytes(bytesStored).toFixed(2)} {t(m.abbrevMegabyte)}
          </Text>
        )}

        {activeImport?.id && (
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
            {importStatus?.status === "error" && <Text>Error Occurred</Text>}
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

const styles = StyleSheet.create({
  container: {
    borderColor: MEDIUM_GREY,
    borderWidth: 1,
    borderRadius: 2,
    flexDirection: "row",
    minHeight: 100,
  },
  infoContainer: {
    padding: 10,
    backgroundColor: LIGHT_GREY,
    flex: 1,
  },
  text: {
    fontSize: 14,
  },
  map: {
    width: 84,
  },
  separator: {
    height: 10,
  },
});
