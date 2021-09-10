import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Camera, CameraCapturedPicture } from "expo-camera";
import debug from "debug";
import { Accelerometer, ThreeAxisMeasurement } from "expo-sensors";
import ImageResizer from "react-native-image-resizer";
import RNFS from "react-native-fs";
import { Subscription } from "@unimodules/react-native-adapter";

import { CapturedPictureMM } from "../hooks/useDraftObservation";
import useIsMounted from "../hooks/useIsMounted";
import { promiseTimeout } from "../lib/utils";
import bugsnag from "../lib/logger";
import AddButton from "./AddButton";

const log = debug("CameraView");

const captureQuality = 75;
const captureOptions = {
  base64: false,
  exif: true,
  skipProcessing: true,
};

type CameraType =
  | typeof Camera.Constants.Type.back
  | typeof Camera.Constants.Type.front;

interface Acceleration {
  x: number;
  y: number;
  z: number;
}

interface Props {
  // Called when the user takes a picture, with a promise that resolves to an
  // object with the property `uri` for the captured (and rotated) photo.
  onAddPress: (capture: Promise<CapturedPictureMM>) => void;
}

const CameraView = ({ onAddPress }: Props) => {
  const ref = React.useRef<Camera>(null);
  const acceleration = React.useRef<ThreeAxisMeasurement>();
  const isMounted = useIsMounted();
  const [capturing, setCapturing] = React.useState(false);
  const [cameraType] = React.useState<CameraType>(Camera.Constants.Type.back);

  React.useEffect(() => {
    let isCancelled = false;
    let subscription: Subscription;

    (async () => {
      try {
        const motionAvailable = await Accelerometer.isAvailableAsync();
        if (!motionAvailable || isCancelled) return;
        Accelerometer.setUpdateInterval(300);
        if (isCancelled) return;
        subscription = Accelerometer.addListener(acc => {
          acceleration.current = acc;
        });
      } catch (err) {
        if (err instanceof Error) {
          bugsnag.notify(err);
        }
      }
    })();

    return () => {
      isCancelled = true;
      if (subscription) subscription.remove();
    };
  }, []);

  const handleAddPress = React.useCallback(async () => {
    const camera = ref.current;
    // We need to record this at the moment the button was pressed
    const currentAcc = acceleration.current;

    if (!camera)
      return bugsnag.leaveBreadcrumb("Camera view not ready", {
        type: "process",
      });

    if (capturing)
      return bugsnag.leaveBreadcrumb("Shutter pressed twice", {
        type: "process",
      });

    bugsnag.leaveBreadcrumb("Start photo capture", { type: "process" });

    try {
      setCapturing(true);

      const initialCapture = await promiseTimeout(
        camera.takePictureAsync(captureOptions),
        15000,
        "Error capturing photo"
      );

      bugsnag.leaveBreadcrumb("Initial capture", { type: "process" });

      if (initialCapture) {
        const capture = rotatePhoto(currentAcc)(initialCapture);
        onAddPress(capture);
      }
    } catch (err) {
      if (err instanceof Error) {
        bugsnag.notify(err);
      }
    } finally {
      if (isMounted()) setCapturing(false);
    }
  }, [capturing, onAddPress, isMounted]);

  return (
    <View style={styles.container}>
      <Camera
        ref={ref}
        style={{ flex: 1 }}
        type={cameraType}
        useCamera2Api={false}
        onMountError={({ message }) => bugsnag.notify(new Error(message))}
        testID="camera"
      />
      <AddButton
        containerStyle={{ opacity: capturing ? 0.5 : 1 }}
        onPress={handleAddPress}
        testID="addButtonCamera"
      />
    </View>
  );
};

export default CameraView;

function rotatePhoto(acc?: Acceleration) {
  const rotation = getPhotoRotation(acc);
  return async ({
    exif: _,
    height,
    uri: originalUri,
    width,
  }: CameraCapturedPicture) => {
    try {
      const resizedImage = await ImageResizer.createResizedImage(
        originalUri,
        width,
        height,
        "JPEG",
        captureQuality,
        rotation
      );

      bugsnag.leaveBreadcrumb("Rotate photo", { type: "process" });
      // Image resizer uses `JPEG` as the extension, which gets passed through
      // to mapeo-core media store. Change to `jpg` to match legacy photos and
      // avoid issues on Windows (don't know if it recognizes `JPEG`)
      const renamedResizedUri = resizedImage.uri.replace(/\.JPEG$/, ".jpg");
      await RNFS.moveFile(resizedImage.uri, renamedResizedUri);

      bugsnag.leaveBreadcrumb("Rename photo", { type: "process" });

      RNFS.unlink(originalUri);
      log("Cleaned up un-rotated photo");

      return { uri: renamedResizedUri };
    } catch (err) {
      if (err instanceof Error) {
        bugsnag.notify(err, report => {
          report.errorMessage = "Error rotating photo";
          report.severity = "warning";
        });
      }
      // Some devices throw an error trying to rotate the photo, so worst-case
      // we just don't rotate
      return { uri: originalUri, rotate: rotation };
    }
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
    backgroundColor: "black",
  },
});
