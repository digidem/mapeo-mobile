// @flow
import * as React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Text from "../../sharedComponents/Text";
import { defineMessages, useIntl } from "react-intl";

import { TouchableNativeFeedback } from "../../sharedComponents/Touchables";
import {
  CellphoneIcon,
  LaptopIcon,
  SyncIcon,
  DoneIcon,
  ErrorIcon,
} from "../../sharedComponents/icons";
import Progress from "../../sharedComponents/icons/Progress";
import DateDistance from "../../sharedComponents/DateDistance";
import type { PeerError } from "../../api";
import { parseVersionMajor } from "../../lib/utils";

const m = defineMessages({
  syncButton: {
    id: "screens.SyncModal.PeerList.syncButton",
    defaultMessage: "Sync",
    description: "Button label for sync button",
  },
  errorButton: {
    id: "screens.SyncModal.PeerList.errorButton",
    defaultMessage: "Error",
    description: "Button label when there is an error",
  },
  completeButton: {
    id: "screens.SyncModal.PeerList.completeButton",
    defaultMessage: "Complete",
    description: "Button label when complete",
  },
  disconnectedButton: {
    id: "screens.SyncModal.PeerList.disconnectedButton",
    defaultMessage: "Disconnected",
    description: "Button label when disconnected",
  },
  finishingButton: {
    id: "screens.SyncModal.PeerList.finishingButton",
    defaultMessage: "...",
    description:
      "Button label when finishing sync but don't have correct progress",
  },
  syncLabel: {
    id: "screens.SyncModal.PeerList.syncLabel",
    defaultMessage: "Synced:",
    description: "Label for last sync datetime",
  },
  errorTheyNeedUgrade: {
    id: "screens.SyncModal.PeerList.errorTheyNeedUgrade",
    defaultMessage: "Incompatible Mapeo",
    description:
      "Short message shown under device in sync screen when it is running an incompatible version of Mapeo",
  },
  errorWeNeedUgrade: {
    id: "screens.SyncModal.PeerList.errorTheyNeedUgrade",
    defaultMessage: "Incompatible Mapeo",
    description:
      "Short message shown under device in sync screen when it is running an incompatible version of Mapeo",
  },
  errorClientMismatch: {
    id: "screens.SyncModal.PeerList.errorClientMismatch",
    defaultMessage: "Not a Mapeo client",
    description:
      "Short message shown under device in sync screen when it is running an incompatible (non-Mapeo) client",
  },
});

type PeerStatus = {|
  // Peer is ready to sync
  READY: "READY",
  // Synchronization is in progress
  PROGRESS: "PROGRESS",
  // An error occurred during sync
  ERROR: "ERROR",
  // Synchronization is complete
  COMPLETE: "COMPLETE",
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
  error?: PeerError,
  deviceType?: "mobile" | "desktop",
  connected: boolean,
|};

export const peerStatus: PeerStatus = {
  READY: "READY",
  PROGRESS: "PROGRESS",
  ERROR: "ERROR",
  COMPLETE: "COMPLETE",
};

const SyncButton = ({ progress, onPress, status, connected }) => {
  const { formatMessage: t } = useIntl();
  const [pressed, setPressed] = React.useState(false);

  React.useEffect(() => {
    if (!pressed) return;
    if (status === peerStatus.READY) return;
    setPressed(false);
  }, [pressed, status]);

  let style;
  let text;
  let icon;
  switch (status) {
    case peerStatus.READY:
      style = styles.syncButtonReady;
      text = t(m.syncButton);
      icon = <SyncIcon />;
      break;
    case peerStatus.COMPLETE:
      style = connected ? styles.syncButtonDone : styles.syncButtonDisconnected;
      text = t(m.completeButton);
      icon = <DoneIcon />;
      break;
    case peerStatus.ERROR:
      style = styles.syncButtonError;
      text = t(m.errorButton);
      icon = <ErrorIcon color="red" />;
  }

  if (!connected && status !== peerStatus.COMPLETE) {
    style = styles.syncButtonDisconnected;
    text = t(m.disconnectedButton);
    icon = <ErrorIcon color="yellow" />;
  }

  if (pressed || status === peerStatus.PROGRESS) {
    style = styles.syncButtonProgress;
    text =
      progress === 1
        ? t(m.finishingButton)
        : ((progress || 0) * 100).toFixed(0) + "%";
    icon = (
      <View style={styles.progressBackground}>
        <Progress progress={progress} size={25} color="white" />
      </View>
    );
  }

  const handlePress = () => {
    // It takes a while for the server to respond with an updated peer state,
    // but we want to show an immediate change in the UI when the user presses
    // the button
    setPressed(true);
    onPress();
  };

  return (
    <TouchableNativeFeedback
      style={styles.syncTouchable}
      onPress={
        !connected || status === peerStatus.PROGRESS ? undefined : handlePress
      }
      hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
    >
      <View style={[styles.syncButtonBase, style]}>
        <View style={styles.iconContainer}>{icon}</View>
        <Text numberOfLines={1} style={styles.buttonText}>
          {text}
        </Text>
      </View>
    </TouchableNativeFeedback>
  );
};

