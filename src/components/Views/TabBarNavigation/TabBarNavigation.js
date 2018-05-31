// @flow
import React from 'react';
import { NavigationActions, withNavigationFocus } from 'react-navigation';
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
import CollectionsImg from 'react-native-vector-icons/MaterialIcons';
import type { Observation } from '../../../types/observation';
import ObservationsView from '../ObservationsView';
import MapView from '../MapView';
import CameraView from '../CameraMainView';
import {
  WHITE,
  MAPEO_BLUE,
  LIGHT_GREY,
  VERY_LIGHT_BLUE,
  MEDIUM_GREY
} from '../../../lib/styles';
import Header from '../../Base/Header';
import SavedModal from './SavedModal';

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

type Props = {
  isFocused: boolean
};

export type StateProps = {
  showSavedModal: boolean
};

export type DispatchProps = {
  onDrawerClose: () => void,
  onDrawerOpen: () => void,
  listObservations: () => void
};

type State = {
  showCamera: boolean
};

I18n.fallbacks = true;
I18n.translations = {
  en: require('../../../translations/en'),
  es: require('../../../translations/es')
};

class TabBarNavigation extends React.Component<
  Props & StateProps & DispatchProps,
  State
> {
  state = {
    showCamera: false
  };
  rightDrawer: Drawer;

  componentWillReceiveProps(nextProps: Props & StateProps & DispatchProps) {
    if (nextProps.isFocused && this.props.isFocused !== nextProps.isFocused) {
      nextProps.listObservations();
    }
  }

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
    this.setState({ showCamera: true });
  };

  goToMapView = () => {
    this.setState({ showCamera: false });
  };

  render() {
    const { onDrawerClose, onDrawerOpen, showSavedModal } = this.props;
    const { showCamera } = this.state;

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
            !showCamera ? (
              <TouchableOpacity onPress={this.goToCameraView}>
                <Icon color={WHITE} name="photo-camera" size={30} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={this.goToMapView}>
                <Icon color={WHITE} name="map" size={30} />
              </TouchableOpacity>
            )
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
        {!showCamera && <MapView />}
        <CameraView />
      </Drawer>
    );
  }
}

export default TabBarNavigation;
