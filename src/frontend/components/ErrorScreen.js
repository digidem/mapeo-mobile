import React from "React";
import { StyleSheet, Text } from "react-native";
import CenteredView from "./CenteredView";

/**
 * Fallback screen to show if there is an uncaught error in the app
 */
const ErrorScreen = () => (
  <CenteredView>
    <Text style={styles.notice}>Houston we have a problem</Text>
    <Text style={styles.description}>
      Try restarting the app, or call the NASA engineers
    </Text>
  </CenteredView>
);

const styles = StyleSheet.create({
  notice: {
    fontSize: 20,
    textAlign: "center",
    margin: 20
  },
  description: {
    textAlign: "center",
    color: "#333333",
    margin: 20
  }
});

export default ErrorScreen;
