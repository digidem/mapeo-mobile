// @flow
import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";

import { CategoryCircleIcon } from "../../sharedComponents/icons";
import type { Style } from "../../types";

type Props = {
  onPress: string => any,
  title: string,
  subtitle?: string,
  imageSrc?: string,
  iconId?: string,
  style?: Style<typeof View>,
  id: string
};

const ObservationListItem = ({
  onPress = () => {},
  title = "Observation",
  subtitle,
  imageSrc,
  iconId,
  style,
  id
}: Props) => (
  <TouchableHighlight
    onPress={() => onPress(id)}
    testID={"ObservationListItem:" + id}
  >
    <View style={[styles.container, style]}>
      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        <Text>{subtitle}</Text>
      </View>
      <CategoryCircleIcon iconId={iconId} size="medium" />
    </View>
  </TouchableHighlight>
);

export default React.memo<Props>(ObservationListItem);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "flex-start",
    alignItems: "center",
    borderBottomColor: "#EAEAEA",
    borderBottomWidth: 1,
    width: "100%",
    paddingHorizontal: 20,
    flex: 1,
    height: 80
  },
  text: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start"
  },
  title: { fontSize: 18, fontWeight: "700", color: "black" }
  // media: { width: 60, height: 60, borderRadius: 7 }
});
