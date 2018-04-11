// @flow
import React from 'react';
import { withNavigationFocus } from 'react-navigation';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  ActivityIndicator,
  Text
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { size } from 'lodash';
import I18n from 'react-native-i18n';
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
    marginTop: 385
  },
  preview: {
    flex: 1,
    alignItems: 'center'
  }
});

export type Props = {
  isFocused: boolean
};

export type StateProps = {
  observations: {
    [id: string]: Observation
  }
};

type State = {
  loading: boolean
};

export type DispatchProps = {
  createObservation: (observation: Observation) => void,
  updateObservation: (o: Observation) => void,
  goToCategories: () => void
};

I18n.fallbacks = true;
I18n.translations = {
  en: require('../../../translations/en'),
  es: require('../../../translations/es')
};

class CameraTabView extends React.Component<
  Props & StateProps & DispatchProps,
  State
> {
  state = {
    loading: false
  };

  shouldComponentUpdate(
    nextProps: Props & StateProps & DispatchProps,
    nextState: State
  ) {
    if (nextProps.isFocused) {
      return nextProps !== this.props || nextState !== this.state;
    }

    return false;
  }

  camera: RNCamera;

  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true, fixOrientation: true };
      try {
        const {
          createObservation,
          observations,
          updateObservation,
          goToCategories
        } = this.props;

        this.setState({ loading: true });

        const data = await this.camera.takePictureAsync(options);

        this.setState({ loading: false });

        goToCategories();
        const initialObservation = {
          type: '',
          id: size(observations) + 1,
          lat: 0,
          lon: 0,
          link: 'link',
          created: new Date(),
          name: '',
          notes: '',
          observedBy: 'You',
          media: [],
          icon: null
        };
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
      } catch (error) {
        console.warn(error);
      }
    }
  };

  render() {
    const { loading } = this.state;
    const { isFocused } = this.props;

    console.log('RN - ', isFocused);
    if (!isFocused) {
      console.log('RN - unmount RNCamera in TabView');
      return <View />;
    }

    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column'
        }}
      >
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
        </RNCamera>
        {loading && (
          <View
            style={{
              position: 'absolute',
              height: Dimensions.get('window').height - 30,
              width: Dimensions.get('window').width,
              backgroundColor: 'rgba(66,66,66,.8)',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <View
              style={{
                backgroundColor: '#FFF',
                paddingHorizontal: 50,
                paddingVertical: 30,
                justifyContent: 'center',
                borderRadius: 3
              }}
            >
              <ActivityIndicator />
              <Text>{I18n.t('saving_image')}</Text>
            </View>
          </View>
        )}
      </View>
    );
  }
}

export default withNavigationFocus(CameraTabView);
