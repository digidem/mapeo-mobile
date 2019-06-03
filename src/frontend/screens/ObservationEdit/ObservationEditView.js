// @flow
import React from "react";
import { ScrollView, View, Text, StyleSheet, TextInput } from "react-native";
import { withNavigationFocus } from "react-navigation";

import LocationField from "../../sharedComponents/LocationField";
import FormattedCoords from "../../sharedComponents/FormattedCoords";
import BottomSheet from "./BottomSheet";
import Field from "./Field";
import {
  CameraIcon,
  DetailsIcon,
  CategoryCircleIcon
} from "../../sharedComponents/icons";
import ThumbnailScrollView from "../../sharedComponents/ThumbnailScrollView";
import TextButton from "../../sharedComponents/TextButton";
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
    <TextButton onPress={onPress} title="Cambiar" />
  </View>
);

const PhotosView = withDraft(["photos"])(ThumbnailScrollView);

const DescriptionField = withNavigationFocus(({ isFocused }) => (
  <Field fieldKey="notes">
    {({ value, onChange }) => (
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={onChange}
        placeholder="¿Qué está pasando aquí?"
        placeholderTextColor="silver"
        underlineColorAndroid="transparent"
        multiline
        autoFocus={isFocused && !value}
        scrollEnabled={false}
        textContentType="none"
      />
    )}
  </Field>
));

type Props = {
  onPressCategory: () => any,
  onPressCamera: () => any,
  onPressDetails: () => any,
  onPressPhoto: (index: number) => any,
  isNew: boolean,
  preset?: PresetWithFields
};

export const ObservationEdit = ({
  isNew,
  preset,
  onPressCategory,
  onPressCamera,
  onPressDetails,
  onPressPhoto
}: Props) => {
  const bottomSheetItems = [
    {
      icon: <CameraIcon />,
      label: "Agregar Foto",
      onPress: onPressCamera
    }
  ];
  if (preset && preset.fields && preset.fields.length) {
    // Only show the option to add details if preset fields are defined.
    bottomSheetItems.push({
      icon: <DetailsIcon />,
      label: "Llenar Detalles",
      onPress: onPressDetails
    });
  }
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollViewContent}
      >
        {isNew && (
          <LocationField locked={!isNew}>
            {fieldProps => <LocationView {...fieldProps} />}
          </LocationField>
        )}
        <CategoryView preset={preset} onPress={onPressCategory} />
        <DescriptionField />
        <PhotosView onPressPhoto={onPressPhoto} />
      </ScrollView>
      <BottomSheet items={bottomSheetItems} />
    </View>
  );
};

export default React.memo<Props>(ObservationEdit);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignContent: "stretch"
  },
  scrollViewContent: {
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
  textInput: {
    flex: 1,
    minHeight: 100,
    fontSize: 20,
    padding: 20,
    color: "black",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    textAlignVertical: "top"
  }
});
