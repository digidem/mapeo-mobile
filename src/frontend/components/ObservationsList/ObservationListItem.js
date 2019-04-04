// @flow
import * as React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import ObservationIcon from "./ObservationIcon";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "flex-start",
    alignItems: "center",
    borderBottomColor: "#EAEAEA",
    borderBottomWidth: 1,
    width: "100%",
    paddingHorizontal: 20
  },
  text: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start"
  },
  title: { fontSize: 18, fontWeight: "700", color: "black" },
  media: { width: 60, height: 60, borderRadius: 7 }
});

type Props = {
  onPress: () => any,
  title: string,
  subtitle?: string,
  imageSrc?: string,
  iconId?: string,
  style?: $PropertyType<React.ElementProps<typeof View>, "style">
};

const ObservationListItem = ({
  onPress = () => {},
  title = "Observation",
  subtitle,
  imageSrc,
  iconId,
  style
}: Props) => (
  <TouchableOpacity onPress={onPress}>
    <View style={{ ...styles.container, ...style }}>
      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        <Text>{subtitle}</Text>
      </View>
      <View style={{ flexDirection: "column" }}>
        <ObservationIcon iconId={iconId} size="medium" />
      </View>
    </View>
  </TouchableOpacity>
);

export default React.memo<Props>(ObservationListItem);
