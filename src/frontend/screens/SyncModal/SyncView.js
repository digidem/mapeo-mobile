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
  syncHeader: {
    id: "screens.SyncModal.SyncView.syncHeader",
    defaultMessage: "Synchronize",
    description: "Header of sync screen"
  },

  wifi: {
    id: "screens.SyncModal.SyncView.wifi",
    defaultMessage: "WiFi:",
    description: "Label for wifi network name"
  },

  noWifiTitle: {
    id: "screens.SyncModal.SyncView.noWifiTitle",
    defaultMessage: "No WiFi",
    description: "Title of message shown when no wifi network"
  },
  noWifiDesc: {
    id: "screens.SyncModal.SyncView.noWifiDesc",
    description: "Description shown when no wifi network",
    defaultMessage:
      "Open your phone settins and connect to a WiFi network to synchronize"
  },
  searchingTitle: {
    id: "screens.SyncModal.SyncView.searchingTitle",
    defaultMessage: "Searching",
    description: "Title of message shown while looking for sync peers"
  },
  searchingDesc: {
    id: "screens.SyncModal.SyncView.searchingDesc",
    description: "Description shown whilst searcing for sync peers",
    defaultMessage:
      "Ensure that other devices are turned on and connected to the same WiFi network"
  }
});

type HeaderProps = {
  onClosePress: () => void
};

const Header = ({ onClosePress }: HeaderProps) => (
  <View style={styles.header}>
    <IconButton onPress={onClosePress}>
      <CloseIcon color="white" />
    </IconButton>
    <Text numberOfLines={1} style={styles.title}>
      <FormattedMessage {...m.syncHeader} />
    </Text>
  </View>
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

const NoWifiBox = ({ onPress }) => (
  <TouchableNativeFeedback onPress={onPress}>
    <View style={styles.noWifiBox}>
      <View style={styles.noWifiBoxInner}>
        <View style={styles.noWifiIcon}>
          <WifiOffIcon size={50} />
        </View>
        <View style={styles.noWifiTextContainer}>
          <Text style={styles.infoHeader}>
            <FormattedMessage {...m.noWifiTitle} />
          </Text>
          <Text style={styles.infoSubheader}>
            <FormattedMessage {...m.noWifiDesc} />
          </Text>
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
