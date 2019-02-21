// @flow
import * as React from "react";
import { Text, ActivityIndicator, StyleSheet } from "react-native";
import CenteredView from "./CenteredView";

type Props = {
  /** Server status */
  variant: "waiting" | "timeout" | "error"
};

/**
 * Status screen shown to user when the Mapeo Core server is not ready or errors
 */
const ServerStatus = ({ variant }: Props) => {
  if (variant === "waiting")
    return (
      <CenteredView>
        <ActivityIndicator size="large" color="#0000ff" />
      </CenteredView>
    );
  else if (variant === "timeout")
    return (
      <CenteredView>
        <Text style={styles.notice}>
          Something is up with the Mapeo database
        </Text>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.description}>
          If you continue to see this message you may need to force-restart
          Mapeo
        </Text>
      </CenteredView>
    );
  else if (variant === "error")
    return (
      <CenteredView>
        <Text style={styles.notice}>
          Oh dear, something is broken in the Mapeo database.
        </Text>
        <Text style={styles.description}>
          You can try force-restarting the app, but there may be something that
          needs fixing. Really sorry about this, making apps is hard.
        </Text>
      </CenteredView>
    );
  return null;
};

export default ServerStatus;

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
