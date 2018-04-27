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
import moment from 'moment';
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
import CategoryPin from '../../../images/category-pin.png';
import Header from '../../Base/Header/Header';

const styles = StyleSheet.create({
  buttonText: {
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: '400',
    color: MAPEO_BLUE
  },
  categoryContainer: {
    flex: 3,
    backgroundColor: VERY_LIGHT_BLUE,
    alignSelf: 'stretch',
    alignItems: 'center',
    borderRadius: 20
  },
  categoryPin: {
    width: 80,
    height: 90,
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  confirmationModal: {
    alignSelf: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width * 0.8,
    height: Dimensions.get('window').height * 0.5,
    backgroundColor: 'white',
    borderRadius: 20
  },
  date: {
    color: MEDIUM_GREY,
    fontSize: 12,
    fontWeight: '400'
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
  positionAtText: {
    fontSize: 12,
    color: 'black',
    fontWeight: '400'
  },
  positionText: {
    fontSize: 12,
    color: 'black',
    fontWeight: '700'
  },
  profileIcon: {
    position: 'absolute',
    left: 20,
    top: 15
  },
  savedContainer: {
    borderColor: LIGHT_GREY,
    borderBottomWidth: 1,
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: 'black',
    textAlign: 'center'
  }
});

type Props = {
  isFocused: boolean
};

export type StateProps = {
  selectedObservation: Observation,
  dispatch: any,
  navigation: NavigationActions
};

type State = {
  showModal: boolean,
  showCamera: boolean
};

I18n.fallbacks = true;
I18n.translations = {
  en: require('../../../translations/en'),
  es: require('../../../translations/es')
};

class TabBarNavigation extends React.Component<Props & StateProps, State> {
  state = {
    showModal: false,
    showCamera: false
  };

  componentDidMount() {
    this.setState({
      showModal: false
    });
  }

  componentWillReceiveProps(nextProps: Props & StateProps) {
    if (nextProps.isFocused) {
      const { navigation } = nextProps;
      const shouldShowModal = !!(
        navigation.state &&
        navigation.state.params &&
        navigation.state.params.showModal
      );
      if (shouldShowModal) {
        this.timeout = setTimeout(
          () =>
            this.setState({
              showModal: true
            }),
          2000
        );
      }
    }
  }

  shouldComponentUpdate(nextProps: Props & StateProps, nextState: State) {
    if (nextProps.isFocused) {
      if (nextProps !== this.props || nextState !== this.state) {
        return true;
      }
    }
    return false;
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  setModalVisible(visible: boolean) {
    this.setState({
      showModal: visible
    });
  }

  timeout: any;
  rightDrawer: Drawer;

  shouldShowModal() {
    const { navigation } = this.props;
    return !!(
      navigation.state &&
      navigation.state.params &&
      navigation.state.params.showModal
    );
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
    const { dispatch, selectedObservation } = this.props;
    const { showModal, showCamera } = this.state;

    return (
      <Drawer
        ref={this.handleRightDrawerRef}
        content={<ObservationsView closeRightDrawer={this.closeRightDrawer} />}
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
        {selectedObservation && (
          <Modal
            animation="slide"
            transparent
            visible={this.state.showModal}
            onRequestClose={() => {}}
          >
            <View
              style={{
                backgroundColor: 'rgba(52, 52, 52, 0.8)',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <View style={styles.confirmationModal}>
                <View style={styles.savedContainer}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 20,
                      fontWeight: '700',
                      color: 'black'
                    }}
                  >
                    {I18n.t('saved')}
                  </Text>
                </View>
                <View style={styles.categoryContainer}>
                  <ImageBackground
                    source={CategoryPin}
                    style={styles.categoryPin}
                  >
                    {selectedObservation && (
                      <View style={{ marginTop: -10 }}>
                        {selectedObservation.icon && (
                          <Image
                            source={selectedObservation.icon}
                            style={{ width: 30, height: 30 }}
                            resizeMode="contain"
                          />
                        )}
                      </View>
                    )}
                  </ImageBackground>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingBottom: 10
                    }}
                  >
                    <Text style={styles.title}>{selectedObservation.type}</Text>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={styles.positionAtText}>{I18n.t('at')} </Text>
                      <Text style={styles.positionText}>
                        {`${selectedObservation.lat}, ${
                          selectedObservation.lon
                        }.`}
                      </Text>
                    </View>
                    <Text style={styles.date}>
                      {I18n.t('on')}{' '}
                      {moment(selectedObservation.created).format(
                        'MMMM D, h:mm A'
                      )}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        )}
        {!showCamera && <MapView />}
        {showCamera && <CameraView />}
      </Drawer>
    );
  }
}

export default TabBarNavigation;
