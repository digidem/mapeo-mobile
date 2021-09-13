import * as React from "react";
import { Alert, StyleSheet } from "react-native";
import { FormattedMessage, defineMessages, useIntl } from "react-intl";
import { ScrollView } from "react-native-gesture-handler";
import * as DocumentPicker from "expo-document-picker";

import ConfigContext from "../../../context/ConfigContext";
import SettingsContext from "../../../context/SettingsContext";
import HeaderTitle from "../../../sharedComponents/HeaderTitle";
import { Status } from "../../../types";
import { isInPracticeMode } from "../../../lib/utils";
import { ConfigDetails } from "./ConfigDetails";
import { LeavePracticeMode } from "./LeavePracticeMode";
import { ManagePeople } from "./ManagePeople";

const m = defineMessages({
  configTitle: {
    id: "screens.Settings.ProjectConfig.title",
    defaultMessage: "Project Configuration",
    description: "Title of project configuration screen",
  },
  unnamedConfig: {
    id: "screens.Settings.ProjectConfig.unnamedConfig",
    defaultMessage: "Un-named",
    description: "Config name when do name is defined",
  },
  configErrorTitle: {
    id: "screens.Settings.ProjectConfig.configErrorTitle",
    defaultMessage: "Import Error",
    description:
      "Title of error dialog when there is an error importing a config file",
  },
  configErrorDescription: {
    id: "screens.Settings.ProjectConfig.configErrorDescription",
    defaultMessage: "There was an error trying to import this config file",
    description:
      "Description of error dialog when there is an error importing a config file",
  },
  configErrorOkButton: {
    id: "screens.Settings.ProjectConfig.configErrorOkButton",
    defaultMessage: "OK",
    description:
      "Button to dismiss error dialog when there is an error importing a config file",
  },
});

export const ProjectConfig = () => {
  const { formatMessage: t } = useIntl();
  // TODO: dummy state, mostly for demonstrative purposes
  const [role] = React.useState<"participant" | "coordinator">("participant");
  const [status, setStatus] = React.useState<Status>("idle");
  const [config, { replace: replaceConfig }] = React.useContext(ConfigContext);
  const [{ experiments }] = React.useContext(SettingsContext);

  const configName =
    config.metadata.name || config.metadata.dataset_id || t(m.unnamedConfig);
  const configVersion = config.metadata.version;
  const projectKeySlice =
    config.metadata.projectKey && config.metadata.projectKey.slice(0, 5);

  const loading = status === "loading" || config.status === "loading";

  const isPracticeMode = isInPracticeMode(config);

  const handleImportPress = React.useCallback(async () => {
    setStatus("loading");
    const result = await DocumentPicker.getDocumentAsync();
    setStatus("idle");
    if (result.type === "success") replaceConfig(result.uri);
  }, [replaceConfig]);

  React.useEffect(() => {
    const didError = config.status === "error";
    if (didError) {
      Alert.alert(t(m.configErrorTitle), t(m.configErrorDescription), [
        { text: t(m.configErrorOkButton) },
      ]);
    }
  }, [config.status, t]);

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={role === "participant" ? { flex: 1 } : undefined}
    >
      <ConfigDetails
        isPracticeMode={isPracticeMode}
        loading={loading}
        name={configName}
        onImportPress={handleImportPress}
        projectKeyPreview={
          projectKeySlice ? projectKeySlice + "**********" : "MAPEO"
        }
        version={configVersion}
      />

      {experiments.onboarding &&
        (role === "coordinator" ? (
          <ManagePeople loading={loading} />
        ) : isPracticeMode ? (
          <LeavePracticeMode />
        ) : null)}
    </ScrollView>
  );
};

ProjectConfig.navigationOptions = {
  headerTitle: () => (
    <HeaderTitle style={{}}>
      <FormattedMessage {...m.configTitle} />
    </HeaderTitle>
  ),
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
