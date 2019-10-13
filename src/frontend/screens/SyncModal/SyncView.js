// @flow
import React from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import { TouchableNativeFeedback } from "../../sharedComponents/Touchables";
import { defineMessages, FormattedMessage } from "react-intl";

import IconButton from "../../sharedComponents/IconButton";
import { CloseIcon, WifiOffIcon, WifiIcon } from "../../sharedComponents/icons";
import DotIndicator from "./DotIndicator";
import PeerList from "./PeerList";
import type { Peer } from "./PeerList";

const m = defineMessages({
  // Header of sync screen
  syncHeader: "Synchronize",
  // Label for wifi network name
  wifi: "WiFi:",
  // Title of message shown when no wifi network
  noWifiTitle: "No WiFi",
  // Description shown when no wifi network
  noWifiDesc:
    "Open your phone settins and connect to a WiFi network to synchronize",
  // Title of message shown while looking for sync peers
  searchingTitle: "Searching",
  // Description shown whilst searcing for sync peers
  searchingDesc:
    "Ensure that other devices are turned on and connected to the same WiFi network"
});

type HeaderProps = {
  onClosePress: () => void
};

const Header = ({ onClosePress }: HeaderProps) => (
  <View style={styles.header}>
    <IconButton onPress={onClosePress}>
      <CloseIcon color="white" />
    </IconButton>
    <FormattedMessage
      {...m.syncHeader}
      numberOfLines={1}
      style={styles.title}
    />
  </View>
);

const WifiBar = ({ onPress, ssid, deviceName }) => (
  <TouchableNativeFeedback onPress={onPress}>
    <View style={styles.wifiBar}>
      <WifiIcon />
      <Text style={styles.wifiBarText} numberOfLines={1}>
        <FormattedMessage {...m.wifi} style={styles.bold} /> {ssid}
      </Text>
      <Text style={styles.deviceName}>{deviceName}</Text>
    </View>
  </TouchableNativeFeedback>
);

const NoWifiBox = ({ onPress }) => (
  <TouchableNativeFeedback onPress={onPress}>
    <View style={styles.noWifiBox}>
      <View style={styles.noWifiBoxInner}>
        <View style={styles.noWifiIcon}>
          <WifiOffIcon size={50} />
        </View>
        <View style={styles.noWifiTextContainer}>
          <FormattedMessage {...m.noWifiTitle} style={styles.infoHeader} />
          <FormattedMessage {...m.noWifiDesc} style={styles.infoSubheader} />
        </View>
      </View>
    </View>
  </TouchableNativeFeedback>
);

const SearchingBox = () => (
  <View style={styles.searchingBox}>
    <View style={styles.searchingBoxInner}>
      <DotIndicator />
      <View style={styles.searchingTextContainer}>
        <FormattedMessage {...m.searchingTitle} style={styles.infoHeader} />
        <FormattedMessage {...m.searchingDesc} style={styles.infoSubheader} />
      </View>
    </View>
  </View>
);

type Props = {
  onClosePress: () => void,
  onSyncPress: (peerId: string) => void,
  onWifiPress: () => void,
  deviceName: string,
  peers: Array<Peer>,
  ssid: null | string
};

const SyncView = ({
  onClosePress,
  onSyncPress,
  peers,
  ssid,
  deviceName,
  onWifiPress
}: Props) => (
  <ScrollView
    style={styles.container}
    contentContainerStyle={styles.scrollViewContent}>
    <Header onClosePress={onClosePress} />
    {ssid ? (
      <>
        <WifiBar onPress={onWifiPress} ssid={ssid} deviceName={deviceName} />
        {peers.length ? (
          <PeerList peers={peers} onSyncPress={onSyncPress} />
        ) : (
          <SearchingBox />
        )}
      </>
    ) : (
      <NoWifiBox onPress={onWifiPress} />
    )}
  </ScrollView>
);

export default SyncView;

const styles = StyleSheet.create({
  header: {
    flexGrow: 0,
    flexShrink: 0,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3366FF"
  },
  title: {
    color: "white",
    fontWeight: "700",
    fontSize: 20,
    flex: 1,
    textAlign: "center",
    marginRight: 60
  },
  container: {
    flex: 1,
    backgroundColor: "#2348B2"
  },
  scrollViewContent: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start"
  },
  noWifiBox: {
    backgroundColor: "#AD145C",
    minHeight: 300,
    paddingHorizontal: 30,
    flexDirection: "column",
    justifyContent: "center"
  },
  noWifiBoxInner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  searchingBoxInner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  noWifiIcon: {
    width: 120,
    height: 120,
    backgroundColor: "#93114E",
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center"
  },
  infoHeader: {
    color: "white",
    fontWeight: "700",
    fontSize: 24
  },
  infoSubheader: {
    color: "white",
    fontWeight: "400",
    fontSize: 20
  },
  noWifiTextContainer: {
    maxWidth: "60%",
    marginLeft: 20
  },
  searchingTextContainer: {
    maxWidth: "75%",
    marginLeft: 30
  },
  wifiBar: {
    backgroundColor: "#19337F",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 15
  },
  wifiBarText: {
    color: "white",
    paddingLeft: 10
  },
  deviceName: {
    fontWeight: "bold",
    textAlign: "right",
    color: "white",
    flex: 1
  },
  bold: {
    fontWeight: "700"
  },
  searchingBox: {
    backgroundColor: "#2348B2",
    minHeight: 250,
    paddingHorizontal: 30,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch"
  }
});
