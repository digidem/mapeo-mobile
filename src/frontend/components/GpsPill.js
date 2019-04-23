// @flow
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { withNavigation, withNavigationFocus } from "react-navigation";

import LocationContext from "../context/LocationContext";
import { GpsIcon } from "./icons";
import { getLocationStatus } from "../lib/utils";
import type { LocationStatus } from "../lib/utils";

const ERROR_COLOR = "#FF0000";

type Props = {
  onPress: null | (() => void),
  precision?: number,
  variant: LocationStatus,
  isFocused: boolean
};

type State = {
  precision?: number
};

export class GpsPill extends React.PureComponent<Props, State> {
  render() {
    const { onPress, variant, precision, isFocused } = this.props;
    let text: string;
    if (variant === "error") text = "No GPS";
    else if (variant === "searching" || typeof precision === "undefined")
      text = "Searching...";
    else text = `± ${precision} m`;
    return (
      <TouchableOpacity onPress={onPress}>
        <View
          style={[
            styles.container,
            variant === "error" ? styles.error : undefined
          ]}
        >
          <View style={styles.icon}>
            {isFocused && <GpsIcon variant={variant} />}
          </View>
          <Text style={styles.text} numberOfLines={1}>
            {text}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const ConnectedGpsPill = ({ navigation, isFocused }) => (
  <LocationContext.Consumer>
    {location => {
      const locationStatus = getLocationStatus(location);
      const precision = location.position && location.position.coords.accuracy;
      return (
        <GpsPill
          onPress={() => navigation.navigate("GpsModal")}
          precision={
            typeof precision === "number" ? Math.round(precision) : undefined
          }
          variant={locationStatus}
          isFocused={isFocused}
        />
      );
    }}
  </LocationContext.Consumer>
);

export default withNavigation(withNavigationFocus(ConnectedGpsPill));

const styles = StyleSheet.create({
  container: {
    flex: 0,
    minWidth: 100,
    maxWidth: 200,
    borderRadius: 18,
    height: 36,
    paddingLeft: 32,
    paddingRight: 20,
    borderWidth: 3,
    borderColor: "#33333366",
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  error: {
    backgroundColor: ERROR_COLOR
  },
  text: {
    color: "white"
  },
  icon: {
    position: "absolute",
    left: 6
  }
});
