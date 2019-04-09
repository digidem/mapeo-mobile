// @flow
import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Camera } from "expo-camera";

import withNavigationMount from "../hocs/withNavigationMount";
import AddButton from "../components/AddButton";
import PermissionsContext, {
  PERMISSIONS,
  RESULTS
} from "../context/PermissionsContext";
import type { DraftObservationContext } from "../context/DraftObservationContext";

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

class CameraView extends React.Component<Props> {
  cameraRef: { current: any };
  constructor(props) {
    super(props);
    this.cameraRef = React.createRef();
  }
  handleAddButtonPress = () => {
    const camera = this.cameraRef.current;
    this.props.addPhoto(camera.takePictureAsync(captureOptions));
  };
  render() {
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
              {this.cameraRef.current && (
                <View style={styles.buttonContainer}>
                  <AddButton onPress={this.handleAddButtonPress} />
                </View>
              )}
            </View>
          );
        }}
      </PermissionsContext.Consumer>
    );
  }
}

export default withNavigationMount(CameraView);
