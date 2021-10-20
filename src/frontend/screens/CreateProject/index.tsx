import * as React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { NavigationStackScreenComponent } from "react-navigation-stack";

import { WHITE } from "../../lib/styles";
import Button from "../../sharedComponents/Button";
import HeaderTitle from "../../sharedComponents/HeaderTitle";
import Text from "../../sharedComponents/Text";

import { InputField } from "./InputField";
import { useInputFieldValue } from "./useInputFieldValue";

const m = defineMessages({
  createProjectTitle: {
    id: "screens.CreateProject.createProjectTitle",
    defaultMessage: "Create a Project",
    description: "Screen title for Create Project flow",
  },
  projectNameLabel: {
    id: "screens.CreateProject.projectNameLabel",
    defaultMessage: "Enter a name for the Project",
    description: "Label text for project name input field",
  },
  deviceNameLabel: {
    id: "screens.CreateProject.deviceNameLabel",
    defaultMessage: "Add a name for your device",
    description: "Label text for device name input field",
  },
  projectNamePlaceholder: {
    id: "screens.CreateProject.projectNamePlaceholder",
    defaultMessage: "Project Name",
    description: "Placeholder text for project name input field",
  },
  deviceNamePlaceholder: {
    id: "screens.CreateProject.deviceNamePlaceholder",
    defaultMessage: "Device Name",
    description: "Placeholder text for device name input field",
  },
  createProjectButton: {
    id: "screens.CreateProject.createProjectButton",
    defaultMessage: "Create Project",
    description: "Text for submit button",
  },
  projectNameError: {
    id: "screens.CreateProject.projectNameError",
    defaultMessage: "Enter Project Name",
    description: "Validation error for project name input field",
  },
  deviceNameError: {
    id: "screens.CreateProject.deviceNameError",
    defaultMessage: "Enter Device Name",
    description: "Validation error for device name input field",
  },
});

export const CreateProjectScreen: NavigationStackScreenComponent = ({
  navigation,
}) => {
  const { formatMessage: t } = useIntl();

  const [
    projectName,
    setProjectName,
    projectNameHasError,
    validateProjectName,
  ] = useInputFieldValue();
  const [
    deviceName,
    setDeviceName,
    deviceNameHasError,
    validateDeviceName,
  ] = useInputFieldValue();

  const submit = () => {
    const projectNameIsValid = validateProjectName();
    const deviceNameIsValid = validateDeviceName();

    const canSubmit = projectNameIsValid && deviceNameIsValid;

    // TODO: Handle project creation based on form details, then navigate if successful
    if (canSubmit) {
      navigation.navigate("Home");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.formContainer}>
          <InputField
            containerStyle={styles.inputFieldContainer}
            errorMessage={
              projectNameHasError && (
                <FormattedMessage {...m.projectNameError} />
              )
            }
            label={<FormattedMessage {...m.projectNameLabel} />}
            placeholder={t(m.projectNamePlaceholder)}
            onBlur={() => {
              setProjectName(projectName.trim());
              validateProjectName();
            }}
            onChangeText={setProjectName}
            value={projectName}
          />
          <InputField
            containerStyle={styles.inputFieldContainer}
            errorMessage={
              deviceNameHasError && <FormattedMessage {...m.deviceNameError} />
            }
            label={<FormattedMessage {...m.deviceNameLabel} />}
            maxLength={60}
            onBlur={() => {
              setDeviceName(deviceName.trim());
              validateDeviceName();
            }}
            onChangeText={setDeviceName}
            placeholder={t(m.deviceNamePlaceholder)}
            value={deviceName}
          />
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button fullWidth onPress={submit}>
          <Text style={styles.buttonText}>
            <FormattedMessage {...m.createProjectButton} />
          </Text>
        </Button>
      </View>
    </View>
  );
};

CreateProjectScreen.navigationOptions = {
  headerTitle: () => (
    <HeaderTitle style={{}}>
      <FormattedMessage {...m.createProjectTitle} />
    </HeaderTitle>
  ),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  inputFieldContainer: {
    marginVertical: 20,
  },
  buttonContainer: {
    paddingVertical: 20,
    paddingHorizontal: 40,
  },
  buttonText: {
    color: WHITE,
    fontSize: 18,
  },
});
