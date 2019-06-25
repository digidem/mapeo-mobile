// @flow
import React from "react";
import { Text, View, ScrollView, StyleSheet, Share } from "react-native";
import MapboxGL from "@react-native-mapbox-gl/maps";
import ShareMedia from "react-native-share";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import isNil from 'lodash/isNil';

import api from "../../api";
import MapStyleProvider from "../../sharedComponents/MapStyleProvider";
import FormattedCoords from "../../sharedComponents/FormattedCoords";
import ThumbnailScrollView from "../../sharedComponents/ThumbnailScrollView";
import { CategoryCircleIcon } from "../../sharedComponents/icons";
import mapIcon from "../../images/mapeo-icon-transparent.png";
import { formatDate, formatCoords } from "../../lib/utils";
import { filterPhotosFromAttachments } from "../../context/DraftObservationContext";
import {
  BLACK,
  RED,
  WHITE,
  DARK_GREY,
  LIGHT_GREY,
  MEDIUM_GREY
} from "../../lib/styles";
import { TouchableOpacity } from "../../sharedComponents/Touchables";
import type { PresetWithFields } from "../../context/PresetsContext";
import type { Observation } from "../../context/ObservationsContext";

type ButtonProps = {
  onPress: () => any,
  color: string,
  iconName: "delete" | "share",
  title: string
};

type MapProps = {
  lon: number,
  lat: number
};

const MapFeatures = ({ lat, lon }: MapProps) => {
  const featureCollection = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [lon, lat]
        },
        properties: {
          id: Date.now()
        }
      }
    ]
  };
  return (
    <MapboxGL.ShapeSource id="observation-source" shape={featureCollection}>
      <MapboxGL.SymbolLayer
        id="observation-symbol"
        style={{
          iconImage: mapIcon,
          iconSize: 0.5,
          iconAnchor: 'bottom'
        }}
      />
    </MapboxGL.ShapeSource>
  );
};

const InsetMapView = ({ lon, lat }: MapProps) => (
  <MapStyleProvider>
    {styleURL => (
      <MapboxGL.MapView
        style={styles.map}
        zoomEnabled={false}
        logoEnabled={false}
        scrollEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}
        compassEnabled={false}
        styleURL={styleURL}
      >
        <MapboxGL.Camera centerCoordinate={[lon, lat]} zoomLevel={15} />
        <MapFeatures lat={lat} lon={lon} />
      </MapboxGL.MapView>
    )}
  </MapStyleProvider>
);

const Button = ({ onPress, color, iconName, title }: ButtonProps) => (
  <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
    <View style={styles.button}>
      <MaterialIcons
        size={30}
        name={iconName}
        color={DARK_GREY}
        style={styles.buttonIcon}
      />
      <Text style={styles.buttonText}>{title}</Text>
    </View>
  </TouchableOpacity>
);

const FieldView = ({ label, answer, style }) => (
  <View style={style}>
    <Text style={styles.fieldTitle}>{label}</Text>
    <Text
      style={[
        styles.fieldAnswer,
        { color: answer === undefined ? MEDIUM_GREY : DARK_GREY }
      ]}
    >
      {answer || "Sin respuesta"}
    </Text>
  </View>
);

type ODVProps = {|
  observation: Observation,
  preset?: PresetWithFields,
  onPressPhoto: (photoIndex: number) => any,
  onPressDelete: () => any
|};

class ObservationView extends React.Component<ODVProps> {
  handleShare = () => {
    const { observation, preset } = this.props;
    const { value } = observation;
    const msg = formatShareMessage({ observation, preset });

    if (value.attachments && value.attachments.length) {
      const urls = value.attachments.map(a =>
        api.getMediaFileUri(a.id, "preview")
      );
      const options = {
        urls: urls,
        message: msg,
        subject: "Alerta de Mapeo"
      };
      ShareMedia.open(options);
    } else Share.share({ message: msg });
  };

