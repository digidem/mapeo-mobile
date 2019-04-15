// @flow
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TouchableNativeFeedback } from "react-native-gesture-handler";

import LocationField from "./LocationField";
import FormattedCoords from "./FormattedCoords";
import ObservationIcon from "./ObservationIcon";
import Thumbnail from "./Thumbnail";
import Circle from "./Circle";
import { VERY_LIGHT_BLUE } from "../lib/styles";
import { withDraft } from "../context/DraftObservationContext";

import type { Preset } from "../context/PresetsContext";
import type { Photo } from "../context/DraftObservationContext";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignContent: "stretch"
  },
  locationContainer: {
    flex: 0,
    backgroundColor: "#dddddd",
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: 5
  },
  accuracy: {
    fontWeight: "bold"
  },
  categoryContainer: {
    flex: 0,
    flexDirection: "row",
    alignItems: "center",
    alignContent: "stretch",
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10
  },
  categoryIcon: {
    flex: 0
  },
  categoryName: {
    fontWeight: "bold",
    marginLeft: 15,
    flex: 1
  },
  categoryButton: {
    flex: 0,
    padding: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  categoryButtonText: {
    color: "blue"
  },
  descriptionContainer: {
    minHeight: 200,
    flex: 0
  },
  photosContainer: {
    backgroundColor: "#dddddd",
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10
  }
});

const LocationView = ({ longitude, latitude, accuracy }) => (
  <View style={styles.locationContainer}>
    {longitude === undefined ||
    latitude === undefined ||
    accuracy === undefined ? (
      <Text>Searching...</Text>
    ) : (
      <>
        <FormattedCoords lat={latitude} lon={longitude} />
        <Text style={styles.accuracy}>{"±" + accuracy.toFixed(2) + "m"}</Text>
      </>
    )}
  </View>
);

const CategoryView = ({
  preset = {},
  onPress
}: {
  preset: Preset,
  onPress: () => void
}) => (
  <View style={styles.categoryContainer}>
    <View style={styles.categoryIcon}>
      <Circle>
        <ObservationIcon iconId={preset.icon} />
      </Circle>
    </View>
    <Text style={styles.categoryName}>{preset.name || "Observation"}</Text>
    <TouchableNativeFeedback
      style={styles.categoryButton}
      background={TouchableNativeFeedback.Ripple(VERY_LIGHT_BLUE, true)}
      onPress={onPress}
    >
      <Text style={styles.categoryButtonText}>Change</Text>
    </TouchableNativeFeedback>
  </View>
);

const PhotosView = withDraft(["photos"])(({ photos }: { photos: Photo[] }) => (
  <View style={styles.photosContainer}>
    {photos
      .filter(photo => !photo.deleted)
      .map((photo, index) => (
        <Thumbnail key={index} {...photo} />
      ))}
  </View>
));

type Props = {
  onPressCategory: () => void,
  onPressCamera: () => void,
  isNew: boolean,
  preset: Preset
};

const ObservationEdit = ({ isNew, preset, onPressCategory }: Props) => (
  <View style={styles.container}>
    <LocationField locked={!isNew}>
      {fieldProps => <LocationView {...fieldProps} />}
    </LocationField>
    <CategoryView preset={preset} onPress={onPressCategory} />
    <View style={styles.descriptionContainer} />
    <PhotosView />
  </View>
);

export default React.memo<Props>(ObservationEdit);
