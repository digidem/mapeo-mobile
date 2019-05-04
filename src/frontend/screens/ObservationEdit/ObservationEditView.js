// @flow
import React from "react";
import { ScrollView, View, Text, StyleSheet, TextInput } from "react-native";
import { TouchableNativeFeedback } from "../../sharedComponents/Touchables";

import LocationField from "../../sharedComponents/LocationField";
import FormattedCoords from "../../sharedComponents/FormattedCoords";
import Field from "./Field";
import { CameraIcon, CategoryCircleIcon } from "../../sharedComponents/icons";
import ThumbnailScrollView from "../../sharedComponents/ThumbnailScrollView";
import { VERY_LIGHT_BLUE, LIGHT_GREY } from "../../lib/styles";
import { withDraft } from "../../context/DraftObservationContext";

import type { PresetWithFields } from "../../context/PresetsContext";

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
  preset?: PresetWithFields,
  onPress: () => void
}) => (
  <View style={styles.categoryContainer}>
    <View style={styles.categoryIcon}>
      <CategoryCircleIcon iconId={preset.icon} />
    </View>
    <Text style={styles.categoryName}>{preset.name || "Observación"}</Text>
    <TouchableNativeFeedback
      style={styles.categoryButton}
      background={TouchableNativeFeedback.Ripple(VERY_LIGHT_BLUE, true)}
      onPress={onPress}
    >
      <Text style={styles.categoryButtonText}>Cambiar</Text>
    </TouchableNativeFeedback>
  </View>
);

const PhotosView = withDraft(["photos"])(ThumbnailScrollView);

const AddPhotoButton = ({ onPress }) => (
  <TouchableNativeFeedback onPress={onPress} style={styles.addPhotoButton}>
    <View style={styles.addPhotoIcon}>
      <CameraIcon />
    </View>
    <Text style={styles.addPhotoLabel}>Agregar Foto</Text>
  </TouchableNativeFeedback>
);

const DescriptionField = () => (
  <Field fieldKey="notes">
    {({ value, onChange }) => (
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={onChange}
        placeholder="¿Qué está pasando aquí?"
        placeholderTextColor="silver"
        underlineColorAndroid="transparent"
        onBlur={() => console.log("blur")}
        multiline
        autoFocus
      />
    )}
  </Field>
);

type Props = {
  onPressCategory: () => any,
  onPressCamera: () => any,
  isNew: boolean,
  preset?: PresetWithFields
};

export const ObservationEdit = ({
  isNew,
  preset,
  onPressCategory,
  onPressCamera
}: Props) => (
  <View style={styles.container}>
    <ScrollView style={{ flex: 1 }}>
      <LocationField locked={!isNew}>
        {fieldProps => <LocationView {...fieldProps} />}
      </LocationField>
      <CategoryView preset={preset} onPress={onPressCategory} />
      <DescriptionField />
      <PhotosView />
    </ScrollView>
    <AddPhotoButton onPress={onPressCamera} />
  </View>
);

export default React.memo<Props>(ObservationEdit);

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
  addPhotoButton: {
    flex: 0,
    alignSelf: "flex-end",
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#dddddd"
  },
  addPhotoIcon: {
    flex: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 30,
    paddingRight: 30
  },
  addPhotoLabel: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 20
  },
  textInput: {
    flex: 1,
    fontSize: 20,
    padding: 20,
    paddingBottom: 30,
    color: "black",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    textAlignVertical: "top",
    backgroundColor: "white",
    borderColor: LIGHT_GREY
  }
});
