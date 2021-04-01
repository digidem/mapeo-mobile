// @flow
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TouchableNativeFeedback } from "../../sharedComponents/Touchables";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import Button from "../../sharedComponents/Button";
import {
  WifiOffIcon,
  WifiIcon,
  DoneIcon,
  ErrorIcon,
} from "../../sharedComponents/icons";
import DotIndicator from "./DotIndicator";
import PeerList from "./PeerList";
import type { Peer } from "./PeerList";
import { UpgradeState } from "./index";
import Progress from "../../sharedComponents/icons/Progress";
import { MaterialIndicator } from "react-native-indicators";

const m = defineMessages({
  wifi: {
    id: "screens.SyncModal.SyncView.wifi",
    defaultMessage: "WiFi:",
    description: "Label for wifi network name",
  },
  noWifiTitle: {
    id: "screens.SyncModal.SyncView.noWifiTitle",
    defaultMessage: "No WiFi",
    description: "Title of message shown when no wifi network",
  },
  noWifiDesc: {
    id: "screens.SyncModal.SyncView.noWifiDesc",
    description: "Description shown when no wifi network",
    defaultMessage:
      "Open your phone settins and connect to a WiFi network to synchronize",
  },
  settingsButton: {
    id: "screens.SyncModal.SyncView.settingsButton",
    description: "Button to open WiFi settings",
    defaultMessage: "Open Settings",
  },
  searchingTitle: {
    id: "screens.SyncModal.SyncView.searchingTitle",
    defaultMessage: "Searching",
    description: "Title of message shown while looking for sync peers",
  },
  searchingDesc: {
    id: "screens.SyncModal.SyncView.searchingDesc",
    description: "Description shown whilst searcing for sync peers",
    defaultMessage:
      "Ensure that other devices are turned on and connected to the same WiFi network",
  },
  projectKey: {
    id: "screens.SyncModal.SyncView.projectKey",
    description: "First 5 characters of project key displayed on sync screen",
    defaultMessage: "Project Key: {projectKey}",
  },
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
              break;
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
              break;
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
              break;
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
              break;
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
              break;
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
              break;
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
              break;
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
              break;
            default:
              return (
                <Text style={styles.upgradeBarText} numberOfLines={1}>
                  <FormattedMessage {...m.updateUnkownState} />
                </Text>
              );
              break;
          }
        })()}
      </View>
    </TouchableNativeFeedback>
  );
};

const TextButton = ({ onPress, title }) => (
  <Text style={styles.textButton}>{title}</Text>
);

const WifiBar = ({ onPress, ssid, deviceName }) => (
  <TouchableNativeFeedback onPress={onPress}>
    <View style={styles.wifiBar}>
      <WifiIcon />
      <Text style={styles.wifiBarText} numberOfLines={1}>
        <Text style={styles.bold}>
          <FormattedMessage {...m.wifi} />
        </Text>{" "}
        {ssid}
      </Text>
      <Text style={styles.deviceName}>{deviceName}</Text>
    </View>
  </TouchableNativeFeedback>
);

const NoWifiBox = ({ onPress }) => {
  const { formatMessage: t } = useIntl();
  return (
    <View style={styles.noWifiBox}>
      <View style={styles.noWifiIconContainer}>
        <View style={styles.noWifiIcon}>
          <WifiOffIcon size={150} color="#2347B2" style={{ top: 7 }} />
        </View>
      </View>
      <View style={styles.noWifiTextContainer}>
        <Text style={[styles.infoHeader, styles.noWifiText]}>
          {t(m.noWifiTitle)}
        </Text>
        <Text style={[styles.infoSubheader, styles.noWifiText]}>
          {t(m.noWifiDesc)}
        </Text>
      </View>
      <View style={styles.settingsButton}>
        <Button onPress={onPress}>{t(m.settingsButton)}</Button>
      </View>
    </View>
  );
};

const SearchingBox = () => (
  <View style={styles.searchingBox}>
    <View style={styles.searchingBoxInner}>
      <DotIndicator />
      <View style={styles.searchingTextContainer}>
        <Text style={styles.infoHeader}>
          <FormattedMessage {...m.searchingTitle} />
        </Text>
        <Text style={styles.infoSubheader}>
          <FormattedMessage {...m.searchingDesc} />
        </Text>
      </View>
    </View>
  </View>
);

type Props = {
  onSyncPress: (peerId: string) => void,
  onWifiPress: () => void,
  deviceName: string,
  peers: Array<Peer>,
  ssid: null | string,
  projectKey?: string,
};

const SyncView = ({
  onSyncPress,
  onInstallPress,
  peers,
  ssid,
  deviceName,
  onWifiPress,
  projectKey,
  upgradeInfo,
}: Props) => (
  <View style={styles.root}>
    {ssid ? (
      <>
        <WifiBar onPress={onWifiPress} ssid={ssid} deviceName={deviceName} />
        <UpgradeBar upgradeInfo={upgradeInfo} onInstallPress={onInstallPress} />
        {peers.length ? (
          <PeerList peers={peers} onSyncPress={onSyncPress} />
        ) : (
          <SearchingBox />
        )}

        <Text style={styles.projectId}>
          <FormattedMessage
            {...m.projectKey}
            values={{
              projectKey: projectKey
                ? projectKey.slice(0, 5) + "**********"
                : "MAPEO",
            }}
          />
        </Text>
      </>
    ) : (
      <NoWifiBox onPress={onWifiPress} />
    )}
  </View>
);

export default SyncView;

const styles = StyleSheet.create({
  projectId: {
    color: "#aaaaaa",
    padding: 10,
    textAlign: "center",
    backgroundColor: "black",
    flex: 0,
  },
  root: {
    flex: 1,
    backgroundColor: "#2348B2",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  noWifiBox: {
    backgroundColor: "#000034",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch",
    flex: 1,
  },
  noWifiIconContainer: {
    flexDirection: "column",
    alignItems: "center",
    flex: 0,
  },
  searchingBoxInner: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  noWifiIcon: {
    width: 250,
    height: 250,
    marginVertical: 50,
    backgroundColor: "#19337F",
    borderRadius: 125,
    alignItems: "center",
    justifyContent: "center",
  },
  infoHeader: {
    color: "white",
    fontWeight: "700",
    fontSize: 24,
  },
  infoSubheader: {
    color: "white",
    fontWeight: "400",
    fontSize: 18,
  },
  noWifiTextContainer: {
    flex: 0,
    paddingHorizontal: 20,
  },
  noWifiText: {
    textAlign: "center",
  },
  searchingTextContainer: {
    maxWidth: "75%",
    marginLeft: 30,
  },
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
  wifiBar: {
    backgroundColor: "#19337F",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 15,
  },
  wifiBarText: {
    color: "white",
    paddingLeft: 10,
  },
  deviceName: {
    fontWeight: "bold",
    textAlign: "right",
    color: "white",
    flex: 1,
  },
  bold: {
    fontWeight: "700",
  },
  settingsButton: {
    flex: 1,
    paddingVertical: 10,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  searchingBox: {
    backgroundColor: "#2348B2",
    minHeight: 250,
    flex: 1,
    paddingHorizontal: 30,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
});
