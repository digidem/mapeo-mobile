import * as React from "react";
import { View, StyleSheet } from "react-native";
import { defineMessages, useIntl } from "react-intl";
import { useIsFocused } from "@react-navigation/native";

import LocationContext from "../context/LocationContext";
import { getLocationStatus } from "../lib/utils";
import type { LocationStatus } from "../lib/utils";
import { GpsIcon } from "./icons";
import Text from "./Text";
import { TouchableOpacity } from "./Touchables";

const m = defineMessages({
  noGps: {
    id: "sharedComponents.GpsPill.noGps",
    defaultMessage: "No GPS",
  },
  searching: {
    id: "sharedComponents.GpsPill.searching",
    defaultMessage: "Searching…",
  },
});

const ERROR_COLOR = "#FF0000";

interface Props {
  onPress?: () => void;
  precision?: number;
  variant: LocationStatus;
}

const GpsPill = React.memo(({ onPress, variant, precision }: Props) => {
  const isFocused = useIsFocused();
  const { formatMessage: t } = useIntl();

  let text: string;

  if (variant === "error") {
    text = t(m.noGps);
  } else if (variant === "searching" || typeof precision === "undefined") {
    text = t(m.searching);
  } else {
    text = `± ${precision} m`;
  }
  return (
    <TouchableOpacity onPress={onPress} testID="gpsPillButton">
      <View
        style={[
          styles.container,
          variant === "error" ? styles.error : undefined,
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
});

const ConnectedGpsPill = ({ onPress }: { onPress?: () => void }) => {
  const location = React.useContext(LocationContext);
  const locationStatus = getLocationStatus(location);
  const precision = location.position && location.position.coords.accuracy;

  return (
    <GpsPill
      onPress={onPress}
      precision={
        typeof precision === "number" ? Math.round(precision) : undefined
      }
      variant={locationStatus}
    />
  );
};

export default ConnectedGpsPill;

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
    flexDirection: "row",
  },
  error: {
    backgroundColor: ERROR_COLOR,
  },
  text: {
    color: "white",
  },
  icon: {
    position: "absolute",
    left: 6,
  },
});
