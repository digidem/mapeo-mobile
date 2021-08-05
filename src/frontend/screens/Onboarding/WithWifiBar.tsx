import * as React from "react";
import { View, StyleSheet } from "react-native";
import { getUniqueId } from "react-native-device-info";
import OpenSettings from "react-native-android-open-settings";

import useWifiStatus from "../../hooks/useWifiStatus";
import WifiBar from "../../sharedComponents/WifiBar";

export const WithWifiBar = ({ children }: React.PropsWithChildren<{}>) => {
  const { ssid } = useWifiStatus();
  const deviceName = "Android " + getUniqueId().slice(0, 4).toUpperCase();

  return (
    <View style={styles.container}>
      <WifiBar
        deviceName={deviceName}
        ssid={ssid}
        onPress={() => OpenSettings.wifiSettings()}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
