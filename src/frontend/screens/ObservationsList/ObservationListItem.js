// @flow
import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableHighlight } from "../../sharedComponents/Touchables";

import { CategoryCircleIcon } from "../../sharedComponents/icons";
import DateDistance from "../../sharedComponents/DateDistance";
import type { Style } from "../../types";

type Props = {
  onPress: string => any,
  name: string,
  createdDate?: Date,
  imageSrc?: string,
  iconId?: string,
  style?: Style<typeof View>,
  id: string
};

const ObservationListItem = ({
  onPress = () => {},
  name = "Observación",
  createdDate,
  imageSrc,
  iconId,
  style,
  id
}: Props) => (
  <TouchableHighlight
    onPress={() => onPress(id)}
    testID={"ObservationListItem:" + id}
    style={{ flex: 1, height: 80 }}
  >
    <View style={[styles.container, style]}>
      <View style={styles.text}>
        <Text style={styles.title}>{name}</Text>
        {createdDate && <DateDistance date={createdDate} />}
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
