import * as React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { FormattedMessage, defineMessages } from "react-intl";

import Text from "../../../sharedComponents/Text";
import { BLACK, LIGHT_GREY, MAPEO_BLUE, WHITE } from "../../../lib/styles";
import Button from "../../../sharedComponents/Button";

const m = defineMessages({
  currentConfig: {
    id: "screens.Settings.ProjectConfig.currentConfig",
    defaultMessage: "Current Configuration",
    description: "Label for name & version of current configuration",
  },
  projectKey: {
    id: "screens.Settings.ProjectConfig.projectKey",
    defaultMessage: "Project Key",
    description: "Label for project key",
  },
  importConfig: {
    id: "screens.Settings.ProjectConfig.importConfig",
    defaultMessage: "Import Config",
    description: "Button to import Mapeo config file",
  },
  name: {
    id: "screens.Settings.ProjectConfig.name",
    defaultMessage: "Project Name:",
    description: "Button to import Mapeo config file",
  },
});

interface Props {
  loading: boolean;
  name: string;
  onImportPress: () => Promise<void>;
  projectKeyPreview: string;
  version?: string;
}

export const ConfigDetails = ({
  loading,
  name,
  onImportPress,
  projectKeyPreview,
  version,
}: Props) => (
  <View>
    <View style={styles.container}>
      <View>
        <Text style={styles.configName}>{name}</Text>
      </View>
      <View style={styles.field}>
        <Text style={styles.fieldText}>
          <FormattedMessage {...m.currentConfig} />:
        </Text>
        <Text style={[styles.fieldText, styles.bold]}>
          {name}
          {version && " v" + version}
        </Text>
      </View>
      <View style={styles.field}>
        <Text style={styles.fieldText}>
          <FormattedMessage {...m.projectKey} />:
        </Text>
        <Text style={[styles.fieldText, styles.bold]}>{projectKeyPreview}</Text>
      </View>
      <View style={styles.importButtonContainer}>
        <Button
          fullWidth
          variant="outlined"
          onPress={onImportPress}
          style={styles.importButton}
        >
          <Text style={styles.importButtonText}>
            <FormattedMessage {...m.importConfig} />
          </Text>
        </Button>
      </View>
    </View>
    {loading && (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: LIGHT_GREY,
    padding: 20,
  },
  configName: {
    fontSize: 30,
    color: BLACK,
    fontWeight: "700",
  },
  field: {
    marginVertical: 10,
  },
  fieldText: {
    fontSize: 18,
    color: BLACK,
  },
  centerText: {
    textAlign: "center",
  },
  configVersion: {
    fontWeight: "normal",
  },
  bold: {
    fontWeight: "700",
  },
  loadingContainer: {
    position: "absolute",
    width: "100%",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  importButtonContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  importButton: {
    backgroundColor: WHITE,
  },
  importButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: MAPEO_BLUE,
  },
});
