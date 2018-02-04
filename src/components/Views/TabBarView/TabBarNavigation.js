// @flow
import React from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers, TabNavigator } from 'react-navigation';
import { Button, Image, StyleSheet, TouchableHighlight, View } from 'react-native';
import Drawer from 'react-native-drawer';

import MapView from '@src/components/Views/MapView';
import CameraView from '@src/components/Views/CameraView/CameraView';
import PreferencesView from '@src/components/Views/PreferencesView/PreferencesView';
import MyObservationsView from '@src/components/Views/MyObservationsView';

const routeConfiguration = {
  MapView: {
    screen: MapView,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => (
        <Image source={require('../../../images/location-arrow.png')} />
      ),
    },
  },
  CameraView: {
    screen: CameraView,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => (
        <Image source={require('../../../images/photo-camera.png')} />
      ),
    }
  },
};

const tabConfiguration = {
  swipeEnabled: false,
  tabBarPosition: 'bottom',
  tabBarOptions: {
    activeTintColor: 'blue',
    showIcon: true,
    showLabel: false,
    style: {
      backgroundColor: 'white',
    },
  },
};

const TabBar = TabNavigator(routeConfiguration, tabConfiguration);

const mapStateToProps = (state) => {
  return {
    navigationState: state.tabBar,
  }
};

const styles = StyleSheet.create({
  myObservationsIcon: {
    position: 'absolute',
    right: 20,
    top: 20,
  },

  profileIcon: {
    position: 'absolute',
    left: 20,
    top: 20,
  },
});

class TabBarNavigation extends React.Component {

  closeLeftDrawer = () => {
    this.leftDrawer.close();
  }

  openLeftDrawer = () => {
    this.leftDrawer.open();
  }

  closeRightDrawer = () => {
    this.rightDrawer.close();
  }

  openRightDrawer = () => {
    this.rightDrawer.open();
  }

  render() {
    const { dispatch, navigationState } = this.props;

    return(
      <Drawer
        ref={(ref) => this.leftDrawer = ref}
        content={<PreferencesView closeLeftDrawer={this.closeLeftDrawer} />}
        openDrawerOffset={30}
        type='displace'
      >
        <Drawer
          ref={(ref) => this.rightDrawer = ref}
          content={<MyObservationsView closeRightDrawer={this.closeRightDrawer} />}
          openDrawerOffset={30}
          side='right'
          type='displace'
        >
          <View style={{flexDirection: 'row', height: 60}}>
            <TouchableHighlight
              onPress={this.openLeftDrawer}
              style={styles.profileIcon}
              underlayColor='antiquewhite'
            >
              <Image source={require('../../../images/profile.png')} />
            </TouchableHighlight>
            <TouchableHighlight
              onPress={this.openRightDrawer}
              style={styles.myObservationsIcon}
              underlayColor='antiquewhite'
            >
              <Image source={require('../../../images/collections.png')} />
            </TouchableHighlight>
          </View>
          <TabBar
            navigation={
              addNavigationHelpers({
                dispatch: dispatch,
                state: navigationState,
              })
            }
          />
        </Drawer>
      </Drawer>
    );
  }
}

TabBarNavigation.router = TabBar.router;

export default connect(mapStateToProps)(TabBarNavigation);
