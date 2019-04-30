// @flow
import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Camera } from "expo-camera";
import debug from "debug";

import AddButton from "./AddButton";
import withNavigationFocus from "../lib/withNavigationFocus";
import PermissionsContext, {
  PERMISSIONS,
  RESULTS
} from "../context/PermissionsContext";
import type { CapturePromise } from "../context/DraftObservationContext";

const log = debug("CameraView");

const captureOptions = {
  quality: 0.75,
  base64: false,
  exif: false,
  skipProcessing: false
};

type Props = {
  onAddPress: (e: any, capture: CapturePromise) => void,
  isFocused: boolean
};

type State = {
  takingPicture: boolean,
  showCamera: boolean
};

class CameraView extends React.Component<Props, State> {
  cameraRef: { current: any };
  state = { takingPicture: false, showCamera: true };

  constructor(props: Props) {
    super(props);
    this.cameraRef = React.createRef();
  }

  // async componentDidMount() {
  //   const camera = this.cameraRef.current;
  //   const ratios = await camera.getSupportedRatiosAsync();
  //   log("ratios", ratios);
  //   const sizes = await Promise.all(
  //     ratios.map(r => camera.getAvailablePictureSizesAsync(r))
  //   );
  //   log("sizes", sizes);
  // }

  handleAddPress = (e: any) => {
    const camera = this.cameraRef.current;
    if (!camera) return log("Camera view not ready");
    if (this.state.takingPicture) return log("Shutter pressed twice");
    const capture = camera.takePictureAsync(captureOptions);
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
    capture.finally(() => {
      this.setState({ takingPicture: false });
    });
  };

  render() {
    const { takingPicture } = this.state;
    return (
      <PermissionsContext.Consumer>
        {({ permissions }) => {
          if (permissions[PERMISSIONS.CAMERA] !== RESULTS.GRANTED)
            return <Text>No access to camera</Text>;
          return (
            <View style={styles.container}>
              {this.props.isFocused && (
                <Camera
                  ref={this.cameraRef}
                  style={{ flex: 1 }}
                  type={Camera.Constants.Type.back}
                  useCamera2Api={false}
                />
              )}
              <AddButton
                onPress={this.handleAddPress}
                style={{ opacity: takingPicture ? 0.5 : 1 }}
              />
            </View>
          );
        }}
      </PermissionsContext.Consumer>
    );
  }
}

export default withNavigationFocus(CameraView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black"
  }
});
