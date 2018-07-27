// @flow
import React from 'react';
import {
  Image,
  Keyboard,
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
import type { NavigationScreenProp } from 'react-navigation';
import type { UpdateRequest } from '@api/observations';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CollectionsImg from 'react-native-vector-icons/MaterialIcons';
import type { Observation } from '../../../types/observation';
import { CHARCOAL, WHITE } from '../../../lib/styles.js';

import ObservationsView from '../ObservationsView';
import AddButton from '../../../images/add-button.png';
import { defaultObservation } from '../../../models/observations';
import Header from '../../Base/Header';
import SavedModal from '../../Base/SavedModal';
import type { MediaSaveMeta } from '../../../ducks/media';

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
    bottom: 2
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
  navigation: NavigationScreenProp<*>
};

export type StateProps = {
  observations: {
    [id: string]: Observation
  },
  selectedObservation?: Observation,
  showSavedModal: boolean,
  showEditorView: boolean
};

export type DispatchProps = {
  createObservation: (observation: Observation) => void,
  updateObservation: (o: UpdateRequest) => void,
  onDrawerClose: () => void,
  onDrawerOpen: () => void,
  updateObservationSource: () => void,
  saveMedia: (meta: MediaSaveMeta) => void
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
  camera: RNCamera;
  rightDrawer: Drawer;

  takePicture = async () => {
    const {
      createObservation,
      navigation,
      observations,
      selectedObservation,
      updateObservationSource,
      showEditorView,
      saveMedia
    } = this.props;
    if (this.camera) {
      const options = { quality: 0.5, base64: false, fixOrientation: true };
      try {
        this.setState({ loading: true });
        const data = await this.camera.takePictureAsync(options);
        this.setState({ loading: false });

        if (showEditorView && selectedObservation) {
          saveMedia({ source: data.uri, generateThumbnail: true });
          navigation.navigate({ routeName: 'ObservationEditor' });
        } else {
          navigation.navigate({
            routeName: 'Categories'
          });
          const initialObservation = {
            ...defaultObservation,
            id: (size(observations) + 1).toString()
          };
          console.log('updating source, creating, saving media');
          updateObservationSource();
          createObservation(initialObservation);
          saveMedia({ source: data.uri, generateThumbnail: true });
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
    const { navigation } = this.props;
    navigation.navigate({ routeName: 'MapView' });
  };

  renderCamera = (fromEditor: boolean, loading: boolean) => (
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
            onPress={() => {
              this.props.navigation.goBack('camera-view');
            }}
          >
            <Text style={styles.cancelText}>{I18n.t('cancel')}</Text>
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

  render() {
    const { loading } = this.state;
    const {
      selectedObservation,
      navigation,
      onDrawerOpen,
      onDrawerClose,
      showSavedModal,
      showEditorView
    } = this.props;

    if (showEditorView) {
      return this.renderCamera(true, loading);
    }

    return (
      <Drawer
        ref={this.handleRightDrawerRef}
        content={
          <ObservationsView
            closeRightDrawer={this.closeRightDrawer}
            navigation={navigation}
          />
        }
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
        <SavedModal />
        {this.renderCamera(false, loading)}
      </Drawer>
    );
  }
}

export default CameraView;
