import * as React from "react";
import { defineMessages, useIntl } from "react-intl";
import { StyleSheet, View, Text } from "react-native";
import MapboxGL from "@react-native-mapbox-gl/maps";
import { EventSourceMessage } from "@microsoft/fetch-event-source";

import { LIGHT_GREY, MEDIUM_GREY } from "../lib/styles";
import { MapServerStyle, ViewStyleProp } from "../sharedTypes";
import { Pill } from "./Pill";
import LocationContext from "../context/LocationContext";
import { useEventSource } from "../hooks/useEventSource";
import api from "../api";

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
  importProgress: {
    id: "sharedComponents.BGMapCard.importProgress",
    defaultMessage: "{soFar, number} out of {total, number} assets imported",
    description:
      "Message about number of tileset assets imported so far out of total number",
  },
});

// ToDo: API calls to get styleURL, zoom level, center coordinate, etc.

interface BGMapCardProps extends MapServerStyle {
  style?: ViewStyleProp;
  onPress?: (() => void) | null;
  isSelected: boolean;
  importId?: string;
}

export const BGMapCard = ({
  name,
  style,
  isSelected,
  url,
  id,
  importId,
}: BGMapCardProps) => {
  const { formatMessage: t } = useIntl();
  const { position } = React.useContext(LocationContext);
  const [importProgress, setImportProgress] = React.useState<{
    soFar: number;
    total: number;
  } | null>(null);

  const importDone =
    importProgress !== null && importProgress.soFar === importProgress.total;

  const eventSourceUrl = React.useMemo(
    () =>
      !importDone && importId
        ? api.maps.getImportProgressUrl(importId)
        : undefined,
    [importId, importDone]
  );

  const createEventSourceOptions = React.useCallback(
    (cancel: () => void) => ({
      // TODO: Ideally throttle this but can't get it to work with Lodash
      onmessage: (message: EventSourceMessage) => {
        const data = JSON.parse(message.data);

        switch (data.type) {
          case "progress": {
            setImportProgress(prev => {
              if (prev?.soFar === data.soFar && prev?.total === data.total)
                return prev;
              return { soFar: data.soFar, total: data.total };
            });
            break;
          }
          case "complete": {
            cancel();
            break;
          }
        }
      },
      onerror(err: Error) {
        console.error(err);
        throw err;
      },
      onclose() {
        console.log("CLOSED");
      },
    }),
    []
  );

  useEventSource(eventSourceUrl, createEventSourceOptions);

  return (
    <View
      style={[
        { borderColor: MEDIUM_GREY, borderWidth: 1, borderRadius: 2 },
        style,
      ]}
    >
      <View style={[styles.container]}>
        <MapboxGL.MapView
          styleURL={url}
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
        <View style={[styles.textContainer]}>
          <Text style={[styles.text, { fontWeight: "bold" }]}>
            {name || t(m.unnamedStyle)}
          </Text>
          {isSelected && (
            <Pill containerStyle={{ marginTop: 10 }} text={m.currentMap} />
          )}
          {importProgress && <Text>{t(m.importProgress, importProgress)}</Text>}
        </View>
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
  textContainer: {
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
});
