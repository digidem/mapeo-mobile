// @flow
import React from 'react';
import { NavigationActions, withNavigation } from 'react-navigation';
import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import type { Observation } from '../../../types/observation';
import { CHARCOAL, WHITE } from '../../../lib/styles.js';

import AddButton from '../../../images/add-button.png';

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
    marginTop: 375
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
  selectedObservation: Observation
};

export type DispatchProps = {
  updateObservation: (o: Observation) => void,
  resetNavigation: () => void
};

class CameraView extends React.PureComponent<
  Props & StateProps & DispatchProps
> {
  camera: RNCamera;

  takePicture = async () => {
    const {
      updateObservation,
      selectedObservation,
      resetNavigation
    } = this.props;
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
          resetNavigation();
        }
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
            <Image
              source={AddButton}
              style={{
                width: 125,
                height: 125
              }}
            />
          </TouchableOpacity>
          <TouchableHighlight
            style={styles.cancelButton}
            onPress={() => this.props.navigation.goBack()}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableHighlight>
        </RNCamera>
      </View>
    );
  }
}

export default withNavigation(CameraView);
