// @flow
import React from "react";
import { Text, Image, View, ScrollView, StyleSheet, Share } from "react-native";
import ShareMedia from "react-native-share";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import api from "../../api";
import FormattedCoords from "../../sharedComponents/FormattedCoords";
import ThumbnailScrollView from "../../sharedComponents/ThumbnailScrollView";
import { CategoryIcon } from "../../sharedComponents/icons";
import { formatDate, formatCoords } from "../../lib/utils";
import { filterPhotosFromAttachments } from "../../context/DraftObservationContext";
import { BLACK, RED, WHITE, DARK_GREY, LIGHT_GREY } from "../../lib/styles";
import { TouchableOpacity } from "../../sharedComponents/Touchables";
import type { PresetWithFields } from "../../context/PresetsContext";
import type { Observation } from "../../context/ObservationsContext";
import debug from "debug";

// const InsetMapView = ({ style }) => <View style={[style, styles.insetMap]} />;

const log = debug("mapeo:ObservationView");

type ButtonProps = {
  onPress: () => any,
  color: string,
  iconName: "delete" | "share",
  title: string
};

const Button = ({ onPress, color, iconName, title }: ButtonProps) => (
  <TouchableOpacity onPress={onPress} style={{flex: 1}}>
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

const FieldView = ({ label, answer }) => (
  <View style={{ marginLeft: 15 }}>
    <Text style={styles.fieldTitle}>{label}</Text>
    <Text
      style={[
        styles.fieldAnswer,
        { color: answer === undefined ? "gray" : "black" }
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
  onPressDelete: () => any,
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
    log('Preset > ', preset);
    const { lat, lon, attachments } = observation.value;
    // Currently only show photo attachments
    const photos = filterPhotosFromAttachments(attachments);
    return (
      <ScrollView style={styles.container}>
        <>
          {lat != null && lon != null && (
            <View style={{ flexDirection: "row", alignSelf: "center" }}>
              <FormattedCoords
                lon={lon}
                lat={lat}
                style={styles.positionText}
              />
            </View>
          )}
          <View>
            <Text style={styles.time}>{formatDate(observation.created_at)}</Text>
          </View>
          <View style={styles.section}>
            <View style={styles.categoryIconContainer}>
              <CategoryIcon iconId={(preset || {}).icon} />
              <Text style={styles.categoryLabel} numberOfLines={1}>
                {preset ? preset.name : "Observacion"}
              </Text>
            </View>
            <View style={{paddingVertical: 15}}>
              <Text style={styles.textNotes}>{observation.value.tags.notes}</Text>
            </View>
          {/* Not including this until we have a map here
        lat != null && lon != null && (
          <View style={styles.section}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 15
              }}
            >
              <LocationIcon size={20} />
              <FormattedCoords lon={lon} lat={lat} style={styles.sectionText} />
            </View>
            <InsetMapView style={{ height: 240 }} />
          </View>
        ) */}
          {!!photos.length && (
            <ThumbnailScrollView photos={photos} onPressPhoto={onPressPhoto} />
          )}
          </View>
          {preset && preset.fields && preset.fields.length > 0 && (
            <View style={[styles.section, styles.optionalSection]}>
              <>
                {preset.fields.map(({ label, key }) => (
                  <FieldView
                    key={key}
                    label={label || key}
                    answer={observation.value.tags[key]}
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
    alignItems: 'center',
    flexDirection: 'row'
  },
  categoryLabel: {
    color: BLACK,
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 10
  },
  container: {
    backgroundColor: "white",
    flex: 1,
    flexDirection: "column"
  },
  divider: {
    backgroundColor: LIGHT_GREY,
    paddingVertical: 15
  },
  positionText: {
    fontSize: 12,
    color: "black",
    fontWeight: "700"
  },
  section: {
    flex: 1,
    marginHorizontal: 15,
    paddingVertical: 15
  },
  optionalSection: {
    borderBottomColor: "lightgray",
    borderBottomWidth: 1,
  },
  textNotes: {
    fontSize: 22,
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
    color: "black",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 7,
    marginBottom: 15
  },
  fieldTitle: {
    color: "black",
    fontSize: 14,
    fontWeight: "700"
  },
  button: {
    alignItems: 'center'
  },
  buttonIcon: {
  },
  buttonText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 5
  },
  buttonContainer: {
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: 'space-around'
  }
});
