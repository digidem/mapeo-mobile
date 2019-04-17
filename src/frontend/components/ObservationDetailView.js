// @flow
import React from "react";
import { Text, Image, View, ScrollView, StyleSheet } from "react-native";

import FormattedCoords from "./FormattedCoords";
import ThumbnailScrollView from "./ThumbnailScrollVIew";
import InsetMapView from "./InsetMapView";
import ObservationIcon from "./ObservationIcon";
import LocationIcon from "./icons/LocationIcon";
// import UserIcon from "./icons/UserIcon";
// import CameraIcon from "./icons/CameraIcon";
import EditIcon from "./icons/EditIcon";
import type { PresetWithFields } from "../context/PresetsContext";
import type { Observation } from "../context/ObservationsContext";

const styles = StyleSheet.create({
  categoryIconContainer: {
    alignSelf: "center",
    position: "absolute",
    top: 25
  },
  categoryPin: {
    alignSelf: "center",
    width: 80,
    height: 85,
    marginTop: 5
  },
  container: {
    backgroundColor: "white",
    flex: 1,
    flexDirection: "column"
  },
  positionText: {
    fontSize: 12,
    color: "black",
    fontWeight: "700"
  },
  section: {
    borderBottomColor: "lightgray",
    borderBottomWidth: 1,
    flex: 1
  },
  sectionText: {
    color: "black",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 15,
    marginLeft: 10,
    marginTop: 15
  },
  textNotes: {
    color: "black",
    fontSize: 18,
    fontWeight: "700",
    margin: 20,
    textAlign: "center"
  },
  time: {
    color: "grey",
    fontSize: 12,
    fontWeight: "300",
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
  }
});

const FieldView = ({ label, answer }) => (
  <View style={{ marginLeft: 15 }}>
    <Text style={styles.fieldTitle}>{label}</Text>
    <Text style={styles.fieldAnswer}>{answer || "Not entered"}</Text>
  </View>
);

type ODVProps = {
  observation: Observation,
  preset?: PresetWithFields
};

const ObservationDetailView = ({ observation, preset = {} }: ODVProps) => {
  const { lat, lon, attachments } = observation.value;
  const photos =
    attachments && attachments.filter(a => a.type === "image/jpeg");
  console.log(observation.value);
  return (
    <ScrollView style={styles.container}>
      <>
        <Image
          source={require("../images/category-pin.png")}
          style={styles.categoryPin}
        />
        <View style={styles.categoryIconContainer}>
          <ObservationIcon iconId={preset.icon} />
        </View>
        {lat != null && lon != null && (
          <View style={{ flexDirection: "row", alignSelf: "center" }}>
            <FormattedCoords lon={lon} lat={lat} style={styles.positionText} />
          </View>
        )}
        <Text style={styles.time}>{observation.createdAt}</Text>
        <View style={styles.section}>
          <Text style={styles.textNotes}>{observation.value.tags.notes}</Text>
        </View>
        {lat != null && lon != null && (
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
        )}
        {/* $FlowFixMe - not sure why flow is not getting this type */}
        {photos && <ThumbnailScrollView photos={photos} />}
        {preset.fields && preset.fields.length && (
          <View style={styles.section}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 15
              }}
            >
              <EditIcon size={20} />
              <Text style={styles.sectionText}>Details</Text>
            </View>
            <>
              {preset.fields.map(({ label, key }) => (
                <FieldView
                  key={label}
                  label={label}
                  answer={observation.value.tags[key]}
                />
              ))}
            </>
          </View>
        )}
      </>
    </ScrollView>
  );
};

export default ObservationDetailView;
