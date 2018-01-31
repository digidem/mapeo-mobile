// @flow
import React from 'react';
import { TabNavigator } from 'react-navigation';
import { Image } from 'react-native';

import MapView from '@src/components/Views/MapView';
import CameraView from '@src/components/Views/CameraView/CameraView';

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

const TabBarNavigation = TabNavigator(routeConfiguration, tabConfiguration);

export default TabBarNavigation;
