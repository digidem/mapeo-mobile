// @flow
import React from "react";
import { ScrollView, View, StyleSheet, TextInput } from "react-native";
import Text from "../../sharedComponents/Text";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { defineMessages, useIntl, FormattedMessage } from "react-intl";

import LocationField from "../../sharedComponents/LocationField";
import BottomSheet from "./BottomSheet";
import Field from "./Field";
import {
  CameraIcon,
  DetailsIcon,
  CategoryCircleIcon,
} from "../../sharedComponents/icons";
import useDraftObservation from "../../hooks/useDraftObservation";
import useSettingsValue from "../../hooks/useSettingsValue";
import ThumbnailScrollView from "../../sharedComponents/ThumbnailScrollView";
import TextButton from "../../sharedComponents/TextButton";
import { BLACK, LIGHT_GREY, LIGHT_BLUE } from "../../lib/styles";

import type { PresetWithFields, TextField } from "../../context/ConfigContext";
import {
  FormattedPresetName,
  FormattedCoords,
} from "../../sharedComponents/FormattedData";

const m = defineMessages({
  searching: {
    id: "screens.ObservationEdit.ObservationEditView.searching",
    defaultMessage: "Searching…",
    description: "Shown in new observation screen whilst looking for GPS",
  },
  changePreset: {
    id: "screens.ObservationEdit.ObservationEditView.changePreset",
    defaultMessage: "Change",
    description: "Button to change a category / preset",
  },
  descriptionPlaceholder: {
    id: "screens.ObservationEdit.ObservationEditView.descriptionPlaceholder",
    defaultMessage: "What is happening here?",
    description: "Placeholder for description/notes field",
  },
  photoButton: {
    id: "screens.ObservationEdit.ObservationEditView.photoButton",
    defaultMessage: "Add Photo",
    description: "Button label for adding photo",
  },
  detailsButton: {
    id: "screens.ObservationEdit.ObservationEditView.detailsButton",
    defaultMessage: "Add Details",
    description: "Button label to add details",
  },
});

const LocationView = ({
  longitude,
  latitude,
  accuracy,
}: {
  longitude?: number | null,
  latitude?: number | null,
  accuracy?: number,
}) => {
  const format = useSettingsValue("coordinateFormat");
  return (
    <View style={styles.locationContainer}>
      {longitude == null || latitude == null ? (
        <Text>
          <FormattedMessage {...m.searching} />
        </Text>
      ) : (
        <>
          <MaterialIcons
            size={14}
            name="location-on"
            color="orange"
            style={{ marginRight: 5 }}
          />
          <Text style={styles.locationText}>
            <FormattedCoords format={format} lat={latitude} lon={longitude} />
          </Text>
          {accuracy === undefined ? null : (
            <Text style={styles.accuracy}>
              {" ±" + accuracy.toFixed(2) + "m"}
            </Text>
          )}
        </>
      )}
    </View>
  );
};

const CategoryView = ({
  preset = {},
  onPress,
}: {
  preset?: PresetWithFields,
  onPress: () => void,
}) => {
  const { formatMessage: t } = useIntl();
  return (
    <View style={styles.categoryContainer}>
      <View style={styles.categoryIcon}>
        <CategoryCircleIcon iconId={preset.icon} />
      </View>
      <Text style={styles.categoryName}>
        <FormattedPresetName preset={preset} />
      </Text>
      <TextButton
        containerStyle={styles.changeButton}
        textStyle={styles.changeButtonText}
        onPress={onPress}
        title={t(m.changePreset)}
      />
    </View>
  );
};

const notesField: TextField = {
  id: "notes",
  type: "text",
  multiline: true,
  key: "notes",
};

const DescriptionField = () => {
  const { formatMessage: t } = useIntl();
  return (
    <Field field={notesField}>
      {({ value, onChange }) => (
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChange}
          placeholder={t(m.descriptionPlaceholder)}
          placeholderTextColor="silver"
          underlineColorAndroid="transparent"
          multiline
          autoFocus={false}
          scrollEnabled={false}
          textContentType="none"
          testID="observationDescriptionField"
        />
      )}
    </Field>
  );
};

type Props = {
  onPressCategory: () => any,
  onPressCamera: () => any,
  onPressDetails: () => any,
  onPressPhoto: (index: number) => any,
  isNew: boolean,
  preset?: PresetWithFields,
};

export const ObservationEdit = ({
  isNew,
  preset,
  onPressCategory,
  onPressCamera,
  onPressDetails,
  onPressPhoto,
}: Props) => {
  const [{ photos }] = useDraftObservation();
  const { formatMessage: t } = useIntl();
  const bottomSheetItems = [
    {
      icon: <CameraIcon />,
      label: t(m.photoButton),
      onPress: onPressCamera,
    },
  ];
  if (preset && preset.fields && preset.fields.length) {
    // Only show the option to add details if preset fields are defined.
    bottomSheetItems.push({
      icon: <DetailsIcon />,
      label: t(m.detailsButton),
      onPress: onPressDetails,
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
        <ThumbnailScrollView onPressPhoto={onPressPhoto} photos={photos} />
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
    alignContent: "stretch",
  },
  scrollViewContent: {
    flexDirection: "column",
    alignContent: "stretch",
  },
  locationContainer: {
    flex: 0,
    backgroundColor: LIGHT_GREY,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 5,
    paddingBottom: 5,
  },
  locationText: {
    color: BLACK,
    fontWeight: "bold",
  },
  accuracy: {
    fontWeight: "bold",
  },
  categoryContainer: {
    flex: 0,
    flexDirection: "row",
    alignItems: "center",
    alignContent: "stretch",
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  categoryIcon: {
    flex: 0,
  },
  categoryName: {
    color: BLACK,
    fontSize: 20,
    marginLeft: 10,
    fontWeight: "bold",
    flex: 1,
  },
  changeButton: {
    padding: 0,
  },
  changeButtonText: {
    color: LIGHT_BLUE,
    paddingTop: 5,
    fontSize: 12,
    fontWeight: "500",
  },
  textInput: {
    flex: 1,
    minHeight: 100,
    fontSize: 20,
    padding: 20,
    color: "black",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    textAlignVertical: "top",
  },
});
