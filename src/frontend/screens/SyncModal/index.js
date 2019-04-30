// @flow
/**
 * This component contains all the state logic for sync. Some state is stored in
 * Mapeo Core, but whether a peer has done syncing or an error during sync can
 * be lost during the time the sync modal remains open. This component also
 * manages the network / wifi state. All the rendering and interaction logic is
 * in `./PeerList`.
 */
import React from "react";
import NetInfo from "@react-native-community/netinfo";
import { NetworkInfo } from "react-native-network-info";
import OpenSettings from "react-native-android-open-settings";

import SyncView from "./SyncView";
import { syncJoin, syncLeave, addPeerListener, syncStart } from "../../api";
import { withObservations } from "../../context/ObservationsContext";
import { peerStatus } from "./PeerList";
import type { ObservationsContext } from "../../context/ObservationsContext";
import type { NetInfoData } from "@react-native-community/netinfo";
import type { Peer } from "./PeerList";
import type { ServerPeer } from "../../api";

type Props = {
  navigation: any,
  reload: $ElementType<ObservationsContext, "reload">
};

type State = {
  serverPeers: Array<ServerPeer>,
  // Map of peer ids to errors
  syncErrors: Map<string, string>,
  // Whether there was an error trying to load peer status
  loadError?: boolean,
  // SSID of wifi network, if connected
  ssid: null | string
};

class SyncModal extends React.Component<Props, State> {
  // Assume wifi is turned on at first (better UX)
  state = { serverPeers: [], syncErrors: new Map(), ssid: null };
  _opened: number;
  _subscriptions: Array<{ remove: () => void }> = [];

  componentDidMount() {
    // When the modal opens, start announcing this device as available for sync
    syncJoin();
    this._opened = Date.now();
    // Subscribe to peer updates
    this._subscriptions.push(addPeerListener(this.updatePeers));
    // Subscribe to NetInfo to know when the user connects/disconnects to wifi
    this._subscriptions.push(
      NetInfo.addEventListener(
        "connectionChange",
        // $FlowFixMe
        this.handleConnectionChange
      )
    );
  }

  componentWillUnmount() {
    // When the modal closes, stop announcing for sync
    syncLeave();
    // Unsubscribe all listeners
    this._subscriptions.forEach(s => s.remove());
    this.props.reload();
  }

  handleConnectionChange = async (data: NetInfoData) => {
    // NetInfoData does not actually tell us whether wifi is turned on, it just
    // tells us what connection the phone is using for data. E.g. it could be
    // connected to a wifi network but instead using 4g for data, in which case
    // `data.type` will not be wifi. So instead we just use the event listener
    // from NetInfo, and when the connection changes we look up the SSID to see
    // whether the user is connected to a wifi network.
    // TODO: We currently do not know whether wifi is turned off, we only know
    // whether the user is connected to a wifi network or not.
    let ssid;
    try {
      ssid = await NetworkInfo.getSSID();
    } catch (e) {
      console.error(e);
    } finally {
      // Even if we don't get the SSID, we still want to show that a wifi
      // network is connected.
      this.setState({ ssid });
    }
  };

  handleSyncPress = (peerId: string) => {
    const peer = this.state.serverPeers.find(peer => peer.id === peerId);
    // Peer could have vanished in the moment the button was pressed
    if (peer) syncStart(peer);
  };

  handleWifiPress = () => {
    OpenSettings.wifiSettings();
  };

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
  getDerivedPeerState(): Array<Peer> {
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
      <SyncView
        peers={peers}
        ssid={this.state.ssid}
        onClosePress={() => navigation.pop()}
        onWifiPress={this.handleWifiPress}
        onSyncPress={this.handleSyncPress}
      />
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
