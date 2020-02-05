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
import { Alert } from "react-native";
import { NetworkInfo } from "react-native-network-info";
import OpenSettings from "react-native-android-open-settings";
import KeepAwake from "react-native-keep-awake";
import { defineMessages, useIntl, FormattedMessage } from "react-intl";

import SyncView from "./SyncView";
import api from "../../api";
import bugsnag from "../../lib/logger";
import useAllObservations from "../../hooks/useAllObservations";
import ConfigContext from "../../context/ConfigContext";
import { peerStatus } from "./PeerList";
import { parseVersionMajor } from "../../lib/utils";
import HeaderTitle from "../../sharedComponents/HeaderTitle";

import type { Peer } from "./PeerList";
import type { ServerPeer, PeerError } from "../../api";

type Props = {
  navigation: any
};

const m = defineMessages({
  errorVersionThemBadTitle: {
    id: "screens.SyncModal.errorVersionThemBadTitle",
    defaultMessage: "{deviceName} needs to upgrade Mapeo",
    description:
      "Title of error alert when trying to sync with an incompatible older version of Mapeo"
  },
  errorVersionThemBadDesc: {
    id: "screens.SyncModal.errorVersionThemBadDesc",
    defaultMessage:
      "The device you are trying to sync with needs to upgrade Mapeo to the latest version in order to sync with you.",
    description:
      "Content of error alert when trying to sync with an incompatible older version of Mapeo"
  },
  errorVersionUsBadTitle: {
    id: "screens.SyncModal.errorVersionUsBadTitle",
    defaultMessage: "You need to upgrade Mapeo",
    description:
      "Title of error alert when trying to sync with an incompatible newer version of Mapeo"
  },
  errorVersionUsBadDesc: {
    id: "screens.SyncModal.errorVersionUsBadDesc",
    defaultMessage:
      "The device you are trying to sync has a newer version of Mapeo. You need to upgrade Mapeo in order to sync with this device.",
    description:
      "Content of error alert when trying to sync with an incompatible newer version of Mapeo"
  },
  errorDialogOk: {
    id: "screens.SyncModal.errorDialogOk",
    defaultMessage: "OK",
    description:
      "Button to dismiss error alert about incompatible sync protocol"
  },
  syncHeader: {
    id: "screens.SyncModal.SyncView.syncHeader",
    defaultMessage: "Synchronize",
    description: "Header of sync screen"
  }
});

const deviceName: string =
  "Android " +
  Math.floor(Math.random() * 1e9)
    .toString(36)
    .slice(0, 4)
    .toUpperCase();

