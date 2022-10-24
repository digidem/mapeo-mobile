import MapboxGL from "@react-native-mapbox-gl/maps";
import * as React from "react";
import { defineMessages, useIntl } from "react-intl";
import { StyleSheet, Text, View } from "react-native";
import api from "../../../api";

import { RED } from "../../../lib/styles";

import Loading from "../../../sharedComponents/Loading";
import { NativeRootNavigationProps } from "../../../sharedTypes";

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
    defaultMessage: "Description",
  },
});

export const BackgroundMapInfo = ({
  route,
  navigation,
}: NativeRootNavigationProps<"BackgroundMapInfo">) => {
  const { formatMessage: t } = useIntl();
  const { bytesStored, id, styleUrl } = route.params;
  const [zoomAndDescription, setZoomAndDescription] = React.useState<
    { zoom?: number; description?: string } | "loading"
  >("loading");

  React.useEffect(() => {
    api.maps
      .getTileset(id)
      .then(tileset => {
        setZoomAndDescription({
          zoom: tileset.maxzoom,
          description: tileset.description,
        });
      })
      .catch(err => {
        console.log(err);
        setZoomAndDescription({ zoom: undefined, description: undefined });
      });
  }, [id]);

  return (
    <React.Fragment>
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
      <View>
        <Text>{`${bytesStored} ${t(m.mb)}`}</Text>
        {zoomAndDescription === "loading" ? (
          <Loading />
        ) : (
          <React.Fragment>
            {zoomAndDescription.zoom && (
              <Text>{`${t(m.zoomLevel)}: ${zoomAndDescription.zoom}`}</Text>
            )}
            {zoomAndDescription.description && (
              <Text>{`${t(m.description)}: ${
                zoomAndDescription.description
              }`}</Text>
            )}
          </React.Fragment>
        )}
      </View>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
  },
  button: {
    backgroundColor: RED,
    width: 280,
    marginBottom: 20,
  },
});
