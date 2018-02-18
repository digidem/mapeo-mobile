// @flow
import React from 'react';
import { addNavigationHelpers, TabNavigator } from 'react-navigation';
import { Image } from 'react-native';
import MapView from '@src/components/Views/MapView';
import CameraView from '@src/components/Views/CameraView/CameraView';

import MapViewIcon from '../../../images/location-arrow.png';
import CameraViewIcon from '../../../images/photo-camera.png';

const routeConfiguration = {
  MapView: {
    screen: MapView,
    navigationOptions: {
      tabBarIcon: () => (
        <Image source={MapViewIcon} />
      ),
    },
  },
  CameraView: {
    screen: CameraView,
    navigationOptions: {
      tabBarIcon: () => (
        <Image source={CameraViewIcon} />
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