  render() {
    const { observation, preset, onPressPhoto, onPressDelete } = this.props;
    const { lat, lon, attachments } = observation.value;
    // Currently only show photo attachments
    const photos = filterPhotosFromAttachments(attachments);
    return (
      <ScrollView style={styles.container}>
        <>
          {!isNil(lat) && !isNil(lon) && (
            <View>
              <View style={styles.coords}>
                <View style={styles.coordsPointer} />
                <FormattedCoords
                  lon={lon}
                  lat={lat}
                  style={styles.positionText}
                />
              </View>
              <InsetMapView lat={lat} lon={lon} />
            </View>
          )}
          <View>
            <Text style={styles.time}>
              {formatDate(observation.created_at)}
            </Text>
          </View>
          <View style={styles.section}>
            <View style={styles.categoryIconContainer}>
              <CategoryCircleIcon iconId={(preset || {}).icon} size="medium" />
              <Text style={styles.categoryLabel} numberOfLines={1}>
                {preset ? preset.name : "Observacion"}
              </Text>
            </View>
            <View style={{ paddingVertical: 15 }}>
              <Text style={styles.textNotes}>
                {observation.value.tags.notes}
              </Text>
            </View>
            {!!photos.length && (
              <ThumbnailScrollView
                photos={photos}
                onPressPhoto={onPressPhoto}
              />
            )}
          </View>
          {preset && preset.fields && preset.fields.length > 0 && (
            <View>
              <>
                {preset.fields.map(({ label, key }) => (
                  <FieldView
                    key={key}
                    label={label || key}
                    answer={observation.value.tags[key]}
                    style={[styles.section, styles.optionalSection]}
                  />
                ))}
              </>
            </View>
          )}
          <View style={styles.divider}></View>
          <View style={styles.buttonContainer}>
            <Button
              iconName="share"
              title="Compartir"
              color="#3366FF"
              onPress={this.handleShare}
            />
            <Button
              iconName="delete"
              title="Borrar"
              color={RED}
              onPress={onPressDelete}
            />
          </View>
        </>
      </ScrollView>
    );
  }
}

export default ObservationView;

function formatShareMessage({
  observation,
  preset
}: {
  observation: Observation,
  preset?: PresetWithFields
}) {
  const { value } = observation;
  let msg = "";
  if (preset && preset.name) msg += "— *" + preset.name + "* —\n";
  msg += formatDate(observation.created_at) + "\n";
  if (value.lat != null && value.lon != null)
    msg += formatCoords({ lon: value.lon, lat: value.lat }) + "\n";
  if (value.tags.notes) msg += "\n" + value.tags.notes + "\n";
  const completedFields =
    preset &&
    preset.fields &&
    preset.fields.filter(f => typeof value.tags[f.key] !== "undefined");
  if (completedFields && completedFields.length) {
    msg +=
      "\n" +
      completedFields
        .map(f => "_" + f.label + ":_\n" + value.tags[f.key])
        .join("\n") +
      "\n";
  }
  msg += "\n— _Enviado desde MAPEO_ —";
  return msg;
}

const styles = StyleSheet.create({
  categoryIconContainer: {
    alignItems: "center",
    flexDirection: "row"
  },
  categoryLabel: {
    color: BLACK,
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: 10
  },
  container: {
    backgroundColor: WHITE,
    flex: 1,
    flexDirection: "column"
  },
  map: {
    height: 175
  },
  coords: {
    zIndex: 10,
    position: "absolute",
    alignSelf: "center",
    alignItems: "center",
    borderRadius: 15,
    right: 15,
    left: 15,
    bottom: 15,
    paddingTop: 0,
    paddingBottom: 10,
    backgroundColor: WHITE
  },
  coordsPointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderLeftColor: "transparent",
    borderRightWidth: 10,
    borderRightColor: "transparent",
    borderBottomWidth: 10,
    borderBottomColor: WHITE,
    top: -10
  },
  divider: {
    backgroundColor: LIGHT_GREY,
    paddingVertical: 15
  },
  positionText: {
    fontSize: 12,
    color: BLACK,
    fontWeight: "700"
  },
  section: {
    flex: 1,
    marginHorizontal: 15,
    paddingVertical: 15
  },
  optionalSection: {
    borderTopColor: LIGHT_GREY,
    borderTopWidth: 1
  },
  textNotes: {
    fontSize: 22,
    color: DARK_GREY,
    fontWeight: "100",
    marginLeft: 10
  },
  time: {
    color: BLACK,
    backgroundColor: LIGHT_GREY,
    fontSize: 14,
    paddingVertical: 10,
    textAlign: "center"
  },
  fieldAnswer: {
    fontSize: 20,
    fontWeight: "100"
  },
  fieldTitle: {
    color: BLACK,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10
  },
  button: {
    alignItems: "center"
  },
  buttonIcon: {},
  buttonText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 5
  },
  buttonContainer: {
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-around"
  }
});