const SyncModal = ({ navigation }: Props) => {
  const { formatMessage: t } = useIntl();
  const [, reload] = useAllObservations();
  const [
    {
      metadata: { projectKey }
    }
  ] = React.useContext(ConfigContext);
  const [serverPeers, setServerPeers] = React.useState<ServerPeer[]>([]);
  const [syncErrors, setSyncErrors] = React.useState<Map<string, PeerError>>(
    new Map<string, PeerError>()
  );
  const [ssid, setSsid] = React.useState<null | string>(null);
  const opened = React.useRef(Date.now());

  React.useEffect(() => {
    const subscriptions = [];
    const handleConnectionChange = async (data: {}) => {
      // NetInfoData does not actually tell us whether wifi is turned on, it just
      // tells us what connection the phone is using for data. E.g. it could be
      // connected to a wifi network but instead using 4g for data, in which case
      // `data.type` will not be wifi. So instead we just use the event listener
      // from NetInfo, and when the connection changes we look up the SSID to see
      // whether the user is connected to a wifi network.
      // TODO: We currently do not know whether wifi is turned off, we only know
      // whether the user is connected to a wifi network or not.
      let ssid = null;
      try {
        ssid = await NetworkInfo.getSSID();
      } catch (e) {
        bugsnag.notify(e);
      } finally {
        // Even if we don't get the SSID, we still want to show that a wifi
        // network is connected.
        setSsid(ssid);
      }
    };
    // When the modal opens, start announcing this device as available for sync
    api.syncJoin(deviceName);
    // Subscribe to peer updates
    subscriptions.push(api.addPeerListener(setServerPeers));
    // Subscribe to NetInfo to know when the user connects/disconnects to wifi
    subscriptions.push({
      remove: NetInfo.addEventListener(handleConnectionChange)
    });
    // Keep the screen awake whilst on this screen
    KeepAwake.activate();
    return () => {
      // When the modal closes, stop announcing for sync
      api.syncLeave();
      // Unsubscribe all listeners
      subscriptions.forEach(s => s.remove());
      // Turn off keep screen awake
      KeepAwake.deactivate();
    };
  }, []);

  React.useEffect(
    () =>
      function onUnmount() {
        // Reload observations on unmount (since new ones might have synced)
        reload();
      },
    [reload]
  );

  React.useEffect(() => {
    setSyncErrors(syncErrors => {
      const newSyncErrors = new Map<string, PeerError>(syncErrors);
      serverPeers.forEach(peer => {
        const state = peer.state;
        if (state && state.topic === "replication-error") {
          const isNewError = !newSyncErrors.has(peer.id);
          if (isNewError && state.code === "ERR_VERSION_MISMATCH") {
            if (
              parseVersionMajor(state.usVersion || "") >
              parseVersionMajor(state.themVersion || "")
            ) {
              Alert.alert(
                t(m.errorVersionThemBadTitle, { deviceName }),
                t(m.errorVersionThemBadDesc, { deviceName })
              );
            } else {
              Alert.alert(
                t(m.errorVersionUsBadTitle, { deviceName }),
                t(m.errorVersionUsBadDesc, { deviceName })
              );
            }
          }
          newSyncErrors.set(peer.id, state);
        }
      });
      return newSyncErrors;
    });
  }, [serverPeers, t]);

  const handleSyncPress = (peerId: string) => {
    const peer = serverPeers.find(peer => peer.id === peerId);
    // Peer could have vanished in the moment the button was pressed
    if (peer) api.syncStart(peer);
  };

  const handleWifiPress = () => {
    OpenSettings.wifiSettings();
  };

  const peers = getDerivedPeerState(serverPeers, syncErrors, opened.current);

  return (
    <SyncView
      deviceName={deviceName}
      peers={peers}
      ssid={ssid}
      onClosePress={() => navigation.pop()}
      onWifiPress={handleWifiPress}
      onSyncPress={handleSyncPress}
      projectKey={projectKey}
    />
  );
};

SyncModal.navigationOptions = {
  headerTintColor: "white",
  headerStyle: {
    backgroundColor: "#2348B2"
  },
  headerTitle: (
    <HeaderTitle style={{ color: "white" }}>
      <FormattedMessage {...m.syncHeader} />
    </HeaderTitle>
  )
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
function getDerivedPeerState(
  serverPeers: ServerPeer[],
  syncErrors,
  since: number
): Array<Peer> {
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
      (state.lastCompletedDate || 0) > since ||
      state.topic === "replication-complete"
    ) {
      status = peerStatus.COMPLETE;
    }
    return {
      id: serverPeer.id,
      name: serverPeer.name,
      status: status,
      // $FlowFixMe
      lastCompleted: state.lastCompletedDate,
      progress: getPeerProgress(serverPeer.state),
      error: syncErrors.get(serverPeer.id),
      deviceType: serverPeer.deviceType
    };
  });
}

export default SyncModal;

// We combine media and database items in progress. In order to show roughtly
// accurate progress, this weighting is how much more progress a media item
// counts vs. a database item
const MEDIA_WEIGHTING = 1;
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
  const progress = total > 0 ? sofar / total : 0;
  // Round progress to 2-decimal places. PeerItem is memoized, so it will not
  // update if progress does not change. Without rounding PeerItem updates
  // unnecessarily on every progress change, when we are only showing the user a
  // rounded percentage progress. Increase this to 3-decimal places if you want
  // to show more detail to the user.
  return Math.round(progress * 100) / 100;
}
