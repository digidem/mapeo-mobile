// @flow
import React from "react";
import { Text, View } from "react-native";
import { Camera } from "expo-camera";

import withNavigationMount from "../hocs/withNavigationMount";
import PermissionsContext, {
  PERMISSIONS,
  RESULTS
} from "../context/PermissionsContext";

const CameraView = () => (
  <PermissionsContext.Consumer>
    {({ permissions }) => {
      if (permissions[PERMISSIONS.CAMERA] !== RESULTS.GRANTED)
        return <Text>No access to camera</Text>;
      return (
        <View style={{ flex: 1 }}>
          <Camera
            style={{ flex: 1 }}
            type={Camera.Constants.Type.back}
            useCamera2Api={false}
          />
        </View>
      );
    }}
  </PermissionsContext.Consumer>
);

export default withNavigationMount(CameraView);
