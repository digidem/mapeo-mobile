import * as React from "react";
import { StyleSheet, TouchableNativeFeedback, View } from "react-native";
import { defineMessages, FormattedMessage } from "react-intl";
import DeviceInfo from "react-native-device-info";

import { WifiIcon } from "./icons";
import Text from "./Text";

const m = defineMessages({
  wifi: {
    id: "sharedComponents.WifiBar.wifi",
    defaultMessage: "WiFi:",
    description: "Label for wifi network name",
  },
});

interface Props {
  deviceName: string;
  onPress?: () => void;
  ssid?: string;
}

const WifiBar = ({ deviceName, onPress, ssid }: Props) => (
  <TouchableNativeFeedback onPress={onPress}>
    <View style={styles.wifiBar}>
      <WifiIcon />
      <Text style={styles.wifiBarText} numberOfLines={1}>
        <Text style={styles.bold}>
          <FormattedMessage {...m.wifi} />
        </Text>{" "}
        {ssid}
      </Text>
      <View>
        <Text style={styles.deviceName}>{deviceName}</Text>
        <Text style={styles.version}>v{DeviceInfo.getVersion()}</Text>
      </View>
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
    flex: 1,
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
    justifyContent: "flex-start",
    paddingHorizontal: 15,
  },
  wifiBarText: {
    color: "white",
    paddingLeft: 10,
  },
});

export default WifiBar;
