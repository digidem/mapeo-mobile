// @flow
import React from "react";
import { View, StyleSheet, Image, ActivityIndicator } from "react-native";
import debug from "debug";

import IconButton from "../../sharedComponents/IconButton";
import { CloseIcon, AlertIcon } from "../../sharedComponents/icons";
import api from "../../api";

import type { Photo as PhotoType } from "../../context/DraftObservationContext";
import type { Style } from "../../types";

const log = debug("mapeo:PhotosView");

type PhotoProps = {
  photo: PhotoType,
  style?: Style<typeof View>
};

type HeaderProps = {
  onClose: () => void
};

const Header = ({ onClose }: HeaderProps) => (
  <View style={styles.header}>
    <IconButton onPress={onClose}>
      <CloseIcon color="white" />
    </IconButton>
  </View>
);

class Photo extends React.PureComponent<PhotoProps, { error: boolean }> {
  state = { error: false };

  handleImageError = (e: any) => {
    log("Error loading image:", e.nativeEvent && e.nativeEvent.error);
    this.setState({ error: true });
  };

  render() {
    const { photo } = this.props;
    const uri =
      typeof photo.id === "string"
        ? api.getMediaUrl(photo.id, "preview")
        : photo.previewUri || undefined;
    const error = photo.error || this.state.error;
    return (
      <View style={styles.flex1}>
        {photo.capturing && !error ? (
          <ActivityIndicator />
        ) : error || typeof uri !== "string" ? (
          <AlertIcon />
        ) : (
          <Image
            onError={this.handleImageError}
            source={{ uri }}
            style={styles.flex1}
            resizeMethod="scale"
            resizeMode="contain"
          />
        )}
      </View>
    );
  }
}

type Props = {
  onClose: () => void,
  photos: Array<PhotoType>,
  initialIndex: number
};

class PhotosView extends React.Component<Props> {
  render() {
    console.log(this.props);
    const photo = this.props.photos[this.props.initialIndex];
    return (
      <View style={styles.container}>
        <Header onClose={this.props.onClose} />
        {photo && <Photo photo={photo} />}
      </View>
    );
  }
}

export default PhotosView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black"
  },
  flex1: {
    flex: 1
  },
  header: {
    position: "absolute",
    zIndex: 1,
    height: 60,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center"
  }
});
