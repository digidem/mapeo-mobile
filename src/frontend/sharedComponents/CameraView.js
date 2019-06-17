// @flow
import React from "react";
import { View, StyleSheet } from "react-native";
import { Camera } from "expo-camera";
import debug from "debug";
import { Accelerometer } from "expo-sensors";
import ImageResizer from "react-native-image-resizer";
import RNFS from "react-native-fs";

import AddButton from "./AddButton";
import { promiseTimeout } from "../lib/utils";
import bugsnag from "../lib/logger";
import type { CapturePromise } from "../context/DraftObservationContext";

const log = debug("CameraView");

const captureQuality = 75;
const captureOptions = {
  base64: false,
  exif: true,
  skipProcessing: true
};

type Props = {
  // Called when the user takes a picture, with a promise that resolves to an
  // object with the property `uri` for the captured (and rotated) photo.
  onAddPress: (e: any, capture: CapturePromise) => void
};

type State = {
  takingPicture: boolean,
  showCamera: boolean
};

type Acceleration = { x: number, y: number, z: number };

class CameraView extends React.Component<Props, State> {
  cameraRef: { current: any };
  subscription: { remove: () => any } | null;
  acceleration: Acceleration;
  mounted: boolean;
  state = { takingPicture: false, showCamera: true };

  constructor(props: Props) {
    super(props);
    this.cameraRef = React.createRef();
  }

  componentDidMount() {
    this.mounted = true;
    Accelerometer.isAvailableAsync().then(motionAvailable => {
      if (!motionAvailable || !this.mounted || this.subscription) return;
      Accelerometer.setUpdateInterval(1000);
      this.subscription = Accelerometer.addListener(acc => {
        this.acceleration = acc;
      });
    });
  }

  componentWillUnmount() {
    this.mounted = false;
    if (this.subscription) this.subscription.remove();
    this.subscription = null;
  }

  handleAddPress = (e: any) => {
    const camera = this.cameraRef.current;
    if (!camera) return log("Camera view not ready");
    if (this.state.takingPicture) return log("Shutter pressed twice");
    log("Start photo capture");
    const capture = promiseTimeout(
      camera.takePictureAsync(captureOptions),
      15000,
      "Error capturing photo"
    ).then(data => {
      log("Initial capture");
      return rotatePhoto(this.acceleration)(data);
    });
    this.setState(
      {
        takingPicture: true
      },
      () => {
        // Slight weirdness with a expo-camera bug: if we navigate away straight
        // away then the capture promise never resolves.
        setTimeout(this.props.onAddPress, 0, e, capture);
      }
    );
    capture.catch(bugsnag.notify);
    capture.finally(() => {
      if (!this.mounted) return;
      this.setState({ takingPicture: false });
    });
  };

  render() {
    const { takingPicture } = this.state;
    return (
      <View style={styles.container}>
        <Camera
          ref={this.cameraRef}
          style={{ flex: 1 }}
          type={Camera.Constants.Type.back}
          useCamera2Api={false}
        />
        <AddButton
          onPress={this.handleAddPress}
          style={{ opacity: takingPicture ? 0.5 : 1 }}
        />
      </View>
    );
  }
}

export default CameraView;

// Rotate the photo to match device orientation
function rotatePhoto(acc: Acceleration) {
  const rotation = getPhotoRotation(acc);
  return function({ uri, exif, width, height }) {
    const originalUri = uri;
    let resizedUri;
    const resizePromise = ImageResizer.createResizedImage(
      uri,
      width,
      height,
      "JPEG",
      captureQuality,
      rotation
    )
      .then(({ uri }) => {
        log("Rotated photo");
        // Image resizer uses `JPEG` as the extension, which gets passed through
        // to mapeo-core media store. Change to `jpg` to match legacy photos and
        // avoid issues on Windows (don't know if it recognizes `JPEG`)
        resizedUri = uri.replace(/\.JPEG$/, ".jpg");
        return RNFS.moveFile(uri, resizedUri);
      })
      .then(() => {
        log("Renamed captured photo");
        RNFS.unlink(originalUri).then(() => log("Cleaned up un-rotated photo"));
        return { uri: resizedUri };
      })
      .catch(() => {
        log("Error rotating photo, returning un-rotated photo");
        // Some devices throw an error trying to rotate the photo, so worst-case
        // we just don't rotate
        return { uri: originalUri, rotate: rotation };
      });
    return resizePromise;
  };
}

const ACC_AT_45_DEG = Math.sin(Math.PI / 4);

// Use the accelerometer to calculate the photo rotation, rotating as the user
// would expect based on the angle of the screen.
function getPhotoRotation(acc?: Acceleration) {
  if (!acc) return 0;
  const { x, y, z } = acc;
  let rotation = 0;
  if (z < -ACC_AT_45_DEG || z > ACC_AT_45_DEG) {
    // camera is pointing up or down
    if (Math.abs(y) > Math.abs(x)) {
      // camera is vertical
      if (y <= 0) rotation = 180;
      else rotation = 0;
    } else {
      // camera is horizontal
      if (x >= 0) rotation = -90;
      else rotation = 90;
    }
  } else if (x > -ACC_AT_45_DEG && x < ACC_AT_45_DEG) {
    // camera is vertical
    if (y <= 0) rotation = 180;
    else rotation = 0;
  } else {
    // camera is horizontal
    if (x >= 0) rotation = -90;
    else rotation = 90;
  }
  return rotation;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black"
  }
});
