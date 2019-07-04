// @flow
import React from "react";
import { ScrollView, View, Text, StyleSheet, TextInput } from "react-native";
import { withNavigationFocus } from "react-navigation";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

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
import { BLACK, LIGHT_GREY, LIGHT_BLUE } from "../../lib/styles";

import type { PresetWithFields } from "../../context/PresetsContext";

const LocationView = ({ longitude, latitude, accuracy }) => (
  <View style={styles.locationContainer}>
    {longitude === undefined || latitude === undefined ? (
      <Text>Searching...</Text>
    ) : (
      <>
        <MaterialIcons
          size={14}
          name="location-on"
          color="orange"
          style={{ marginRight: 5 }}
        />
        <FormattedCoords
          style={styles.locationText}
          lat={latitude}
          lon={longitude}
        />
        {accuracy && (
          <Text style={styles.accuracy}>{" ±" + accuracy.toFixed(2) + "m"}</Text>
        )}
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
    <TextButton
      containerStyle={styles.changeButton}
      textStyle={styles.changeButtonText}
      onPress={onPress}
      title="Cambiar"
    />
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
    backgroundColor: LIGHT_GREY,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 5,
    paddingBottom: 5
  },
  locationText: {
    color: BLACK,
    fontWeight: "bold"
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
    marginTop: 10,
    marginBottom: 10
  },
  categoryIcon: {
    flex: 0
  },
  categoryName: {
    color: BLACK,
    fontSize: 20,
    marginLeft: 10,
    fontWeight: "bold",
    flex: 1
  },
  changeButton: {
    padding: 0
  },
  changeButtonText: {
    color: LIGHT_BLUE,
    paddingTop: 5,
    fontSize: 12,
    fontWeight: "500"
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
