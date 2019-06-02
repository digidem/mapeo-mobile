// @flow
import React from "react";
import {
  View,
  ActivityIndicator,
  Image,
  Dimensions,
  ScrollView,
  StyleSheet
} from "react-native";
import debug from "debug";

import api from "../api";
import { LIGHT_GREY } from "../lib/styles";
import { AlertIcon } from "./icons";
import type { Photo } from "../context/DraftObservationContext";
import type { ObservationAttachment } from "../context/ObservationsContext";
import type { Style } from "../types";

const spacing = 10;
const minSize = 150;
const log = debug("Thumbnail");

type ThumbnailProps =
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

export class Thumbnail extends React.PureComponent<
  ThumbnailProps,
  { error: boolean }
> {
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
      ? api.getMediaUrl(id, "thumbnail")
      : this.props.thumbnailUri || undefined;
    const error = this.props.error || this.state.error;
    return (
      <View
        style={[
          styles.thumbnailContainer,
          { width: size, height: size },
          style
        ]}
      >
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

type Props = {
  photos: Array<Photo | ObservationAttachment>
};

class ThumbnailScrollView extends React.PureComponent<Props> {
  _scrollView: { current: any };
  constructor(props: Props) {
    super(props);
    this._scrollView = React.createRef();
  }
  componentDidUpdate(prevProps: Props) {
    if (
      this.props.photos.length > prevProps.photos.length &&
      this._scrollView.current
    ) {
      this._scrollView.current.scrollToEnd();
    }
  }
  render() {
    const { photos } = this.props;
    if (photos.length === 0) return null;
    const windowWidth = Dimensions.get("window").width;
    // Get a thumbnail size so there is always 1/2 of a thumbnail off the right of
    // the screen.
    const size =
      windowWidth / (Math.round(0.6 + windowWidth / minSize) - 0.5) - spacing;
    return (
      <ScrollView
        ref={this._scrollView}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.photosContainer}
      >
        {photos
          // $FlowFixMe
          .filter(photo => !photo.deleted)
          .map((photo, index) => (
            <Thumbnail
              key={index}
              {...photo}
              style={styles.thumbnail}
              size={size}
            />
          ))}
      </ScrollView>
    );
  }
}

export default ThumbnailScrollView;

const styles = StyleSheet.create({
  photosContainer: {
    backgroundColor: "#dddddd",
    flex: 1,
    padding: 5
  },
  thumbnail: {
    margin: 5
  },
  thumbnailContainer: {
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: LIGHT_GREY,
    overflow: "hidden"
  }
});
