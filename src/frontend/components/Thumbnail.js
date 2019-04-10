// @flow
import React from "react";
import { View, ActivityIndicator, Image, StyleSheet } from "react-native";
import debug from "debug";

import { getMediaUrl } from "../api";
import { LIGHT_GREY } from "../lib/styles";
import AlertIcon from "./icons/AlertIcon";

const log = debug("Thumbnail");

const styles = StyleSheet.create({
  container: {
    width: 65,
    height: 65,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: LIGHT_GREY,
    marginHorizontal: 5,
    overflow: "hidden"
  },
  image: {
    width: 65,
    height: 65
  }
});

type Props = {
  attachmentId?: string,
  uri?: string,
  loading: boolean,
  error?: boolean,
  style?: any
};

type State = {
  error: boolean
};

class Thumbnail extends React.PureComponent<Props, State> {
  state = { error: false };

  handleImageError = (e: any) => {
    log("Error loading image:\n", e.nativeEvent && e.nativeEvent.error);
    this.setState({ error: true });
  };

  render() {
    const { attachmentId, loading, style } = this.props;
    const uri = attachmentId
      ? getMediaUrl(attachmentId, "thumbnail")
      : this.props.uri;
    const error = this.props.error || this.state.error;
    return (
      <View style={[styles.container, style]}>
        {error ? (
          <AlertIcon />
        ) : loading ? (
          <ActivityIndicator />
        ) : (
          <Image
            onError={this.handleImageError}
            source={{ uri }}
            style={styles.image}
          />
        )}
      </View>
    );
  }
}

export default Thumbnail;
