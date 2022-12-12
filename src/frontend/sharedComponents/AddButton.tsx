import React from "react";
import { GestureResponderEvent, Image, StyleSheet, View } from "react-native";
import { ViewStyleProp } from "../sharedTypes";
import { TouchableOpacity } from "./Touchables";

interface AddButtonProps {
  style?: ViewStyleProp;
  testID?: string;
  onPress: ((event: GestureResponderEvent) => void) & (() => void);
}

const AddButtonNoMemo = ({ style, testID, onPress }: AddButtonProps) => (
  <View testID={testID} style={[styles.container, style]}>
    <TouchableOpacity onPress={onPress}>
      <Image
        source={require("../images/add-button.png")}
        style={styles.button}
      />
    </TouchableOpacity>
  </View>
);

/**
 * Button used on main map and camera mode to take observation
 */
export const AddButton = React.memo(AddButtonNoMemo);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 25,
    alignSelf: "center",
  },
  button: {
    width: 125,
    height: 125,
  },
});
