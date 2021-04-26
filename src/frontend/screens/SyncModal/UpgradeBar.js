import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { MaterialIndicator } from "react-native-indicators";
import { View, StyleSheet } from "react-native";

import Text from "../../sharedComponents/Text";
import { TouchableNativeFeedback } from "../../sharedComponents/Touchables";
import { DoneIcon, ErrorIcon } from "../../sharedComponents/icons";
import { UpgradeState } from "./index";
import Progress from "../../sharedComponents/icons/Progress";
import DotIndicator from "./DotIndicator";

const m = defineMessages({
  checkingUpdates: {
    id: "screens.SyncModal.SyncView.checkingUpdates",
    description: "Label in upgrade bar when checking for updates",
    defaultMessage: "Checking for app updates",
  },
  updateAwaitingSync: {
    id: "screens.SyncModal.SyncView.updateAwaitingSync",
    description: "Label in upgrade bar when waiting for sync to complete",
    defaultMessage: "Update available; waiting for sync to finish",
  },
  updateDownloading: {
    id: "screens.SyncModal.SyncView.updateDownloading",
    description: "Label in upgrade bar when downloading an update",
    defaultMessage: "Downloading updates",
  },
  updateGenericError: {
    id: "screens.SyncModal.SyncView.updateGenericError",
    description:
      "Label in upgrade bar when there is an error getting an update",
    defaultMessage: "Unable to update",
  },
  updatePermissionError: {
    id: "screens.SyncModal.SyncView.updatePermissionError",
    description:
      "Label in upgrade bar when there is permissions error getting an update",
    defaultMessage: "Unable to update",
  },
  noUpdates: {
    id: "screens.SyncModal.SyncView.noUpdates",
    description: "Label in upgrade bar when no updates are found",
    defaultMessage: "No app updates found",
  },
  updateReady: {
    id: "screens.SyncModal.SyncView.updateReady",
    description: "Label in upgrade bar when an update is available",
    defaultMessage: "A new version of Mapeo is available",
  },
  sharingUpdate: {
    id: "screens.SyncModal.SyncView.sharingUpdate",
    description: "Label in upgrade bar when sharing an update with others",
    defaultMessage: "Sharing app updates with other devices",
  },
  updateUnknownState: {
    id: "screens.SyncModal.SyncView.updateUnknownState",
    description:
      "Label in upgrade bar when an unknown update state is detected (should not happen)",
    defaultMessage: "Unimplemented state",
  },
  installUpdateButton: {
    id: "screens.SyncModal.SyncView.installUpdateButton",
    description: "Label for button to install an update",
    defaultMessage: "Install Update",
  },
  openSettingsButton: {
    id: "screens.SyncModal.SyncView.openSettingsButton",
    description:
      "Label for button to open settings to fix update permissions error",
    defaultMessage: "Open Settings",
  },
});

const TextButton = ({ onPress, title }) => (
  <Text style={styles.textButton}>{title}</Text>
);

