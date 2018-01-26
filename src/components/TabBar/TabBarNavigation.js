import React from 'react';
import { TabNavigator } from 'react-navigation';
import MapViewNavigation from '@src/components/Views/MapView/MapViewNavigation';
import CameraViewNavigation from '@src/components/Views/CameraView/CameraViewNavigation';

const routeConfiguration = {
  MapViewNavigation: { screen: MapViewNavigation },
  CameraViewNavigation: { screen: CameraViewNavigation },
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

class TabBarNavigation extends React.Component {
 
  render() {
    return (
      <TabBar />
    );
  }
}

export default TabBarNavigation;
