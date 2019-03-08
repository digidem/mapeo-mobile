import React from "react";
import { Text, View } from "react-native";
import { Permissions } from "@unimodules/core";
import { Camera } from "expo-camera";

import withNavigationMount from "../hocs/withNavigationMount";

class CameraView extends React.Component {
  state = {
    hasCameraPermission: null
  };

  async componentDidMount() {
    this._mounted = true;
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (this._mounted)
      this.setState({ hasCameraPermission: status === "granted" });
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            style={{ flex: 1 }}
            type={Camera.Constants.Type.back}
            useCamera2Api={false}
          />
        </View>
      );
    }
  }
}

export default withNavigationMount(CameraView);
