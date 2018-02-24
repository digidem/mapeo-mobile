// @flow
import React from 'react';
import { NavigationActions, withNavigation } from 'react-navigation';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import type { Observation } from '@types/observation';

import CircleImg from '../../../images/circle-64.png';

const styles = StyleSheet.create({
  capture: {
    alignSelf: 'center',
    marginTop: 425
  },
  preview: {
    flex: 1,
    alignItems: 'center'
  }
});

type Props = {
  navigation: NavigationActions
};

export type StateProps = {
  selectedObservation: Observation
};

export type DispatchProps = {
  updateObservation: (o: Observation) => void
};

class CameraView extends React.PureComponent<
  Props & StateProps & DispatchProps
> {
  camera: RNCamera;

  takePicture = async () => {
    const { updateObservation, selectedObservation, navigation } = this.props;
    if (this.camera) {
      const options = { quality: 0.5, base64: true, exif: true };
      try {
        const data = await this.camera.takePictureAsync(options);
        if (selectedObservation) {
          updateObservation({
            ...selectedObservation,
            media: selectedObservation.media.concat([
              {
                type: 'Photo',
                source: data.uri
              }
            ])
          });
          navigation.navigate('ObservationEditor');
        }

        console.log(data.uri, data.exif);
      } catch (error) {
        console.error(error);
      }
    }
  };

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          permissionDialogTitle="Permission to use camera"
          permissionDialogMessage="We need your permission to use your camera phone"
        >
          <TouchableOpacity onPress={this.takePicture} style={styles.capture}>
            <Image source={CircleImg} />
          </TouchableOpacity>
        </RNCamera>
      </View>
    );
  }
}

export default withNavigation(CameraView);
