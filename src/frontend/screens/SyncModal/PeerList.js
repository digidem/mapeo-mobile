// @flow
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TouchableNativeFeedback } from "../../sharedComponents/Touchables";

import Progress from "../../sharedComponents/icons/Progress";

type PeerStatus = {|
  // Peer is ready to sync
  READY: "READY",
  // Synchronization is in progress
  PROGRESS: "PROGRESS",
  // An error occurred during sync
  ERROR: "ERROR",
  // Synchronization is complete
  COMPLETE: "COMPLETE"
|};

export type Peer = {|
  // Unique identifier for the peer
  id: string,
  // User friendly peer name
  name: string,
  // See above
  status: $Keys<PeerStatus>,
  // Sync progress, between 0 to 1
  progress?: number,
  // The time of last completed sync in milliseconds since UNIX Epoch
  lastCompleted?: number,
  error?: string
|};

export const peerStatus: PeerStatus = {
  READY: "READY",
  PROGRESS: "PROGRESS",
  ERROR: "ERROR",
  COMPLETE: "COMPLETE"
};

export const PeerItem = ({
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
          <Progress progress={progress} size={40} color="white" />
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
  <View style={styles.container}>
    {peers.map(peer => (
      <PeerItemMemoized {...peer} key={peer.id} onSyncPress={onSyncPress} />
    ))}
  </View>
);

export default PeerList;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    height: 100,
    borderBottomColor: "#666666",
    borderBottomWidth: 1
  },
  sectionTitle: {
    fontWeight: "700",
    color: "white",
    marginTop: 10,
    marginBottom: 5,
    fontSize: 22
  },
  rowValue: {
    fontWeight: "400"
  },
  container: {
    backgroundColor: "#2348B2"
  },
  noBottomBorder: {
    borderBottomWidth: 0
  },
  itemInfo: { flexDirection: "column", flex: 1 },
  progressContainer: {
    width: 80,
    flex: 0,
    alignItems: "center",
    justifyContent: "center"
  }
});
