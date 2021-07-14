import * as React from "react";
import NetInfo, { NetInfoSubscription } from "@react-native-community/netinfo";
import KeepAwake from "react-native-keep-awake";
import { NetworkInfo } from "react-native-network-info";

import bugsnag from "../lib/logger";

const useWifiStatus = ({
  keepAwake,
  onConnectionChange,
  setListening,
}: {
  keepAwake?: boolean;
  onConnectionChange?: () => void;
  setListening?: (value: boolean) => void;
} = {}) => {
  const [ssid, setSsid] = React.useState<string | null>(null);

  React.useEffect(() => {
    const subscriptions: { remove: NetInfoSubscription }[] = [];

    const handleConnectionChange = async () => {
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

        if (onConnectionChange) {
          onConnectionChange();
        }

        if (setListening) {
          setListening(true);
        }
      }
    };

    if (setListening) {
      setListening(true);
    }

    // Subscribe to NetInfo to know when the user connects/disconnects to wifi
    subscriptions.push({
      remove: NetInfo.addEventListener(handleConnectionChange),
    });

    if (keepAwake) {
      // Keep the screen awake whilst on this screen
      KeepAwake.activate();
    }

    return () => {
      if (setListening) {
        setListening(false);
      }

      // Unsubscribe all listeners
      subscriptions.forEach(s => s.remove());

      if (keepAwake) {
        // Turn off keep screen awake
        KeepAwake.deactivate();
      }
    };
  }, [keepAwake, onConnectionChange, setListening]);

  return { ssid };
};

export default useWifiStatus;
