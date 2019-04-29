// @flow
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { TouchableNativeFeedback } from "react-native-gesture-handler";
import { CircleSnail, Circle } from "react-native-progress";

import { peerStatus } from "./";
import type { Peer } from "./";

const Progress = ({ progress }: { progress?: number }) =>
  progress !== undefined ? (
    <Circle
      size={40}
      progress={progress}
      showsText
      color={"blue"}
      strokeCap="round"
      direction="clockwise"
    />
  ) : (
    <CircleSnail
      size={40}
      color={"blue"}
      strokeCap="round"
      direction="clockwise"
    />
  );

const PeerItem = ({
  id,
  name,
  status,
  progress,
  lastCompleted,
  onSyncPress
}: {
  ...$Exact<Peer>,
  onSyncPress: (id: string) => any
}) => (
  <TouchableNativeFeedback onPress={() => onSyncPress(id)}>
    <View style={styles.row}>
      <View style={styles.itemInfo}>
        <Text style={styles.sectionTitle}>{name}</Text>
        {lastCompleted && (
          <Text style={styles.rowValue}>
            {new Date(lastCompleted).toLocaleString()}
          </Text>
        )}
      </View>
      {status === peerStatus.PROGRESS && (
        <View style={styles.progressContainer}>
          <Progress progress={progress} />
        </View>
      )}
    </View>
  </TouchableNativeFeedback>
);

const PeerItemMemoized = React.memo(PeerItem);

const PeerList = ({
  peers,
  onSyncPress
}: {
  peers: Array<Peer>,
  onSyncPress: (id: string) => any
}) => (
  <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
    <View style={styles.infoArea}>
      {peers.map(peer => (
        <PeerItemMemoized {...peer} key={peer.id} onSyncPress={onSyncPress} />
      ))}
    </View>
  </ScrollView>
);

export default PeerList;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    minHeight: 80,
    borderBottomColor: "#666666",
    borderBottomWidth: 1
  },
  sectionTitle: {
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 5,
    fontSize: 16
  },
  rowValue: {
    fontWeight: "400"
  },
  infoArea: {
    flex: 1,
    backgroundColor: "white",
    paddingLeft: 15,
    paddingRight: 15
  },
  itemInfo: { flexDirection: "column", flex: 1 },
  progressContainer: {
    width: 80,
    flex: 0,
    backgroundColor: "lightblue",
    alignItems: "center",
    justifyContent: "center"
  }
});
