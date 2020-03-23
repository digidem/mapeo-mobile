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
import type { CapturePromise } from "../hooks/useDraftObservation";
import useIsMounted from "../hooks/useIsMounted";

const log = debug("CameraView");

const captureQuality = 75;
const captureOptions = {
  base64: false,
  exif: true,
  skipProcessing: true
};

type CameraType = "front" | "back";

type Props = {
  // Called when the user takes a picture, with a promise that resolves to an
  // object with the property `uri` for the captured (and rotated) photo.
  onAddPress: (e: any, capture: CapturePromise) => void
};

type Acceleration = { x: number, y: number, z: number };

const CameraView = ({ onAddPress }: Props) => {
  const ref = React.useRef();
  const acceleration = React.useRef();
  const isMounted = useIsMounted();
  const [capturing, setCapturing] = React.useState(false);
  const [cameraType] = React.useState<?CameraType>("back");

  React.useEffect(() => {
    let isCancelled = false;
    let subscription;

    (async () => {
      try {
        const motionAvailable = await Accelerometer.isAvailableAsync();
        if (!motionAvailable || isCancelled) return;
        await Accelerometer.setUpdateInterval(300);
        if (isCancelled) return;
        subscription = Accelerometer.addListener(acc => {
          acceleration.current = acc;
        });
      } catch (err) {
        bugsnag.notify(err);
      }
    })();

    return () => {
      isCancelled = true;
      if (subscription) subscription.remove();
    };
  }, []);

  const handleAddPress = React.useCallback(
    (e: any) => {
      const camera = ref.current;
      if (!camera)
        return bugsnag.leaveBreadcrumb("Camera view not ready", {
          type: "process"
        });
      if (capturing)
        return bugsnag.leaveBreadcrumb("Shutter pressed twice", {
          type: "process"
        });
      bugsnag.leaveBreadcrumb("Start photo capture", { type: "process" });

      const initialCapture = promiseTimeout(
        camera.takePictureAsync(captureOptions),
        15000,
        "Error capturing photo"
      );
      const capture = initialCapture.then(data => {
        bugsnag.leaveBreadcrumb("Initial capture", { type: "process" });
        return rotatePhoto(acceleration.current)(data);
      });

      // Wait until we have taken the image before navigating away (but rotation
      // can continue in the background after navigation)
      initialCapture.then(() => onAddPress(e, capture)).catch(bugsnag.notify);

      capture.catch(bugsnag.notify);

      capture.finally(() => {
        if (isMounted()) setCapturing(false);
      });

      setCapturing(true);
    },
    [capturing, onAddPress, isMounted]
  );

  return (
    <View style={styles.container}>
      <Camera
        ref={ref}
        style={{ flex: 1 }}
        type={cameraType}
        useCamera2Api={false}
        onMountError={bugsnag.notify}
      />
      <AddButton
        onPress={handleAddPress}
        style={{ opacity: capturing ? 0.5 : 1 }}
      />
    </View>
  );
};

export default CameraView;

// Rotate the photo to match device orientation
function rotatePhoto(acc?: Acceleration) {
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
        bugsnag.leaveBreadcrumb("Rotate photo", { type: "process" });
        // Image resizer uses `JPEG` as the extension, which gets passed through
        // to mapeo-core media store. Change to `jpg` to match legacy photos and
        // avoid issues on Windows (don't know if it recognizes `JPEG`)
        resizedUri = uri.replace(/\.JPEG$/, ".jpg");
        return RNFS.moveFile(uri, resizedUri);
      })
      .then(() => {
        bugsnag.leaveBreadcrumb("Rename photo", { type: "process" });
        RNFS.unlink(originalUri).then(() => log("Cleaned up un-rotated photo"));
        return { uri: resizedUri };
      })
      .catch(e => {
        bugsnag.notify(e, report => {
          report.errorMessage = "Error rotating photo";
          report.severity = "warning";
        });
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
