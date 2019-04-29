// @flow
import React from "react";
import { View, Text, StyleSheet } from "react-native";

import IconButton from "../../sharedComponents/IconButton";
import { CloseIcon } from "../../sharedComponents/icons";
import PeerList from "./PeerList";
import type { Peer } from "./";

type HeaderProps = {
  onClosePress: () => void
};

const Header = ({ onClosePress }: HeaderProps) => (
  <View style={styles.header}>
    <IconButton onPress={onClosePress}>
      <CloseIcon color="white" />
    </IconButton>
    <Text numberOfLines={1} style={styles.title}>
      Sync
    </Text>
  </View>
);

const WifiBar = ({ onPress }) => <View style={styles.wifiBar} />;

const NoWifiBox = ({ onPress }) => <View style={styles.noWifiBox} />;

const SearchingBox = () => <View style={styles.searchingBox} />;

type Props = {
  onClosePress: () => void,
  onSyncPress: (peerId: string) => void,
  peers: Array<Peer>,
  wifi: null | string
};

const SyncView = ({
  onClosePress,
  onSyncPress,
  peers,
  wifi,
  onWifiPress
}: Props) => (
  <View style={styles.container}>
    <Header onClosePress={onClosePress} />
    {wifi ? (
      <>
        <WifiBar />
        {peers.length ? (
          <PeerList peers={peers} onSyncPress={onSyncPress} />
        ) : (
          <SearchingBox />
        )}
      </>
    ) : (
      <NoWifiBox />
    )}
  </View>
);

export default SyncView;

const styles = StyleSheet.create({
  header: {
    flex: 0,
    height: 60,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center"
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
    backgroundColor: "#3366FF",
    flexDirection: "column"
  },
  noWifiBox: {
    backgroundColor: "#AD145C",
    minHeight: 250
  },
  wifiBar: {
    backgroundColor: "#19337F",
    height: 45
  },
  searchingBox: {
    backgroundColor: "#2348B2",
    minHieght: 250
  }
});
