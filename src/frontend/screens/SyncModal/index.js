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
import { defineMessages, FormattedMessage } from "react-intl";
import { getUniqueId } from "react-native-device-info";
import rnBridge from "nodejs-mobile-react-native";

import SyncView from "./SyncView";
import bugsnag from "../../lib/logger";
import useAllObservations from "../../hooks/useAllObservations";
import ConfigContext from "../../context/ConfigContext";
import HeaderTitle from "../../sharedComponents/HeaderTitle";
import usePeers from "./usePeers";
import { peerStatus } from "./PeerList";
import { UpgradeState as BackendUpgradeState } from "../../../backend/lib/constants";
import ApkInstaller from "../../lib/ApkInstaller";

import debug from "debug";
const log = debug("mapeo-mobile:SyncModal:index");

type Props = {
  navigation: any,
};

export const UpgradeState = {
  Searching: 0,
  Downloading: 1,
  GenericError: 2,
  PermissionError: 3,
  ReadyToUpgrade: 4,
  NoUpdatesFound: 5,
  WaitingForSync: 6,
  Draining: 7,
  Unknown: 8,
};

const m = defineMessages({
  errorDialogOk: {
    id: "screens.SyncModal.errorDialogOk",
    defaultMessage: "OK",
    description:
      "Button to dismiss error alert about incompatible sync protocol",
  },
  syncHeader: {
    id: "screens.SyncModal.SyncView.syncHeader",
    defaultMessage: "Synchronize",
    description: "Header of sync screen",
  },
});

const deviceName: string = "Android " + getUniqueId().slice(0, 4).toUpperCase();

const SyncModal = ({ navigation }: Props) => {
  const [, reload] = useAllObservations();
  const [
    {
      metadata: { projectKey },
    },
  ] = React.useContext(ConfigContext);

  const [listen, setListening] = React.useState<boolean>(false);
  const [peers, syncPeer, syncGetPeers] = usePeers(listen, deviceName);
  const [ssid, setSsid] = React.useState<null | string>(null);
  const [upgradeInfo, setUpgradeInfo] = React.useState({});

  // P2P Upgrades effect. (Interfaces with Node process for state & control.)
  React.useEffect(() => {
    log("startup", upgradeInfo);
    rnBridge.channel.addListener("p2p-upgrades-backend-ready", onReady);
    rnBridge.channel.post("p2p-upgrades-frontend-ready");
    setUpgradeInfo({ state: UpgradeState.Searching });

    let lastState, iv;

    function onState(state) {
      log("GOT BACKEND STATE", JSON.stringify(state));
      const rState = getReactStateFromUpgradeState(state, peers);
      const rCtx = getReactContextFromUpgradeState(state, peers);
      setUpgradeInfo({ state: rState, context: rCtx });
      lastState = state;
    }

    function onError(err) {
      log("BACKEND STATE ERROR", err.message);
      setUpgradeInfo({
        state: UpgradeState.GenericError,
        context: err.message,
      });
    }

    function onReady() {
      rnBridge.channel.removeListener("p2p-upgrades-backend-ready", onReady);
      log("backend says they are ready!");
      rnBridge.channel.post("p2p-upgrades-frontend-ready");

      rnBridge.channel.addListener("p2p-upgrade::error", onError);
      rnBridge.channel.addListener("p2p-upgrade::state", onState);
      iv = setInterval(() => {
        const rState = getReactStateFromUpgradeState(lastState, peers);
        const rCtx = getReactContextFromUpgradeState(lastState, peers);
        setUpgradeInfo({ state: rState, context: rCtx });
      }, 3000);

      rnBridge.channel.post("p2p-upgrade::get-state");
      rnBridge.channel.post("p2p-upgrade::start-services");
    }

    return () => {
      log("cleanup!");
      if (iv) clearInterval(iv);
      rnBridge.channel.removeListener("p2p-upgrade::state", onState);
      rnBridge.channel.removeListener("p2p-upgrade::error", onError);
      rnBridge.channel.post("p2p-upgrade::stop-services");
    };
  }, []);

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
        // On connection change, ensure we have the latest peer info from
        // backend.
        syncGetPeers();
        setListening(true);
      }
    };
    // When the modal opens, start announcing this device as available for sync
    setListening(true);
    // Subscribe to NetInfo to know when the user connects/disconnects to wifi
    subscriptions.push({
      remove: NetInfo.addEventListener(handleConnectionChange),
    });
    // Keep the screen awake whilst on this screen
    KeepAwake.activate();
    return () => {
      // When the modal closes, stop announcing for sync
      setListening(false);
      // Unsubscribe all listeners
      subscriptions.forEach(s => s.remove());
      // Turn off keep screen awake
      KeepAwake.deactivate();
    };
  }, [syncGetPeers]);

  React.useEffect(
    () =>
      function onUnmount() {
        // Reload observations on unmount (since new ones might have synced)
        reload();
      },
    [reload]
  );

  const handleWifiPress = () => {
    OpenSettings.wifiSettings();
  };

  const errorPeer = peers.find(p => p.error);
  if (
    errorPeer &&
    errorPeer.error.isNewError &&
    errorPeer.error.code === "ERR_VERSION_MISMATCH"
  ) {
    Alert.alert(errorPeer.state.errorMsg, errorPeer.state.errorDesc);
  }

  return (
    <SyncView
      deviceName={deviceName}
      peers={peers}
      ssid={ssid}
      onClosePress={() => navigation.pop()}
      onWifiPress={handleWifiPress}
      onSyncPress={syncPeer}
      onInstallPress={onInstallPress}
      projectKey={projectKey}
      upgradeInfo={upgradeInfo}
    />
  );

  function onInstallPress() {
    if (upgradeInfo.state !== UpgradeState.ReadyToUpgrade) {
      log("### UPGRADE: not in ready state");
      return;
    }
    ApkInstaller.install(upgradeInfo.context.filename)
      .then(() => {
        log("### UPGRADE: install ok!");
      })
      .catch(err => {
        log("### UPGRADE: apk install failed", err);
      });
  }
};

