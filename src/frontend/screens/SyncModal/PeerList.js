// @flow
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { defineMessages, useIntl } from "react-intl";

import { TouchableNativeFeedback } from "../../sharedComponents/Touchables";
import {
  CellphoneIcon,
  LaptopIcon,
  SyncIcon,
  DoneIcon,
  ErrorIcon
} from "../../sharedComponents/icons";
import Progress from "../../sharedComponents/icons/Progress";
import DateDistance from "../../sharedComponents/DateDistance";

const m = defineMessages({
  syncButton: {
    id: "screens.SyncModal.PeerList.syncButton",
    defaultMessage: "Sync",
    description: "Button label for sync button"
  },
  errorButton: {
    id: "screens.SyncModal.PeerList.errorButton",
    defaultMessage: "Error",
    description: "Button label when there is an error"
  },
  completeButton: {
    id: "screens.SyncModal.PeerList.completeButton",
    defaultMessage: "Complete",
    description: "Button label when complete"
  },
  syncLabel: {
    id: "screens.SyncModal.PeerList.syncLabel",
    defaultMessage: "Synced:",
    description: "Label for last sync datetime"
  }
});

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
  error?: string,
  deviceType?: "mobile" | "desktop"
|};

export const peerStatus: PeerStatus = {
  READY: "READY",
  PROGRESS: "PROGRESS",
  ERROR: "ERROR",
  COMPLETE: "COMPLETE"
};

const SyncButton = ({ progress, onPress, status }) => {
  const { formatMessage: t } = useIntl();
  let style;
  let text;
  let icon;
  switch (status) {
    case peerStatus.READY:
      style = styles.syncButtonReady;
      text = t(m.syncButton);
      icon = <SyncIcon />;
      break;
    case peerStatus.PROGRESS:
      style = styles.syncButtonProgress;
      text = ((progress || 0) * 100).toFixed(0) + "%";
      icon = (
        <View style={styles.progressBackground}>
          <Progress progress={progress} size={25} color="white" />
        </View>
      );
      break;
    case peerStatus.ERROR:
      style = styles.syncButtonError;
      text = t(m.errorButton);
      icon = <ErrorIcon color="red" />;
      break;
    case peerStatus.COMPLETE:
      style = styles.syncButtonDone;
      text = t(m.completeButton);
      icon = <DoneIcon />;
  }
  return (
    <TouchableNativeFeedback
      style={styles.syncTouchable}
      onPress={status === peerStatus.ERROR ? undefined : onPress}
      hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}>
      <View style={[styles.syncButtonBase, style]}>
        <View style={styles.iconContainer}>{icon}</View>
        <Text numberOfLines={1} style={styles.buttonText}>
          {text}
        </Text>
      </View>
    </TouchableNativeFeedback>
  );
};

export const PeerItem = ({
  id,
  name,
  status,
  progress,
  lastCompleted,
  onSyncPress,
  deviceType
}: {
  ...$Exact<Peer>,
  onSyncPress: (id: string) => any
}) => {
  const { formatMessage: t } = useIntl();
  return (
    <View style={styles.row}>
      {deviceType === "desktop" ? (
        <LaptopIcon style={styles.peerIcon} size={40} />
      ) : (
        <CellphoneIcon style={styles.peerIcon} size={40} />
      )}
      <View style={styles.itemInfo}>
        <Text numberOfLines={1} style={styles.sectionTitle}>
          {name}
        </Text>
        {lastCompleted == null ? null : (
          <Text numberOfLines={1} style={styles.rowValue}>
            {t(m.syncLabel)} <DateDistance date={new Date(lastCompleted)} />
          </Text>
        )}
      </View>
      <SyncButton
        status={status}
        progress={progress}
        onPress={() => onSyncPress(id)}
      />
    </View>
  );
};

const PeerItemMemoized = React.memo(PeerItem);

const PeerList = ({
  peers,
  onSyncPress
}: {
  peers: Array<Peer>,
  onSyncPress: (id: string) => any
}) => (
  <ScrollView style={styles.container}>
    {peers.map(peer => (
      <PeerItemMemoized {...peer} key={peer.id} onSyncPress={onSyncPress} />
    ))}
  </ScrollView>
);

export default PeerList;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    height: 100,
    borderBottomColor: "#1D3B94",
    borderBottomWidth: 2,
    paddingRight: 15,
    justifyContent: "space-between",
    alignItems: "center"
  },
  sectionTitle: {
    fontWeight: "700",
    color: "white",
    fontSize: 22
  },
  rowValue: {
    fontWeight: "400",
    color: "white",
    marginTop: 5
  },
  container: {
    backgroundColor: "#2348B2"
  },
  peerIcon: {
    paddingHorizontal: 15
  },
  itemInfo: { flexDirection: "column", flex: 1, marginRight: 10 },
  syncTouchable: {
    borderRadius: 10
  },
  syncButtonBase: {
    width: 100,
    borderRadius: 10,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 6
  },
  syncButtonReady: {
    borderWidth: 1,
    borderColor: "white",
    backgroundColor: "#2348B2"
  },
  syncButtonProgress: {
    borderWidth: 0,
    backgroundColor: "#3366FF"
  },
  syncButtonDone: {
    borderWidth: 0,
    backgroundColor: "#19337F"
  },
  syncButtonError: {
    borderWidth: 1,
    borderColor: "red",
    backgroundColor: "#2348B2"
  },
  iconContainer: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    flex: 1,
    color: "white",
    fontWeight: "500",
    fontSize: 16,
    textAlign: "center"
  },
  progressBackground: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#264CBF",
    alignItems: "center",
    justifyContent: "center"
  }
});
