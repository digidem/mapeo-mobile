import * as React from "react";
import { Image, StyleSheet, View } from "react-native";
import { ViewStyleProp } from "../sharedTypes";
import { TouchableOpacity } from "./Touchables";

type ExtractProps<T> = T extends React.Component<infer P> | React.FC<infer P>
  ? P
  : never;

interface Props extends ExtractProps<TouchableOpacity> {
  containerStyle: ViewStyleProp;
}

const AddButton = ({ containerStyle, ...touchableOpacityProps }: Props) => (
  <View style={[styles.container, containerStyle]}>
    <TouchableOpacity {...touchableOpacityProps}>
      <Image
        source={require("../images/add-button.png")}
        style={styles.button}
      />
    </TouchableOpacity>
  </View>
);

export default React.memo(AddButton);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 10,
    bottom: 25,
    alignSelf: "center",
  },
  button: {
    width: 125,
    height: 125,
  },
});
