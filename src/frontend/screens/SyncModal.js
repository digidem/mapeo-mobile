// @flow
import React from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import { TouchableNativeFeedback } from "react-native-gesture-handler";
import { CircleSnail, Circle } from "react-native-progress";
import nodejs from "nodejs-mobile-react-native";

import IconButton from "../sharedComponents/IconButton";
import { CloseIcon } from "../sharedComponents/icons";
import { syncJoin, syncLeave, syncGetPeers, syncStart } from "../api";
import { withObservations } from "../context/ObservationsContext";
import type { ObservationsContext } from "../context/ObservationsContext";

type HeaderProps = {
  onClose: () => void
};

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

type Peer = {|
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

type ServerPeer = {
  id: string,
  name: string,
  // Host address for peer
  host: string,
  // Port for peer
  port: number,
  state?:
    | {|
        topic: "replication-progress",
        message: {|
          db: {| sofar: number, total: number |},
          media: {| sofar: number, total: number |}
        |},
        lastCompletedDate?: number
      |}
    | {|
        topic: "replication-wifi-ready",
        lastCompletedDate?: number
      |}
    | {|
        topic: "replication-complete",
        // The time of completed sync in milliseconds since UNIX Epoch
        message: number,
        lastCompletedDate?: number
      |}
    | {|
        topic: "replication-error",
        // Error message
        message: string,
        lastCompletedDate?: number
      |}
    | {|
        topic: "replication-started",
        lastCompletedDate?: number
      |}
};

const peerStatus: PeerStatus = {
  READY: "READY",
  PROGRESS: "PROGRESS",
  ERROR: "ERROR",
  COMPLETE: "COMPLETE"
};

const SyncModalHeader = ({ onClose, variant }: HeaderProps) => (
  <View style={styles.header}>
    <IconButton onPress={onClose}>
      <CloseIcon color="white" />
    </IconButton>
    <Text numberOfLines={1} style={styles.title}>
      Sync
    </Text>
  </View>
);

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

const PeerView = ({
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
      <View style={{ flexDirection: "column", flex: 1 }}>
        <Text style={styles.sectionTitle}>{name}</Text>
        {lastCompleted && (
          <Text style={styles.rowValue}>
            {new Date(lastCompleted).toLocaleString()}
          </Text>
        )}
      </View>
      {status === peerStatus.PROGRESS && (
        <View
          style={{
            width: 80,
            flex: 0,
            backgroundColor: "lightblue",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Progress progress={progress} />
        </View>
      )}
    </View>
  </TouchableNativeFeedback>
);

type Props = {
  navigation: any,
  reload: $ElementType<ObservationsContext, "reload">
};

type State = {
  serverPeers: Array<ServerPeer>,
  // Map of peer ids to errors
  syncErrors: Map<string, string>,
  // Whether there was an error trying to load peer status
  loadError?: boolean
};

class SyncModal extends React.Component<Props, State> {
  state = { serverPeers: [], syncErrors: new Map() };
  _opened: number;
  _timeoutIds: Map<string, TimeoutID> = new Map();

  constructor(props: Props) {
    super(props);
    // When the modal opens, start announcing this device as available for sync
    syncJoin();
    this._opened = Date.now();
  }

  componentDidMount() {
    this.getPeerList();
    // We sidestep the http API here, and instead of polling the endpoint, we
    // listen for an event from mapeo-core whenever the peers change, then
    // request an updated peer list.
    nodejs.channel.addListener("peer-update", this.updatePeers);
  }

  componentWillUnmount() {
    nodejs.channel.removeListener("peer-update", this.updatePeers);
    // When the modal closes, stop announcing for sync
    syncLeave();
    for (var timeoutId of this._timeoutIds.values()) {
      clearTimeout(timeoutId);
    }
    this.props.reload();
  }

  handleSyncPress = (peerId: string) => {
    const peer = this.state.serverPeers.find(peer => peer.id === peerId);
    // Peer could have vanished in the moment the button was pressed
    if (peer) syncStart(peer);
  };

  async getPeerList() {
    try {
      const peers = await syncGetPeers();
      this.updatePeers(peers);
    } catch (error) {
      console.error(error);
      this.setState({ loadError: true });
    }
  }

  updatePeers = (serverPeers: Array<ServerPeer> = []) => {
    let errors = this.state.syncErrors;
    serverPeers.forEach(peer => {
      if (peer.state && peer.state.topic === "replication-error") {
        errors = new Map(this.state.syncErrors);
        errors.set(peer.id, peer.state.message);
      }
    });
    this.setState({ serverPeers, syncErrors: errors });
  };

  /**
   * State in Mapeo Core can loose the history of an error or completion of sync.
   * In this sync modal, for the lifecycle of the component:
   * 1. If replication has started or in progress, that overrides any state
   *    (completion or error)
   * 2. If there is an error, that remains in the state until the modal is closed
   * 3. A peer remains "completed" another sync starts of the modal is closed
   * 4. A peer is only in the "ready" state when first discovered
   */
  getDerivedPeerState() {
    const { serverPeers, syncErrors } = this.state;
    return serverPeers.map(serverPeer => {
      let status = peerStatus.READY;
      const state = serverPeer.state || {};
      if (
        state.topic === "replication-progress" ||
        state.topic === "replication-started"
      ) {
        status = peerStatus.PROGRESS;
      } else if (
        syncErrors.has(serverPeer.id) ||
        state.topic === "replication-error"
      ) {
        status = peerStatus.ERROR;
      } else if (
        (state.lastCompletedDate || 0) > this._opened ||
        state.topic === "replication-complete"
      ) {
        status = peerStatus.COMPLETE;
      }
      return {
        id: serverPeer.id,
        name: serverPeer.name,
        status: status,
        lastCompleted: state.lastCompletedDate,
        progress: getPeerProgress(serverPeer.state),
        error: syncErrors.get(serverPeer.id)
      };
    });
  }

  render() {
    const { navigation } = this.props;
    const peers = this.getDerivedPeerState();
    return (
      <View style={styles.container}>
        <SyncModalHeader onClose={() => navigation.pop()} />
        <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
          <View style={styles.infoArea}>
            {peers.map(peer => (
              <PeerView
                {...peer}
                key={peer.id}
                onSyncPress={this.handleSyncPress}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default withObservations(["reload"])(SyncModal);

// We combine media and database items in progress. In order to show roughtly
// accurate progress, this weighting is how much more progress a media item
// counts vs. a database item
const MEDIA_WEIGHTING = 50;
function getPeerProgress(
  peerState?: $ElementType<ServerPeer, "state">
): number | void {
  if (
    !peerState ||
    peerState.topic !== "replication-progress" ||
    !peerState.message ||
    !peerState.message.db ||
    !peerState.message.media
  )
    return;
  const total =
    (peerState.message.db.total || 0) +
    (peerState.message.media.total || 0) * MEDIA_WEIGHTING;
  const sofar =
    (peerState.message.db.sofar || 0) +
    (peerState.message.media.sofar || 0) * MEDIA_WEIGHTING;
  return total > 0 ? sofar / total : 0;
}

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
    backgroundColor: "rgba(0,0,0,0.85)",
    flexDirection: "column"
  },
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
  }
});