const UpgradeBar = ({ upgradeInfo, onInstallPress }) => {
  const { formatMessage: t } = useIntl();
  return (
    <TouchableNativeFeedback>
      <View style={styles.upgradeBar}>
        {(() => {
          switch (upgradeInfo.state) {
            case UpgradeState.Searching:
              return (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flex: 1,
                  }}
                >
                  <Text style={styles.upgradeBarText} numberOfLines={1}>
                    <FormattedMessage {...m.checkingUpdates} />
                  </Text>
                  <View style={{ flex: 1 }}></View>
                  <DotIndicator style={{ flex: 1 }} size={7} />
                </View>
              );
            case UpgradeState.WaitingForSync:
              return (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flex: 1,
                  }}
                >
                  <View style={{ flex: 4 }}>
                    <Text style={styles.upgradeBarText} numberOfLines={2}>
                      <FormattedMessage {...m.updateAwaitingSync} />
                    </Text>
                  </View>
                  <View style={{ flex: 2 }}></View>
                  <DotIndicator style={{ flex: 1 }} size={7} />
                </View>
              );
            case UpgradeState.Downloading:
              return (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <View style={{ flex: 2 }}>
                    <Text style={styles.upgradeBarText} numberOfLines={1}>
                      <FormattedMessage {...m.updateDownloading} />
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}></View>
                  <Progress
                    progress={upgradeInfo.context.progress}
                    size={25}
                    color="#3568f5"
                  />
                </View>
              );
            case UpgradeState.GenericError:
              return (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flex: 1,
                  }}
                >
                  <View style={{ flex: 4, flexDirection: "column" }}>
                    <Text style={styles.upgradeBarText} numberOfLines={1}>
                      <FormattedMessage {...m.updateGenericError} />
                    </Text>
                    <Text
                      style={styles.upgradeBarTextSecondary}
                      numberOfLines={1}
                    >
                      {upgradeInfo.context}
                    </Text>
                  </View>
                  <View style={{ flex: 0.5, justifyContent: "center" }}>
                    <ErrorIcon color="red" />
                  </View>
                </View>
              );
            case UpgradeState.PermissionError:
              return (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flex: 1,
                  }}
                >
                  <View style={{ flex: 8, flexDirection: "column" }}>
                    <Text style={styles.upgradeBarText} numberOfLines={1}>
                      <FormattedMessage {...m.updatePermissionError} />
                    </Text>
                    <Text
                      style={styles.upgradeBarTextSecondary}
                      numberOfLines={1}
                    >
                      {upgradeInfo.context}
                    </Text>
                  </View>
                  <View style={{ flex: 5, justifyContent: "center" }}>
                    <TextButton title={t(m.openSettingsButton)} />
                  </View>
                </View>
              );
            case UpgradeState.NoUpdatesFound:
              return (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flex: 1,
                  }}
                >
                  <View style={{ flex: 4, flexDirection: "column" }}>
                    <Text style={styles.upgradeBarText} numberOfLines={1}>
                      <FormattedMessage {...m.noUpdates} />
                    </Text>
                  </View>
                  <View style={{ flex: 0.5, justifyContent: "center" }}>
                    <DoneIcon color="#00FF00" />
                  </View>
                </View>
              );
            case UpgradeState.ReadyToUpgrade:
              return (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flex: 1,
                  }}
                >
                  <View style={{ flex: 6, flexDirection: "column" }}>
                    <Text style={styles.upgradeBarText} numberOfLines={2}>
                      <FormattedMessage {...m.updateReady} />
                    </Text>
                  </View>
                  <View style={{ flex: 2 }} />
                  <View style={{ flex: 5, justifyContent: "center" }}>
                    <TouchableNativeFeedback onPress={onInstallPress}>
                      <TextButton
                        title={t(m.installUpdateButton)}
                        onPress={onInstallPress}
                      />
                    </TouchableNativeFeedback>
                  </View>
                </View>
              );
            case UpgradeState.Draining:
              return (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flex: 1,
                  }}
                >
                  <View style={{ flex: 6 }}>
                    <Text style={styles.upgradeBarText} numberOfLines={2}>
                      <FormattedMessage {...m.sharingUpdate} />
                    </Text>
                  </View>
                  <View style={{ flex: 3 }} />
                  <View style={{ flex: 1.5 }}>
                    <MaterialIndicator
                      animationDuration={8000}
                      size={35}
                      color="#3568f5"
                    />
                  </View>
                </View>
              );
            default:
              return (
                <Text style={styles.upgradeBarText} numberOfLines={1}>
                  <FormattedMessage {...m.updateUnkownState} />
                </Text>
              );
          }
        })()}
      </View>
    </TouchableNativeFeedback>
  );
};

export default UpgradeBar;

const styles = StyleSheet.create({
  upgradeBar: {
    backgroundColor: "#000034",
    height: 84,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 15,
  },
  upgradeBarText: {
    color: "white",
    fontWeight: "bold",
    paddingLeft: 10,
    fontSize: 18,
  },
  upgradeBarTextSecondary: {
    color: "white",
    paddingLeft: 10,
    fontStyle: "italic",
    fontSize: 16,
  },
  textButton: {
    fontWeight: "bold",
    fontSize: 18,
    padding: 10,
    paddingTop: 12,
    paddingBottom: 12,
    textAlign: "center",
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 7,
    color: "white",
  },
});
