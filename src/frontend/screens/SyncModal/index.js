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
import SettingsContext from "../../context/SettingsContext";

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
  const [{ experiments: p2pUpgrade }] = React.useContext(SettingsContext);

  const [
    {
      metadata: { projectKey },
    },
  ] = React.useContext(ConfigContext);

  const [listen, setListening] = React.useState<boolean>(false);
  const [peers, syncPeer, syncGetPeers] = usePeers(listen, deviceName);
  const [ssid, setSsid] = React.useState<null | string>(null);
  const [upgradeInfo, setUpgradeInfo] = React.useState({});
  const [backendState, setBackendState] = React.useState({});

  // HACK(kira): I wanted the backend state tracking effect to be able to also
  // trigger a re-render on an interval, which is what this state is for. I'm
  // sure there's a nicer way to accomplish this.
  const [fakeTrigger, setFakeTrigger] = React.useState(0);

  // P2P Upgrades effects
  // ----------------------------------------------------------------------
  // Backend State + Peers => Frontend render effect
  React.useEffect(() => {
    if (!backendState.server || !p2pUpgrade) return;
    const rState = getFrontendStateFromUpgradeState(backendState, peers);
    setUpgradeInfo(rState);
  }, [peers, backendState, fakeTrigger, p2pUpgrade]);

  // Backend state tracking effect. Interfaces with Node process for state &
  // control.
  React.useEffect(() => {
    let iv;
    function onState(state) {
      log("GOT BACKEND STATE", JSON.stringify(state));
      setBackendState(state);
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
        setFakeTrigger(Math.random());
      }, 3000);

      rnBridge.channel.post("p2p-upgrade::get-state");
      rnBridge.channel.post("p2p-upgrade::start-services");
    }
    if (!p2pUpgrade) setUpgradeInfo(null);
    else {
      log("startup", upgradeInfo);
      rnBridge.channel.addListener("p2p-upgrades-backend-ready", onReady);
      rnBridge.channel.post("p2p-upgrades-frontend-ready");
      setUpgradeInfo({ state: UpgradeState.Searching });
    }

    return () => {
      if (p2pUpgrade) {
        log("CLEANUP!");
        if (iv) clearInterval(iv);
        rnBridge.channel.removeListener("p2p-upgrade::state", onState);
        rnBridge.channel.removeListener("p2p-upgrade::error", onError);
        rnBridge.channel.post("p2p-upgrade::stop-services");
      }
    };
  }, [p2pUpgrade]);
  // ----------------------------------------------------------------------

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

function getFrontendStateFromUpgradeState(state, peers) {
  // Error present in ANY subsystem.
  if (state.server.state === BackendUpgradeState.Server.Error) {
    return {
      state: UpgradeState.GenericError,
      context: state.server.context.message,
    };
  }
  if (state.downloader.search.state === BackendUpgradeState.Search.Error) {
    return {
      state: UpgradeState.GenericError,
      context: state.downloader.search.context.message,
    };
  }
  if (state.downloader.download.state === BackendUpgradeState.Download.Error) {
    return {
      state: UpgradeState.GenericError,
      context: state.downloader.download.context.message,
    };
  }
  if (state.downloader.check.state === BackendUpgradeState.Check.Error) {
    return {
      state: UpgradeState.GenericError,
      context: state.downloader.check.context.message,
    };
  }

  // Edge case I've (kira) seen once that shouldn't happen.
  if (state.downloader.search.state === BackendUpgradeState.Search.Idle) {
    return {
      state: UpgradeState.GenericError,
      context: "Search did not initialize correctly.",
    };
  }

  // Upgrade available + waiting for syncs to finish.
  if (
    state.downloader.check.state === BackendUpgradeState.Check.Available &&
    peers.some(p => p.status === peerStatus.PROGRESS)
  ) {
    return { state: UpgradeState.WaitingForSync, context: null };
  }

  // Upgrade available + not waiting for syncs to finish.
  if (state.downloader.check.state === BackendUpgradeState.Check.Available) {
    return {
      state: UpgradeState.ReadyToUpgrade,
      context: state.downloader.check.context,
    };
  }

  // Upgrade is downloading.
  if (
    state.downloader.download.state === BackendUpgradeState.Download.Downloading
  ) {
    const progress = state.downloader.download.context;
    return {
      state: UpgradeState.Downloading,
      context: { progress: progress.sofar / progress.total },
    };
  }

  // Subsystem has been searching for upgrades for < 14 seconds.
  if (
    state.downloader.search.state === BackendUpgradeState.Search.Searching &&
    Date.now() - state.downloader.search.context.startTime < 14 * 1000
  ) {
    return { state: UpgradeState.Searching, context: null };
  }

  // Subsystem is still uploading an upgrade to other peers.
  if (
    (state.server.state === BackendUpgradeState.Server.Sharing ||
      state.server.state === BackendUpgradeState.Server.Draining) &&
    state.server.context.length > 0
  ) {
    return { state: UpgradeState.Draining, context: null };
  }

  // Subsystem has been searching for upgrades for > 14 seconds.
  if (state.downloader.search.state === BackendUpgradeState.Search.Searching) {
    return { state: UpgradeState.NoUpdatesFound, context: null };
  }

  return { state: UpgradeState.Unknown, context: null };
}

export default SyncModal;
