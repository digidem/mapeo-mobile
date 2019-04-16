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
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: LIGHT_GREY,
    overflow: "hidden"
  }
});

type Props = {
  ...$Exact<Photo>,
  style?: any,
  size?: number
};

type State = {
  error: boolean
};

class Thumbnail extends React.PureComponent<Props, State> {
  state = { error: false };
  static defaultProps = {
    size: 100
  };

  handleImageError = (e: any) => {
    log("Error loading image:\n", e.nativeEvent && e.nativeEvent.error);
    this.setState({ error: true });
  };

  render() {
    const { id, thumbnailUri, capturing, style, size } = this.props;
    const uri = id ? getMediaUrl(id, "thumbnail") : thumbnailUri;
    const error = this.props.error || this.state.error;
    return (
      <View style={[styles.container, { width: size, height: size }, style]}>
        {error ? (
          <AlertIcon />
        ) : capturing ? (
          <ActivityIndicator />
        ) : (
          <Image
            onError={this.handleImageError}
            source={{ uri }}
            style={{ width: size, height: size }}
          />
        )}
      </View>
    );
  }
}

export default Thumbnail;
