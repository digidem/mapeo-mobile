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

import { TouchableOpacity } from "../sharedComponents/Touchables";
import api from "../api";
import { LIGHT_GREY } from "../lib/styles";
import { AlertIcon } from "./icons";
import type { Photo } from "../context/DraftObservationContext";
import type { Style } from "../types";

const spacing = 10;
const minSize = 150;
const log = debug("Thumbnail");

type ThumbnailProps = {
  photo: Photo,
  onPress: () => any,
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
    const { photo, style, size, onPress } = this.props;
    const uri =
      typeof photo.id === "string"
        ? api.getMediaUrl(photo.id, "thumbnail")
        : photo.thumbnailUri || undefined;
    const error = photo.error || this.state.error;
    return (
      <TouchableOpacity
        style={[
          styles.thumbnailContainer,
          { width: size, height: size },
          style
        ]}
        onPress={onPress}
      >
        {photo.capturing && !error ? (
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
      </TouchableOpacity>
    );
  }
}

type Props = {
  photos: Array<Photo>,
  onPressPhoto: (index: number) => any
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
    const { photos, onPressPhoto } = this.props;
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
          .filter(photo => !photo.deleted)
          .map((photo, index) => (
            <Thumbnail
              key={index}
              photo={photo}
              style={styles.thumbnail}
              size={size}
              onPress={() => onPressPhoto(photos.indexOf(photo))}
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
