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
  const [upgradeState, setUpgradeState] = React.useState<string>("init");
  const [upgradeContext, setUpgradeContext] = React.useState<any>(0);

  React.useEffect(() => {
    log("startup", upgradeState);
    rnBridge.channel.addListener("p2p-upgrades-backend-ready", onReady);
    rnBridge.channel.post("p2p-upgrades-frontend-ready");
    function onReady() {
      rnBridge.channel.removeListener("p2p-upgrades-backend-ready", onReady);
      log("backend says they are ready!");
      rnBridge.channel.post("p2p-upgrades-frontend-ready");
      rnBridge.channel.addListener("p2p-upgrade::state", state => {
        log(state.downloader);
        if (state.downloader.search.context) {
          const str = `${JSON.stringify(
            state.downloader.search.context.upgrades
          )}`;
          const rState = getReactStateFromUpgradeState(state);
          const rCtx = getReactContextFromUpgradeState(state);
          setUpgradeState(rState);
          setUpgradeContext(rCtx);
        }
      });
      rnBridge.channel.post("p2p-upgrade::get-state");
      rnBridge.channel.post("p2p-upgrade::start-services");
    }
    return () => {
      log("cleanup!");
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
      projectKey={projectKey}
      upgradeState={upgradeState}
      upgradeContext={upgradeContext}
    />
  );
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

// TODO: need to inject sync state also!
// Object -> string
function getReactStateFromUpgradeState(state) {
  return UpgradeState.Draining;
}

// TODO: need to inject sync state also!
// Object -> string
function getReactContextFromUpgradeState(state) {
  return 0;
}

export default SyncModal;
