import * as React from "react";
import { StyleSheet, View } from "react-native";

/**
 * Layout component to fill screen with centered children/text
 */
const CenteredView = ({ children }: React.PropsWithChildren<{}>) => (
  <View style={styles.container}>{children}</View>
);

export default CenteredView;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
});
