// @flow
import * as React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import Text from "../sharedComponents/Text";
import { defineMessages, FormattedMessage } from "react-intl";

import CenteredView from "../sharedComponents/CenteredView";

const m = defineMessages({
  timeoutTitle: {
    id: "screens.ServerStatus.timeoutTitle",
    defaultMessage: "Something is up with the Mapeo database",
    description:
      "Title of message when the server has not responded for 10 seconds",
  },
  timeoutDesc: {
    id: "screens.ServerStatus.timeoutDesc",
    defaultMessage:
      "If you continue to see this message you may need to force-restart Mapeo",
    description: "Description when the server has not responded for 10 seconds",
  },
  errorTitle: {
    id: "screens.ServerStatus.errorTitle",
    defaultMessage: "Oh dear, something is broken in the Mapeo database.",
    description: "Title of message when there the Mapeo Core server crashes",
  },
  errorDesc: {
    id: "screens.ServerStatus.errorDesc",
    defaultMessage:
      "You can try force-restarting the app, but there may be something that needs fixing. Really sorry about this, making apps is hard.",
    description: "Description when there the Mapeo Core server crashes",
  },
});

type Props = {
  /** Server status */
  variant: "waiting" | "timeout" | "error",
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
          <FormattedMessage {...m.timeoutTitle} />
        </Text>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.description}>
          <FormattedMessage {...m.timeoutDesc} />
        </Text>
      </CenteredView>
    );
  else if (variant === "error")
    return (
      <CenteredView>
        <Text style={styles.notice}>
          <FormattedMessage {...m.errorTitle} />
        </Text>
        <Text style={styles.description}>
          <FormattedMessage {...m.errorDesc} />
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
    margin: 20,
  },
  description: {
    textAlign: "center",
    color: "#333333",
    margin: 20,
  },
});
