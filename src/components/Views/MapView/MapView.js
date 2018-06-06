// @flow
import React from 'react';
import { NavigationActions } from 'react-navigation';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  Modal,
  Dimensions,
  ImageBackground,
  Image
} from 'react-native';
import Drawer from 'react-native-drawer';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { isEmpty, size, map, filter } from 'lodash';
import type { CreateRequest, UpdateRequest } from '@api/observations';
import env from '../../../../env.json';
import AddButton from '../../../images/add-button.png';
import Gradient from '../../../images/gradient-overlay.png';
import { applyObservationDefaults } from '../../../models/observations';
import type { Resource } from '../../../types/redux';
import type { GPSState } from '../../../types/gps';
import CollectionsImg from 'react-native-vector-icons/MaterialIcons';
import type { Observation } from '../../../types/observation';
import ObservationsView from '../ObservationsView';
import Map from './Map';
import {
  WHITE,
  MAPEO_BLUE,
  LIGHT_GREY,
  VERY_LIGHT_BLUE,
  MEDIUM_GREY
} from '../../../lib/styles';
import Header from '../../Base/Header';
import SavedModal from '../../Base/SavedModal';
import { API_DOMAIN_URL } from '../../../api/base';

export type StateProps = {
  observations: {
    [id: string]: Observation
  },
  selectedObservation?: Observation,
  gps?: GPSState,
  showSavedModal: boolean
  selectedStyle?: string
};

export type DispatchProps = {
  listObservations: () => void,
  createObservation: (observation: CreateRequest) => void,
  updateObservation: (observation: UpdateRequest) => void,
  goToCategories: () => void,
  goToObservationDetail: () => void,
  selectObservation: (observation: Observation) => void,
  onDrawerClose: () => void,
  onDrawerOpen: () => void
  listStyles: () => void
};

type Props = {
  isFocused: boolean,
  navigation: NavigationActions
};

const styles = StyleSheet.create({
  buttonText: {
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: '400',
    color: MAPEO_BLUE
  },
  myObservationsIcon: {
    position: 'absolute',
    right: 20,
    top: 15
  },
  cameraIcon: {
    position: 'absolute',
    left: 20,
    top: 15
  },
  profileIcon: {
    position: 'absolute',
    left: 20,
    top: 15
  }
});

I18n.fallbacks = true;
I18n.translations = {
  en: require('../../../translations/en'),
  es: require('../../../translations/es')
};

class MapView extends React.Component<Props & StateProps & DispatchProps> {
  rightDrawer: Drawer;

  closeRightDrawer = () => {
    this.rightDrawer.close();
  };

  openRightDrawer = () => {
    this.rightDrawer.open();
  };

  handleRightDrawerRef = (ref: Drawer) => {
    this.rightDrawer = ref;
  };

  goToCameraView = () => {
    this.props.navigation.navigate({ routeName: 'CameraView' });
  };

  render() {
    const {
      navigation,
      onDrawerClose,
      onDrawerOpen,
      showSavedModal,
      selectedStyle
    } = this.props;

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
            <TouchableOpacity onPress={this.goToCameraView}>
              <Icon color={WHITE} name="photo-camera" size={30} />
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
        <Map />
      </Drawer>
    );
  }
}

export default MapView;
