// @flow
import React from "react";
import { View, StyleSheet } from "react-native";
import Text from "../../sharedComponents/Text";
import { TouchableNativeFeedback } from "../../sharedComponents/Touchables";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import Button from "../../sharedComponents/Button";
import { WifiOffIcon, WifiIcon } from "../../sharedComponents/icons";
import DotIndicator from "./DotIndicator";
import PeerList from "./PeerList";
import type { Peer } from "./PeerList";

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
});

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
  peers,
  ssid,
  deviceName,
  onWifiPress,
  projectKey,
}: Props) => (
  <View style={styles.root}>
    {ssid ? (
      <>
        <WifiBar onPress={onWifiPress} ssid={ssid} deviceName={deviceName} />
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
