// @flow
import React from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import { TouchableNativeFeedback } from "../../sharedComponents/Touchables";

import IconButton from "../../sharedComponents/IconButton";
import { CloseIcon, WifiOffIcon, WifiIcon } from "../../sharedComponents/icons";
import DotIndicator from "./DotIndicator";
import PeerList from "./PeerList";
import type { Peer } from "./PeerList";

type HeaderProps = {
  onClosePress: () => void
};

const Header = ({ onClosePress }: HeaderProps) => (
  <View style={styles.header}>
    <IconButton onPress={onClosePress}>
      <CloseIcon color="white" />
    </IconButton>
    <Text numberOfLines={1} style={styles.title}>
      Sincronizar
    </Text>
  </View>
);

const WifiBar = ({ onPress, ssid, deviceName }) => (
  <TouchableNativeFeedback onPress={onPress}>
    <View style={styles.wifiBar}>
      <WifiIcon />
      <Text style={styles.wifiBarText}>
        <Text style={styles.bold}>Wi-Fi:</Text> {ssid}, {deviceName}
      </Text>
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
          <Text style={styles.infoHeader}>Sin Wi-Fi</Text>
          <Text style={styles.infoSubheader}>
            Abrir la configuración y conectar a una red Wi-Fi para sincronizar
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
        <Text style={styles.infoHeader}>Buscando</Text>
        <Text style={styles.infoSubheader}>
          Asegurar que los otros equipos están encendidos y conectados a la
          misma red de Wi-Fi
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
    contentContainerStyle={styles.scrollViewContent}
  >
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
