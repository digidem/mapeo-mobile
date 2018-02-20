// @flow
import React from 'react';
import { TabNavigator } from 'react-navigation';
import MapView from '@src/components/Views/MapView';
import CameraView from '@src/components/Views/CameraView/CameraView';
import Icon from 'react-native-vector-icons/MaterialIcons';

const routeConfiguration = {
  MapView: {
    screen: MapView,
    navigationOptions: {
      tabBarIcon: () => (
        <Icon
          color="black"
          name="near-me"
          size={30}
          style={{ marginLeft: -3 }}
        />
      ),
    },
  },
  CameraView: {
    screen: CameraView,
    navigationOptions: {
      tabBarIcon: () => (
        <Icon
          color="black"
          name="photo-camera"
          size={30}
          style={{ marginLeft: -3 }}
        />
      ),
    },
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

export default TabBar;
