// @flow
import React from "react";
import { View, ActivityIndicator, Image, StyleSheet } from "react-native";
import debug from "debug";

import { getMediaUrl } from "../api";
import { LIGHT_GREY } from "../lib/styles";
import AlertIcon from "./icons/AlertIcon";
import type { Photo } from "../context/DraftObservationContext";

const log = debug("Thumbnail");

const styles = StyleSheet.create({
  container: {
    width: 65,
    height: 65,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: LIGHT_GREY,
    overflow: "hidden"
  },
  image: {
    width: 65,
    height: 65
  }
});

type Props = {
  ...$Exact<Photo>,
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
    const { id: attachmentId, thumbnailUri, capturing, style } = this.props;
    const uri = attachmentId
      ? getMediaUrl(attachmentId, "thumbnail")
      : thumbnailUri;
    const error = this.props.error || this.state.error;
    return (
      <View style={[styles.container, style]}>
        {error ? (
          <AlertIcon />
        ) : capturing ? (
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
