import * as React from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageErrorEventData,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
} from "react-native";
import debug from "debug";

import api from "../api";
import { Photo } from "../context/DraftObservationContext";
import { AlertIcon } from "./icons";
import { LIGHT_GREY } from "../lib/styles";
import { ViewStyleProp } from "../sharedTypes";
import { TouchableOpacity } from "./Touchables";

const spacing = 10;
const minSize = 150;
const log = debug("Thumbnail");

interface ThumbnailProps {
  onPress: () => void;
  photo: Photo;
  size?: number;
  style?: ViewStyleProp;
}

const Thumbnail = ({ onPress, photo, size = 100, style }: ThumbnailProps) => {
  const [imageError, setImageError] = React.useState(false);
  const uri =
    typeof photo.id === "string"
      ? api.getMediaUrl(photo.id, "thumbnail")
      : photo.thumbnailUri != null
      ? photo.thumbnailUri
      : undefined;

  const handleImageError = (e: NativeSyntheticEvent<ImageErrorEventData>) => {
    log("Error loading image:\n", e.nativeEvent && e.nativeEvent.error);
    setImageError(true);
  };

  const error = photo.error != null ? photo.error : imageError;

  return (
    <TouchableOpacity
      style={[styles.thumbnailContainer, { width: size, height: size }, style]}
      onPress={onPress}
    >
      {photo.capturing === true && !error ? (
        <ActivityIndicator />
      ) : error || typeof uri !== "string" ? (
        <AlertIcon />
      ) : (
        <Image
          onError={handleImageError}
          source={{ uri }}
          style={{ width: size, height: size }}
        />
      )}
    </TouchableOpacity>
  );
};

interface Props {
  onPressPhoto: (index: number) => void;
  photos: Array<Photo>;
}

const ThumbnailScrollView = ({ onPressPhoto, photos }: Props) => {
  const scrollViewRef = React.useRef<ScrollView>(null);

  React.useLayoutEffect(() => {
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
