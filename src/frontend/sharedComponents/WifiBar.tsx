import * as React from "react";
import { StyleSheet, View } from "react-native";
import { defineMessages, FormattedMessage } from "react-intl";
import DeviceInfo from "react-native-device-info";
import OpenSettings from "react-native-android-open-settings";

import { TouchableNativeFeedback } from "./Touchables";

import { WifiIcon, WifiOffIcon } from "./icons";
import Text from "./Text";

const m = defineMessages({
  wifi: {
    id: "sharedComponents.WifiBar.wifi",
    defaultMessage: "WiFi:",
    description: "Label for wifi network name",
  },
  noWifi: {
    id: "sharedComponents.WifiBar.wifi",
    defaultMessage: "No Internet",
  },
});

interface Props {
  deviceName: string;
  onPress?: () => void;
  ssid?: string | null;
}

const WifiBar = ({
  deviceName,
  onPress = () => OpenSettings.wifiSettings(),
  ssid,
}: Props) => (
  <TouchableNativeFeedback onPress={onPress}>
    <View style={styles.wifiBar}>
      <View style={styles.wifiInfo}>
        {ssid ? <WifiIcon /> : <WifiOffIcon color="white" />}
        <Text style={styles.wifiBarText} numberOfLines={1}>
          <Text style={styles.bold}>
            <FormattedMessage {...(ssid ? m.wifi : m.noWifi)} />
          </Text>
          {ssid && ` ${ssid}`}
        </Text>
      </View>
      {ssid && (
        <View>
          <Text style={styles.deviceName}>{deviceName}</Text>
          <Text style={styles.version}>v{DeviceInfo.getVersion()}</Text>
        </View>
      )}
    </View>
  </TouchableNativeFeedback>
);

const styles = StyleSheet.create({
  bold: {
    fontWeight: "700",
  },
  deviceName: {
    fontWeight: "bold",
    textAlign: "right",
    color: "white",
    flex: 0,
  },
  version: {
    fontWeight: "500",
    color: "white",
  },
  wifiBar: {
    backgroundColor: "#19337F",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  wifiBarText: {
    color: "white",
    paddingLeft: 10,
  },
  wifiInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});

export default WifiBar;
