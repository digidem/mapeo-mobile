// @flow
import React from "react";
import { View, ActivityIndicator, Image, StyleSheet } from "react-native";
import debug from "debug";

import { getMediaUrl } from "../api";
import { LIGHT_GREY } from "../lib/styles";
import AlertIcon from "./icons/AlertIcon";
import type { Photo } from "../context/DraftObservationContext";
import type { ObservationAttachment } from "../context/ObservationsContext";
import type { Style } from "../types/other";

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

type Props =
  | {
      ...Photo,
      style?: Style<typeof View>,
      size?: number
    }
  | {
      ...ObservationAttachment,
      style?: Style<typeof View>,
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
    const { id, style, size } = this.props;
    const uri = id
      ? getMediaUrl(id, "thumbnail")
      : this.props.thumbnailUri || undefined;
    const error = this.props.error || this.state.error;
    return (
      <View style={[styles.container, { width: size, height: size }, style]}>
        {this.props.capturing && !error ? (
          <ActivityIndicator />
        ) : error || typeof uri !== "string" ? (
          <AlertIcon />
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