SyncModal.navigationOptions = {
  headerTintColor: "white",
  headerStyle: {
    backgroundColor: "#2348B2",
  },
  headerTitle: () => (
    <HeaderTitle style={{ color: "white" }}>
      <FormattedMessage {...m.syncHeader} />
    </HeaderTitle>
  ),
};

// Object -> UpgradeState
function getReactStateFromUpgradeState(state, peers) {
  // Error present in ANY subsystem.
  if (
    state.server.state === BackendUpgradeState.Server.Error ||
    state.downloader.search.state === BackendUpgradeState.Search.Error ||
    state.downloader.download.state === BackendUpgradeState.Download.Error ||
    state.downloader.check.state === BackendUpgradeState.Check.Error
  ) {
    return UpgradeState.GenericError;
  }

  // Upgrade available + waiting for syncs to finish.
  if (
    state.downloader.check.state === BackendUpgradeState.Check.Available &&
    peers.some(p => p.status === peerStatus.PROGRESS)
  ) {
    return UpgradeState.WaitingForSync;
  }

  // Upgrade available + not waiting for syncs to finish.
  if (state.downloader.check.state === BackendUpgradeState.Check.Available) {
    return UpgradeState.ReadyToUpgrade;
  }

  // Upgrade is downloading.
  if (
    state.downloader.download.state === BackendUpgradeState.Download.Downloading
  ) {
    return UpgradeState.Downloading;
  }

  // Subsystem has been searching for upgrades for < 14 seconds.
  if (
    state.downloader.search.state === BackendUpgradeState.Search.Searching &&
    Date.now() - state.downloader.search.context.startTime < 14 * 1000
  ) {
    return UpgradeState.Searching;
  }

  // Subsystem is still uploading an upgrade to other peers.
  if (
    (state.server.state === BackendUpgradeState.Server.Sharing ||
      state.server.state === BackendUpgradeState.Server.Draining) &&
    state.server.context.length > 0
  ) {
    return UpgradeState.Draining;
  }

  // Subsystem has been searching for upgrades for > 14 seconds.
  if (state.downloader.search.state === BackendUpgradeState.Search.Searching) {
    return UpgradeState.NoUpdatesFound;
  }

  return UpgradeState.Unknown;
}

// Object -> any
function getReactContextFromUpgradeState(state, peers) {
  // Error present in ANY subsystem.
  if (state.server.state === BackendUpgradeState.Server.Error) {
    return state.server.context.message;
  }
  if (state.downloader.search.state === BackendUpgradeState.Search.Error) {
    return state.downloader.search.context.message;
  }
  if (state.downloader.download.state === BackendUpgradeState.Download.Error) {
    return state.downloader.download.context.message;
  }
  if (state.downloader.check.state === BackendUpgradeState.Check.Error) {
    return state.downloader.check.context.message;
  }

  // Upgrade available + waiting for syncs to finish.
  if (
    state.downloader.check.state === BackendUpgradeState.Check.Available &&
    peers.some(p => p.status === peerStatus.PROGRESS)
  ) {
    return null;
  }

  // Upgrade available + not waiting for syncs to finish.
  if (state.downloader.check.state === BackendUpgradeState.Check.Available) {
    return state.downloader.check.context;
  }

  // Upgrade is downloading.
  if (
    state.downloader.download.state === BackendUpgradeState.Download.Downloading
  ) {
    const progress = state.downloader.download.context;
    log("$$$ 1", state.downloader.download);
    return { progress: progress.sofar / progress.total };
  }

  // Subsystem has been searching for upgrades for < 14 seconds.
  if (
    state.downloader.search.state === BackendUpgradeState.Search.Searching &&
    Date.now() - state.downloader.search.context.startTime < 14 * 1000
  ) {
    return null;
  }

  // Subsystem is still uploading an upgrade to other peers.
  if (
    (state.server.state === BackendUpgradeState.Server.Sharing ||
      state.server.state === BackendUpgradeState.Server.Draining) &&
    state.server.context.length > 0
  ) {
    return null;
  }

  // Subsystem has been searching for upgrades for > 14 seconds.
  if (state.downloader.search.state === BackendUpgradeState.Search.Searching) {
    return null;
  }

  return null;
}

export default SyncModal;
