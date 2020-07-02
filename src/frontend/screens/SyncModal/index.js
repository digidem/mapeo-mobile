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
import { getUniqueId } from "react-native-device-info";

import SyncView from "./SyncView";
import api from "../../api";
import bugsnag from "../../lib/logger";
import useAllObservations from "../../hooks/useAllObservations";
import ConfigContext from "../../context/ConfigContext";
import HeaderTitle from "../../sharedComponents/HeaderTitle";
import usePeers from './usePeers';

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
  getUniqueId()
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

  const [listen, setListening] = React.useState<boolean>(false);
  const [peers, syncPeer] = usePeers(api, listen, deviceName);
  const [ssid, setSsid] = React.useState<null | string>(null);

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
    setListening(true)
    // Subscribe to NetInfo to know when the user connects/disconnects to wifi
    subscriptions.push({
      remove: NetInfo.addEventListener(handleConnectionChange)
    });
    // Keep the screen awake whilst on this screen
    KeepAwake.activate();
    return () => {
      // When the modal closes, stop announcing for sync
      setListening(false)
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

  const handleWifiPress = () => {
    OpenSettings.wifiSettings();
  };

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

export default SyncModal;

