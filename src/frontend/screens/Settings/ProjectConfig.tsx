import React from "react";
import { View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import Text from "../../sharedComponents/Text";
import { FormattedMessage, defineMessages, useIntl } from "react-intl";
import * as DocumentPicker from "expo-document-picker";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import HeaderTitle from "../../sharedComponents/HeaderTitle";
import Button from "../../sharedComponents/Button";
import ConfigContext from "../../context/ConfigContext";
import type { Status } from "../../types";
import { useNavigation } from "react-navigation-hooks";

const m = defineMessages({
  configTitle: {
    id: "screens.ProjectConfig.title",
    defaultMessage: "Project Configuration",
    description: "Title of project configuration screen",
  },
  currentConfig: {
    id: "screens.Settings.currentConfig",
    defaultMessage: "Current Configuration",
    description: "Label for name & version of current configuration",
  },
  projectKey: {
    id: "screens.Settings.projectKey",
    defaultMessage: "Project Key",
    description: "Label for project key",
  },
  unnamedConfig: {
    id: "screens.Settings.unnamedConfig",
    defaultMessage: "Un-named",
    description: "Config name when do name is defined",
  },
  configErrorTitle: {
    id: "screens.Settings.configErrorTitle",
    defaultMessage: "Import Error",
    description:
      "Title of error dialog when there is an error importing a config file",
  },
  configErrorDescription: {
    id: "screens.Settings.configErrorDescription",
    defaultMessage: "There was an error trying to import this config file",
    description:
      "Description of error dialog when there is an error importing a config file",
  },
  configErrorOkButton: {
    id: "screens.Settings.configErrorOkButton",
    defaultMessage: "OK",
    description:
      "Button to dismiss error dialog when there is an error importing a config file",
  },
  importConfig: {
    id: "screens.Settings.importConfig",
    defaultMessage: "Import Config",
    description: "Button to import Mapeo config file",
  },
  name: {
    id: "screens.Settings.name",
    defaultMessage: "Project Name:",
    description: "Button to import Mapeo config file",
  },
  leaveProject: {
    id: "screens.Settings.leaveProject",
    defaultMessage: "Leave Project",
    description: "Button to leave current project",
  },
  addPerson: {
    id: "screens.Settings.addPerson",
    defaultMessage: "Add Person",
    description: "Button to add person to project",
  },
});

const ProjectConfig = () => {
  const { formatMessage: t } = useIntl();
  const [status, setStatus] = React.useState<Status>("idle");
  const [config, { replace: replaceConfig }] = React.useContext(ConfigContext);
  const didError = config.status === "error";

  const { navigate } = useNavigation();

  React.useEffect(() => {
    if (!didError) return;
    Alert.alert(t(m.configErrorTitle), t(m.configErrorDescription), [
      { text: t(m.configErrorOkButton) },
    ]);
  }, [didError, t]);

  const handleImportPress = React.useCallback(async () => {
    setStatus("loading");
    const result = await DocumentPicker.getDocumentAsync();
    setStatus("idle");
    if (result.type === "success") replaceConfig(result.uri);
  }, [replaceConfig]);

  const configName =
    config.metadata.name || config.metadata.dataset_id || t(m.unnamedConfig);
  const configVersion = config.metadata.version;
  const projectKeySlice =
    config.metadata.projectKey && config.metadata.projectKey.slice(0, 5);

  return (
    <View style={styles.root}>
      <View style={styles.configInfo}>
        <Text style={styles.centerText}>
          <FormattedMessage {...m.currentConfig} />:
        </Text>
        <Text style={[styles.centerText, styles.configName]}>
          {configName}
          {configVersion && (
            <Text style={styles.configVersion}>{" v" + configVersion}</Text>
          )}
        </Text>
        <Text style={styles.centerText}>
          <FormattedMessage {...m.projectKey} />:
        </Text>
        <Text style={[styles.centerText, styles.projectKey]}>
          {projectKeySlice ? projectKeySlice + "**********" : "MAPEO"}
        </Text>

        {!!configName && (
          <React.Fragment>
            <Text style={[styles.centerText, { marginTop: 10 }]}>
              <FormattedMessage {...m.name} />
            </Text>
            <Text style={[styles.centerText, styles.projectKey]}>
              {configName}
            </Text>
          </React.Fragment>
        )}
        {(status === "loading" || config.status === "loading") && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
          </View>
        )}
      </View>

      <Button
        disabled={status === "loading" || config.status === "loading"}
        variant="contained"
        onPress={handleImportPress}
        style={[{ marginTop: 40 }, styles.button]}
      >
        {t(m.importConfig) /* Button component expects string children */}
      </Button>
      {process.env.FEATURE_ONBOARDING === "true" && (
        <React.Fragment>
          {/* We need to work out permission before we figure out what this button does */}
          <Button
            style={styles.button}
            disabled={status === "loading" || config.status === "loading"}
            variant="outlined"
            onPress={() => {}}
          >
            <View style={styles.leaveBttn}>
              <MaterialIcons name="person-add" color="#0066ff" size={18} />
              <Text
                style={{
                  color: "#0066ff",
                  fontWeight: "bold",
                  marginLeft: 5,
                  fontSize: 16,
                }}
              >
                <FormattedMessage {...m.addPerson} />
              </Text>
            </View>
          </Button>

          <Button
            style={styles.button}
            disabled={status === "loading" || config.status === "loading"}
            variant="outlined"
            onPress={() => navigate("LeaveProjectScreen")}
          >
            <View style={styles.leaveBttn}>
              <MaterialIcons name="exit-to-app" color="#0066ff" size={18} />
              <Text
                style={{
                  color: "#0066ff",
                  fontWeight: "bold",
                  marginLeft: 5,
                  fontSize: 16,
                }}
              >
                <FormattedMessage {...m.leaveProject} />
              </Text>
            </View>
          </Button>
        </React.Fragment>
      )}
    </View>
  );
};

ProjectConfig.navigationOptions = {
  headerTitle: () => (
    <HeaderTitle style={{}}>
      <FormattedMessage {...m.configTitle} />
    </HeaderTitle>
  ),
};

export default ProjectConfig;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  configInfo: {
    marginBottom: 20,
    position: "relative",
  },
  centerText: {
    textAlign: "center",
  },
  configName: {
    fontWeight: "bold",
    color: "#444444",
    fontSize: 20,
    marginBottom: 10,
  },
  configVersion: {
    fontWeight: "normal",
  },
  projectKey: {
    fontSize: 16,
    color: "#444444",
    fontFamily: "monospace",
    marginTop: 2,
  },
  loadingContainer: {
    position: "absolute",
    width: "100%",
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  leaveBttn: {
    color: "#0066ff",
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    margin: 5,
  },
});
