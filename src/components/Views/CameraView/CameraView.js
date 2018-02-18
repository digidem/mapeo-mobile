// @flow
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';

import CircleImg from '../../../images/circle-64.png';

const styles = StyleSheet.create({
  capture: {
    alignSelf: 'center',
    margin: 20,
  },
  preview: {
    flex: 1,
    alignItems: 'center',
  },
});


class CameraView extends React.Component {
  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
    }
  }

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <RNCamera
          ref={(ref) => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          permissionDialogTitle="Permission to use camera"
          permissionDialogMessage="We need your permission to use your camera phone"
        />
        <View>
          <TouchableOpacity onPress={this.takePicture} style={styles.capture}>
            <Image source={CircleImg} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default CameraView;
