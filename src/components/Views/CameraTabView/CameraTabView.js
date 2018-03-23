// @flow
import React from 'react';
import { NavigationActions, withNavigation } from 'react-navigation';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { size } from 'lodash';
import type { Observation } from '../../../types/observation';
import { CHARCOAL, WHITE } from '../../../lib/styles.js';

import CircleImg from '../../../images/circle-64.png';

const styles = StyleSheet.create({
  cancelButton: {
    backgroundColor: CHARCOAL,
    justifyContent: 'center',
    height: 60,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  cancelText: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    color: WHITE
  },
  capture: {
    alignSelf: 'center',
    marginTop: 425
  },
  preview: {
    flex: 1,
    alignItems: 'center'
  }
});

export type Props = {
  navigation: NavigationActions
};

export type StateProps = {
  observations: {
    [id: string]: Observation
  },
  selectedObservation: Observation
};

export type DispatchProps = {
  createObservation: (observation: Observation) => void,
  updateObservation: (o: Observation) => void,
  goToObservationEditor: () => void,
  goToCategories: () => void,
  resetNavigation: () => void
};

class CameraTabView extends React.PureComponent<
  Props & StateProps & DispatchProps
> {
  camera: RNCamera;

  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true, exif: true };
      try {
        const data = await this.camera.takePictureAsync(options);

        const {
          createObservation,
          observations,
          resetNavigation,
          updateObservation,
          goToCategories
        } = this.props;
        const initialObservation = {
          type: 'Rios y corrientes',
          id: size(observations) + 1,
          lat: 0,
          lon: 0,
          link: 'link',
          created: new Date(),
          name: '',
          notes: '',
          observedBy: 'You',
          media: [],
          icon: null,
          createdFrom: 'Camera'
        };

        resetNavigation();

        createObservation(initialObservation);
        navigator.geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords;
            updateObservation({
              ...initialObservation,
              lat: Math.round(latitude * 1000) / 1000,
              lon: Math.round(longitude * 1000) / 1000,
              media: initialObservation.media.concat([
                {
                  type: 'Photo',
                  source: data.uri
                }
              ])
            });
          },
          error => console.warn(error)
        );
        goToCategories();
      } catch (error) {
        console.warn(error);
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
          flashMode={RNCamera.Constants.FlashMode.off}
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

export default withNavigation(CameraTabView);
