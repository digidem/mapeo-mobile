// @flow
import React, { useRef, useLayoutEffect } from "react";
import {
  View,
  ActivityIndicator,
  Image,
  Dimensions,
  ScrollView,
  StyleSheet,
} from "react-native";
import debug from "debug";

import { TouchableOpacity } from "../sharedComponents/Touchables";
import api from "../api";
import { LIGHT_GREY } from "../lib/styles";
import { AlertIcon } from "./icons";
import type { Photo } from "../context/DraftObservationContext";
import type { ViewStyleProp } from "../types";

const spacing = 10;
const minSize = 150;
const log = debug("Thumbnail");

type ThumbnailProps = {
  photo: Photo,
  onPress: () => any,
  style?: ViewStyleProp,
  size?: number,
};

export class Thumbnail extends React.PureComponent<
  ThumbnailProps,
  { error: boolean }
> {
  state = { error: false };
  static defaultProps = {
    size: 100,
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
        : photo.thumbnailUri != null
        ? photo.thumbnailUri
        : undefined;
    const error = photo.error != null ? photo.error : this.state.error;
    return (
      <TouchableOpacity
        style={[
          styles.thumbnailContainer,
          { width: size, height: size },
          style,
        ]}
        onPress={onPress}
      >
        {photo.capturing === true && !error ? (
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
  onPressPhoto: (index: number) => any,
  photos: Array<Photo>,
};

const ThumbnailScrollView = ({ onPressPhoto, photos }: Props) => {
  const scrollViewRef = useRef();

  useLayoutEffect(() => {
    // For some reason without the timeout this does not work.
    const timeoutID = setTimeout(() => {
      scrollViewRef.current && scrollViewRef.current.scrollToEnd();
    }, 50);
    return () => clearTimeout(timeoutID);
  }, [photos.length]);

  if (photos.length === 0) return null;
  const windowWidth = Dimensions.get("window").width;
  // Get a thumbnail size so there is always 1/2 of a thumbnail off the right of
  // the screen.
  const size =
    windowWidth / (Math.round(0.6 + windowWidth / minSize) - 0.5) - spacing;

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={true}
      contentInset={{ top: 5, right: 5, bottom: 5, left: 5 }}
      style={styles.photosContainer}
    >
      {photos
        .filter(photo => photo.deleted == null)
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
};

export default ThumbnailScrollView;

const styles = StyleSheet.create({
  photosContainer: {
    flex: 1,
  },
  thumbnail: {
    margin: 5,
  },
  thumbnailContainer: {
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: LIGHT_GREY,
    overflow: "hidden",
  },
});
