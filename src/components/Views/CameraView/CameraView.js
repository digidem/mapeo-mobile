// @flow
import React from 'react';
import { withNavigationFocus } from 'react-navigation';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { size } from 'lodash';
import Drawer from 'react-native-drawer';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CollectionsImg from 'react-native-vector-icons/MaterialIcons';
import type { Observation } from '../../../types/observation';
import { CHARCOAL, WHITE } from '../../../lib/styles.js';

import ObservationsView from '../ObservationsView';
import AddButton from '../../../images/add-button.png';
import { applyObservationDefaults } from '../../../models/observations';
import Header from '../../Base/Header';
import SavedModal from '../../Base/SavedModal';

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
    position: 'absolute',
    bottom: 25
  },
  captureFromEditor: {
    alignSelf: 'center',
    marginTop: 375
  },
  preview: {
    flex: 1,
    alignItems: 'center'
  }
});

export type Props = {
  navigation: any,
  isFocused: boolean
};

export type StateProps = {
  fromEditor: boolean,
  observations: {
    [id: string]: Observation
  },
  selectedObservation?: Observation,
  showSavedModal: boolean
};

export type DispatchProps = {
  createObservation: (observation: Observation) => void,
  goToCategories: () => void,
  goToObservationEditor: () => void,
  updateObservation: (o: Observation) => void,
  onDrawerClose: () => void,
  onDrawerOpen: () => void
};

type State = {
  loading: boolean
};

I18n.fallbacks = true;
I18n.translations = {
  en: require('../../../translations/en'),
  es: require('../../../translations/es')
};

class CameraView extends React.Component<
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
  rightDrawer: Drawer;

  takePicture = async () => {
    const {
      createObservation,
      fromEditor,
      goToObservationEditor,
      goToCategories,
      navigation,
      observations,
      selectedObservation,
      updateObservation
    } = this.props;
    if (this.camera) {
      const options = { quality: 0.5, base64: true, fixOrientation: true };
      try {
        this.setState({ loading: true });
        const data = await this.camera.takePictureAsync(options);
        this.setState({ loading: false });

        if (fromEditor) {
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
            goToObservationEditor();
          }
        } else {
          goToCategories();
          const initialObservation = applyObservationDefaults({
            id: size(observations) + 1,
            createdFrom: 'camera'
          });
          createObservation(initialObservation);

          navigator.geolocation.getCurrentPosition(
            position => {
              const { latitude, longitude } = position.coords;

              updateObservation({
                ...(selectedObservation || initialObservation),
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
        }
      } catch (error) {
        console.warn(error);
      }
    }
  };

  closeRightDrawer = () => {
    this.rightDrawer.close();
  };

  openRightDrawer = () => {
    this.rightDrawer.open();
  };

  handleRightDrawerRef = (ref: Drawer) => {
    this.rightDrawer = ref;
  };

  goToMapView = () => {
    this.props.navigation.navigate({ routeName: 'MapView' });
  };

  render() {
    const { loading } = this.state;
    const {
      fromEditor,
      isFocused,
      navigation,
      onDrawerOpen,
      onDrawerClose,
      showSavedModal
    } = this.props;

    if (!isFocused) {
      console.log('RN - Unmount RNCamera in CameraView');
      return null;
    }

    if (fromEditor) {
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
            <TouchableOpacity
              onPress={this.takePicture}
              style={fromEditor ? styles.captureFromEditor : styles.capture}
            >
              <Image
                source={AddButton}
                style={{
                  width: 125,
                  height: 125
                }}
              />
            </TouchableOpacity>
            {fromEditor && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => this.props.navigation.goBack()}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </RNCamera>
          {loading && (
            <View
              style={{
                position: 'absolute',
                height: fromEditor
                  ? Dimensions.get('window').height - 30
                  : Dimensions.get('window').height,
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
    return (
      <Drawer
        ref={this.handleRightDrawerRef}
        content={<ObservationsView closeRightDrawer={this.closeRightDrawer} />}
        onCloseStart={onDrawerClose}
        onOpenStart={onDrawerOpen}
        openDrawerOffset={0}
        side="right"
        type="displace"
      >
        <Header
          leftIcon={
            <TouchableOpacity onPress={this.goToMapView}>
              <Icon color={WHITE} name="map" size={30} />
            </TouchableOpacity>
          }
          rightIcon={
            <TouchableOpacity onPress={this.openRightDrawer}>
              <CollectionsImg color={WHITE} name="collections" size={30} />
            </TouchableOpacity>
          }
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 5
          }}
        />
        {showSavedModal && <SavedModal />}
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
            <TouchableOpacity
              onPress={this.takePicture}
              style={fromEditor ? styles.captureFromEditor : styles.capture}
            >
              <Image
                source={AddButton}
                style={{
                  width: 125,
                  height: 125
                }}
              />
            </TouchableOpacity>
            {fromEditor && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => this.props.navigation.goBack()}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </RNCamera>
          {loading && (
            <View
              style={{
                position: 'absolute',
                height: fromEditor
                  ? Dimensions.get('window').height - 30
                  : Dimensions.get('window').height,
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
      </Drawer>
    );
  }
}

export default withNavigationFocus(CameraView);
