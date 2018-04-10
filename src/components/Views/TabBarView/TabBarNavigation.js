// @flow
import React from 'react';
import { NavigationActions, addNavigationHelpers } from 'react-navigation';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  Modal,
  Dimensions,
  ImageBackground
} from 'react-native';
import Drawer from 'react-native-drawer';
import moment from 'moment';
import I18n from 'react-native-i18n';
import CollectionsImg from 'react-native-vector-icons/MaterialIcons';
import type { Observation } from '../../../types/observation';
import ObservationsView from '../../Views/ObservationsView';
import TabBar from './TabBar';
import {
  WHITE,
  MAPEO_BLUE,
  LIGHT_GREY,
  VERY_LIGHT_BLUE,
  MEDIUM_GREY
} from '../../../lib/styles';
import CategoryPin from '../../../images/category-pin.png';
import { tabBarAddListener } from '../../../lib/store';

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
    borderColor: LIGHT_GREY,
    borderBottomWidth: 1,
    alignSelf: 'stretch',
    alignItems: 'center'
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
    height: Dimensions.get('window').height * 0.7,
    backgroundColor: 'white',
    marginTop: 50,
    borderRadius: 20
  },
  continueContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center'
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
  reviewContainer: {
    borderColor: LIGHT_GREY,
    borderBottomWidth: 1,
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center'
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

export type StateProps = {
  selectedObservation: Observation,
  navigationState: any,
  dispatch: any,
  navigation: NavigationActions
};

type State = {
  loading: boolean,
  showModal: boolean
};

I18n.fallbacks = true;
I18n.translations = {
  en: require('../../../translations/en'),
  es: require('../../../translations/es')
};

class TabBarNavigation extends React.Component<StateProps, State> {
  static router = TabBar.router;
  state = {
    showModal: false,
    loading: true
  };

  componentDidMount() {
    this.timeout = setTimeout(
      () =>
        this.setState({
          loading: false,
          showModal: this.shouldShowModal()
        }),
      2000
    );
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  setModalVisible(visible: boolean) {
    this.setState({
      loading: false,
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

  render() {
    const { dispatch, navigationState, selectedObservation } = this.props;
    const { loading, showModal } = this.state;

    return (
      <Drawer
        ref={this.handleRightDrawerRef}
        content={<ObservationsView closeRightDrawer={this.closeRightDrawer} />}
        openDrawerOffset={0}
        side="right"
        type="displace"
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: 60,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 5
          }}
        >
          <View
            style={{
              height: 35,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, .8)',
              borderRadius: 50,
              paddingLeft: loading ? 7 : 13,
              paddingRight: 15
            }}
          >
            {loading && (
              <ActivityIndicator
                style={{ height: 30, width: 30 }}
                color={MAPEO_BLUE}
              />
            )}
            {loading && (
              <Text style={{ color: WHITE, marginLeft: 5 }}>
                GPS: Loading...
              </Text>
            )}
            {!loading && (
              <View
                style={{
                  backgroundColor: '#7AFA4C',
                  height: 10,
                  width: 10,
                  borderRadius: 50
                }}
              />
            )}
            {!loading && (
              <Text style={{ color: WHITE, marginLeft: 10 }}>
                GPS: {I18n.t('strong')}
              </Text>
            )}
          </View>
          <TouchableOpacity
            onPress={this.openRightDrawer}
            style={styles.myObservationsIcon}
          >
            <CollectionsImg color={WHITE} name="collections" size={40} />
          </TouchableOpacity>
        </View>
        {selectedObservation && (
          <Modal
            animation="slide"
            transparent
            visible={this.state.showModal}
            onRequestClose={() => {
              alert('Modal closed');
            }}
          >
            <View
              style={{
                backgroundColor: 'rgba(52, 52, 52, 0.8)',
                flex: 1
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
                    Saved!
                  </Text>
                </View>
                <View style={styles.categoryContainer}>
                  <ImageBackground
                    source={CategoryPin}
                    style={styles.categoryPin}
                  >
                    {selectedObservation && (
                      <View style={{ marginTop: -10 }}>
                        {selectedObservation.icon}
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
                        'MMMM D, h:hh A'
                      )}
                    </Text>
                  </View>
                </View>
                <View style={styles.reviewContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setModalVisible(!showModal);
                      this.props.navigation.navigate('ObservationDetailView');
                    }}
                  >
                    <Text style={styles.buttonText}>Review</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.continueContainer}>
                  <TouchableOpacity
                    onPress={() => this.setModalVisible(!showModal)}
                  >
                    <Text style={styles.buttonText}>Continue</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}
        <TabBar
          navigation={addNavigationHelpers({
            dispatch,
            state: navigationState,
            addListener: tabBarAddListener
          })}
        />
      </Drawer>
    );
  }
}

export default TabBarNavigation;
