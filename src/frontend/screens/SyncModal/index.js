/**
 * This component contains all the state logic for sync. Some state is stored in
 * Mapeo Core, but whether a peer has done syncing or an error during sync can
 * be lost during the time the sync modal remains open. This component also
 * manages the network / wifi state. All the rendering and interaction logic is
 * in `./PeerList`.
 */
import React from "react";
import { Alert } from "react-native";
import OpenSettings from "react-native-android-open-settings";
import { defineMessages, FormattedMessage } from "react-intl";
import { getUniqueId } from "react-native-device-info";

import SyncView from "./SyncView";
import { useAllObservations } from "../../hooks/useAllObservations";
import useWifiStatus from "../../hooks/useWifiStatus";
import ConfigContext from "../../context/ConfigContext";
import usePeers from "./usePeers";
import KeepAwake from "react-native-keep-awake";
import { useSetHeader } from "../../hooks/useSetHeader";
import { WHITE } from "../../lib/styles";

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

const deviceName = "Android " + getUniqueId().slice(0, 4).toUpperCase();

const SyncModal = ({ navigation }) => {
  useSetHeader({
    headerTintColor: WHITE,
  });

  const [, reload] = useAllObservations();

  const [
    {
      metadata: { projectKey },
    },
  ] = React.useContext(ConfigContext);

  const { ssid } = useWifiStatus();
  const [peers, syncPeer, syncGetPeers] = usePeers(!!ssid, deviceName);

  // Keep device awake on this screen
  React.useEffect(() => {
    KeepAwake.activate();
    return () => KeepAwake.deactivate();
  }, []);

  React.useEffect(() => {
    if (ssid) {
      syncGetPeers();
    }
  }, [ssid, syncGetPeers]);

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
    />
  );
};

SyncModal.navTitle = m.syncHeader;

export default SyncModal;
