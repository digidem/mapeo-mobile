// @flow
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { withNavigation, withNavigationFocus } from "react-navigation";

import LocationContext from "../context/LocationContext";
import GpsIcon from "./icons/GpsIcon";

const GOOD_PRECISION = 10;
const ERROR_COLOR = "#FF0000";
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

export type Variant = "searching" | "improving" | "good" | "error";

type Props = {
  onPress: null | (() => void),
  precision?: number,
  variant: Variant,
  isFocused: boolean
};

type State = {
  precision?: number
};

export class GpsPill extends React.PureComponent<Props, State> {
  static getDerivedStateFromProps(props: Props, state: State = {}) {
    // This weirdness is to not update the text when the screen is not focussed
    // (i.e. the user has navigated away). If we just did
    // shouldComponentUpdate() based on isFocused then the component would never
    // render with isFocused=false and the icon would not stop animating
    if (props.isFocused) return { precision: props.precision };
    else return { precision: state.precision };
  }
  state = {};
  render() {
    const { onPress, variant, isFocused } = this.props;
    const { precision } = this.state;
    let text: string;
    if (variant === "error") text = "No GPS";
    else if (variant === "searching" || typeof precision === "undefined")
      text = "Searching...";
    else text = `± ${precision.toFixed(0)} m`;
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
    {({ position, provider, permission, error }) => {
      const precision = position && position.coords.accuracy;
      const gpsUnavailable = provider && !provider.gpsAvailable;
      const locationServicesDisabled =
        provider && !provider.locationServicesEnabled;
      const noPermission = permission && permission !== "granted";
      let variant: Variant;
      if (error || gpsUnavailable || locationServicesDisabled || noPermission)
        variant = "error";
      else if (precision && Math.round(precision) <= GOOD_PRECISION)
        variant = "good";
      else if (precision) variant = "improving";
      else variant = "searching";
      return (
        <GpsPill
          onPress={() => navigation.navigate("GpsModal")}
          precision={precision}
          variant={variant}
          isFocused={isFocused}
        />
      );
    }}
  </LocationContext.Consumer>
);

export default withNavigation(withNavigationFocus(ConnectedGpsPill));