const PeerInfoText = ({ children }: { children: React.Node }) => (
  <Text numberOfLines={1} style={styles.rowValue}>
    {children}
  </Text>
);

export const PeerItem = ({
  id,
  name,
  status,
  connected,
  progress,
  error,
  lastCompleted,
  onSyncPress,
  deviceType,
}: {
  ...$Exact<Peer>,
  onSyncPress: (id: string) => any,
}) => {
  const { formatMessage: t } = useIntl();

  let peerInfo = null;
  if (status === peerStatus.ERROR && error) {
    if (
      error.code === "ERR_VERSION_MISMATCH" &&
      // $FlowFixMe
      parseVersionMajor(error.themVersion) < parseVersionMajor(error.usVersion)
    ) {
      peerInfo = <PeerInfoText>{t(m.errorTheyNeedUgrade)}</PeerInfoText>;
    } else if (
      error.code === "ERR_VERSION_MISMATCH" &&
      // $FlowFixMe
      parseVersionMajor(error.themVersion) > parseVersionMajor(error.usVersion)
    ) {
      peerInfo = <PeerInfoText>{t(m.errorWeNeedUgrade)}</PeerInfoText>;
    } else if (error.code === "ERR_CLIENT_MISMATCH") {
      peerInfo = <PeerInfoText>{t(m.errorClientMismatch)}</PeerInfoText>;
    } else {
      peerInfo = <PeerInfoText>{error.message}</PeerInfoText>;
    }
  } else if (lastCompleted != null) {
    peerInfo = (
      <PeerInfoText>
        {t(m.syncLabel) + " "}
        <DateDistance date={new Date(lastCompleted)} />
      </PeerInfoText>
    );
  }
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
        {peerInfo}
      </View>
      <SyncButton
        connected={connected}
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
  onSyncPress,
}: {
  peers: Array<Peer>,
  onSyncPress: (id: string) => any,
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
    alignItems: "center",
  },
  sectionTitle: {
    fontWeight: "700",
    color: "white",
    fontSize: 22,
  },
  rowValue: {
    fontWeight: "400",
    color: "white",
    marginTop: 5,
  },
  container: {
    backgroundColor: "#2348B2",
  },
  peerIcon: {
    paddingHorizontal: 15,
  },
  itemInfo: { flexDirection: "column", flex: 1, marginRight: 10 },
  syncTouchable: {
    borderRadius: 10,
  },
  syncButtonBase: {
    width: 100,
    borderRadius: 10,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 6,
  },
  syncButtonReady: {
    borderWidth: 1,
    borderColor: "white",
    backgroundColor: "#2348B2",
  },
  syncButtonProgress: {
    borderWidth: 0,
    backgroundColor: "#3366FF",
  },
  syncButtonDone: {
    borderWidth: 0,
    backgroundColor: "#19337F",
  },
  syncButtonError: {
    borderWidth: 1,
    borderColor: "red",
    backgroundColor: "#2348B2",
  },
  syncButtonDisconnected: {
    borderWidth: 1,
    borderColor: "transparent",
    backgroundColor: "#2348B2",
  },
  iconContainer: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    flex: 1,
    color: "white",
    fontWeight: "500",
    fontSize: 16,
    textAlign: "center",
  },
  progressBackground: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#264CBF",
    alignItems: "center",
    justifyContent: "center",
  },
});
