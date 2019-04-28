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
import type { NavigationScreenProp } from "react-navigation";
import type { ObservationsContext } from "../context/ObservationsContext";

type HeaderProps = {
  onClose: () => void
};

const READY_TO_SYNC: "READY_TO_SYNC" = "READY_TO_SYNC";
const SYNC_IN_PROGRESS: "SYNC_IN_PROGRESS" = "SYNC_IN_PROGRESS";
const SYNC_ERROR: "SYNC_ERROR" = "SYNC_ERROR";
const SYNC_SUCCESS: "SYNC_SUCCESS" = "SYNC_SUCCESS";

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

const Target = ({
  id,
  name,
  status,
  progress,
  lastCompletedDate,
  onSyncPress
}: {
  id: string,
  name: string,
  status: "READY_TO_SYNC" | "SYNC_IN_PROGRESS" | "SYNC_ERROR" | "SYNC_SUCCESS",
  progress?: { sofar: number, total: number },
  lastCompletedDate?: number,
  onSyncPress: (id: string) => any
}) => {
  console.log(progress);
  return (
    <TouchableNativeFeedback onPress={() => onSyncPress(id)}>
      <View style={styles.row}>
        <View style={{ flexDirection: "column", flex: 1 }}>
          <Text style={styles.sectionTitle}>{name}</Text>
          {lastCompletedDate && (
            <Text style={styles.rowValue}>
              {new Date(lastCompletedDate).toLocaleString()}
            </Text>
          )}
        </View>
        {status === SYNC_IN_PROGRESS && (
          <View
            style={{
              width: 80,
              flex: 0,
              backgroundColor: "lightblue",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Progress
              progress={
                progress && progress.total > 0
                  ? progress.sofar / progress.total
                  : undefined
              }
            />
          </View>
        )}
      </View>
    </TouchableNativeFeedback>
  );
};

type Props = {
  navigation: NavigationScreenProp<{}>,
  reload: $ElementType<ObservationsContext, "reload">
};

type State = {
  peers: Array<any>,
  error: boolean
};

class SyncModal extends React.Component<Props, State> {
  state = { peers: [], error: false, lastUpdates: new Map() };
  constructor(props: Props) {
    super(props);
    // When the modal opens, start announcing this device as available for sync
    syncJoin();
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
    this.props.reload();
  }
  handleSyncPress = (peerId: string) => {
    const peer = this.state.peers.find(peer => peer.id === peerId);
    // Peer could have vanished in the moment the button was pressed
    if (peer) syncStart(peer);
  };
  async getPeerList() {
    try {
      const peers = await syncGetPeers();
      this.updatePeers(peers);
    } catch (error) {
      console.error(error);
      this.setState({ error });
    }
  }
  updatePeers = (peers: Array<any> = []) => {
    console.log(peers.map(peer => peer.state));
    this.setState({ peers });
  };
  render() {
    const { navigation } = this.props;
    const { peers } = this.state;
    return (
      <View style={styles.container}>
        <SyncModalHeader onClose={() => navigation.pop()} />
        <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
          <View style={styles.infoArea}>
            {peers.map(peer => (
              <Target
                key={peer.id}
                id={peer.id}
                onSyncPress={this.handleSyncPress}
                name={peer.name}
                status={getPeerStatus(peer.state)}
                progress={getPeerProgress(peer.state)}
                lastCompletedDate={peer.state && peer.state.lastCompletedDate}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default withObservations(["reload"])(SyncModal);

type PeerState = {
  topic: string,
  message: any
};

function getPeerStatus(peerState?: PeerState = {}) {
  switch (peerState.topic) {
    case "replication-wifi-ready":
      return READY_TO_SYNC;
    case "replication-progress":
    case "replication-started":
      return SYNC_IN_PROGRESS;
    case "replication-error":
      return SYNC_ERROR;
    case "replication-complete":
      return SYNC_SUCCESS;
    default:
      return READY_TO_SYNC;
  }
}

// We combine media and database items in progress. In order to show roughtly
// accurate progress, this weighting is how much more progress a media item
// counts vs. a database item
const MEDIA_WEIGHTING = 50;
function getPeerProgress(
  peerState?: PeerState
): { sofar: number, total: number } | void {
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
  return { total, sofar };
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
  rowLabel: {
    color: "white",
    fontWeight: "700",
    minWidth: "50%"
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
