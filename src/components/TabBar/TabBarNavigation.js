import React from 'react';
import { TabNavigator } from 'react-navigation';
import MapViewNavigation from '@src/components/Views/MapView/MapViewNavigation';
import CameraViewNavigation from '@src/components/Views/CameraView/CameraViewNavigation';

const routeConfiguration = {
  MapViewNavigation: { screen: MapViewNavigation },
  CameraViewNavigation: { screen: CameraViewNavigation },
};

const tabConfiguration = {
  tabBarPosition: 'bottom',
  tabBarOptions: {
    showIcon: true,
    showLabel: false,
  },
};

const TabBar = TabNavigator(routeConfiguration, tabConfiguration);

class TabBarNavigation extends React.Component {
 
  render() {
    return (
      <TabBar />
    );
  }
}

export default TabBarNavigation;
