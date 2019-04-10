// @flow
import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Camera } from "expo-camera";
import debug from "debug";

import withNavigationMount from "../hocs/withNavigationMount";
import AddButton from "../components/AddButton";
import PermissionsContext, {
  PERMISSIONS,
  RESULTS
} from "../context/PermissionsContext";
import type { DraftObservationContext } from "../context/DraftObservationContext";

const log = debug("CameraView");

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    zIndex: 10,
    bottom: 25,
    alignSelf: "center"
  }
});

const captureOptions = {
  quality: 0.75,
  base64: false,
  exif: false,
  skipProcessing: false
};

type Props = {
  addPhoto: $ElementType<DraftObservationContext, "addPhoto">
};

class CameraView extends React.Component<Props, { takingPicture: boolean }> {
  cameraRef: { current: any };
  state = { takingPicture: false };
  constructor(props) {
    super(props);
    this.cameraRef = React.createRef();
  }
  handleAddButtonPress = () => {
    const camera = this.cameraRef.current;
    if (!camera) return log("Camera view not ready");
    if (this.state.takingPicture) return log("Shutter pressed twice");
    const capture = camera.takePictureAsync(captureOptions);
    this.setState(
      {
        takingPicture: true
      },
      () => {
        // Slight wierness with a expo-camera bug: if we navigate away straight
        // away then the capture promise never resolves.
        setTimeout(this.props.addPhoto, 0, capture);
      }
    );
  };
  render() {
    const { takingPicture } = this.state;
    return (
      <PermissionsContext.Consumer>
        {({ permissions }) => {
          if (permissions[PERMISSIONS.CAMERA] !== RESULTS.GRANTED)
            return <Text>No access to camera</Text>;
          return (
            <View style={{ flex: 1 }}>
              <Camera
                ref={this.cameraRef}
                style={{ flex: 1 }}
                type={Camera.Constants.Type.back}
                useCamera2Api={false}
              />
              <View
                style={[
                  styles.buttonContainer,
                  { opacity: takingPicture ? 0.5 : 1 }
                ]}
              >
                <AddButton onPress={this.handleAddButtonPress} />
              </View>
            </View>
          );
        }}
      </PermissionsContext.Consumer>
    );
  }
}

export default withNavigationMount(CameraView);
