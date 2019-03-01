// @flow
import * as React from "react";
import { Text, View, ActivityIndicator, StyleSheet } from "react-native";

type Props = {
  /** Server status */
  variant: "waiting" | "timeout" | "error"
};

const ServerStatus = ({ variant }: Props) => {
  if (variant === "waiting")
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  else if (variant === "timeout")
    return (
      <View style={styles.container}>
        <Text style={styles.notice}>
          Something is up with the Mapeo database
        </Text>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.description}>
          If you continue to see this message you may need to force-restart
          Mapeo
        </Text>
      </View>
    );
  else if (variant === "error")
    return (
      <View style={styles.container}>
        <Text style={styles.notice}>
          Oh dear, something is broken in the Mapeo database.
        </Text>
        <Text style={styles.description}>
          You can try force-restarting the app, but there may be something that
          needs fixing. Really sorry about this, making apps is hard.
        </Text>
      </View>
    );
  else return null;
};

export default ServerStatus;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20
  },
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
