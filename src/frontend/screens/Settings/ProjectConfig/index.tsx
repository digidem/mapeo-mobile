import * as React from "react";
import { Alert, StyleSheet } from "react-native";
import { defineMessages, useIntl } from "react-intl";
import { ScrollView } from "react-native-gesture-handler";
import * as DocumentPicker from "expo-document-picker";

import ConfigContext, {
  Metadata as ConfigMetadata,
} from "../../../context/ConfigContext";
import { Status } from "../../../types";
import { isInPracticeMode } from "../../../lib/utils";
import { ConfigDetails } from "./ConfigDetails";
import { LeavePracticeMode } from "./LeavePracticeMode";
import { ManagePeople } from "./ManagePeople";
import { devExperiments } from "../../../lib/DevExperiments";
import { useSetHeader } from "../../../hooks/useSetHeader";

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
  configImportAlertMessage: {
    id: "screens.Settings.ProjectConfig.configImportAlertMessage",
    defaultMessage: "Successfully imported config:\n\n{name} {version}",
    description: "Message for alert after successful config import",
  },
  configImportAlertOkButton: {
    id: "screens.Settings.ProjectConfig.configImportAlertOk",
    defaultMessage: "OK",
    description: "Button text for config import alert acknowledgement",
  },
});

export const ProjectConfig = () => {
  const { formatMessage: t } = useIntl();

  useSetHeader({ headerTitle: m.configTitle });

  // TODO: dummy state, mostly for demonstrative purposes
  const [role] = React.useState<"participant" | "coordinator">("participant");
  const [status, setStatus] = React.useState<Status>("idle");
  const [config, { replace: replaceConfig }] = React.useContext(ConfigContext);

  const { onboarding } = devExperiments;
  const getConfigName = (metadata: ConfigMetadata) =>
    extractConfigName(metadata) || t(m.unnamedConfig);

  const handleImportPress = async () => {
    setStatus("loading");

    const result = await DocumentPicker.getDocumentAsync();

    setStatus("idle");

    if (result.type === "success")
      replaceConfig(result.uri, (newMetadata: ConfigMetadata) => {
        const { version } = newMetadata;

        const displayedVersion = version
          ? version.startsWith("v")
            ? version
            : `v${version}`
          : undefined;

        Alert.alert(
          "",
          t(m.configImportAlertMessage, {
            name: getConfigName(newMetadata),
            version: displayedVersion,
          }),
          [
            {
              text: t(m.configImportAlertOkButton),
            },
          ]
        );
      });
  };

  const projectKeySlice =
    config.metadata.projectKey && config.metadata.projectKey.slice(0, 5);

  const loading = status === "loading" || config.status === "loading";

  const isPracticeMode = devExperiments.onboarding && isInPracticeMode(config);

  React.useEffect(() => {
    const didError = config.status === "error";
    if (didError) {
      Alert.alert(t(m.configErrorTitle), t(m.configErrorDescription), [
        { text: t(m.configErrorOkButton) },
      ]);
    }
  }, [config.status, t]);

  return (
    <ScrollView style={styles.root}>
      <ConfigDetails
        isPracticeMode={isPracticeMode}
        loading={loading}
        name={getConfigName(config.metadata)}
        onImportPress={handleImportPress}
        projectKeyPreview={
          projectKeySlice ? projectKeySlice + "**********" : "MAPEO"
        }
        version={config.metadata.version}
      />

      {devExperiments.onboarding &&
        (role === "coordinator" ? (
          <ManagePeople loading={loading} />
        ) : isPracticeMode ? (
          <LeavePracticeMode />
        ) : null)}
    </ScrollView>
  );
};

function extractConfigName(configMetadata: ConfigMetadata) {
  return configMetadata.name || configMetadata.dataset_id;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
