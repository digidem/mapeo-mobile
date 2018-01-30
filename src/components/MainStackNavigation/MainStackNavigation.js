// @flow
import React from 'react';
import { DrawerNavigator, StackNavigator } from 'react-navigation';
import TabBarNavigation from '@src/components/TabBar/TabBarNavigation';
import NewObservationView from '@src/components/Views/NewObservationView/NewObservationView';
import CameraViewDrawerNavigation from '@src/components/Views/CameraView/CameraViewDrawerNavigation';
import MapViewDrawerNavigation from '@src/components/Views/MapView/MapViewDrawerNavigation';

const routeConfiguration = {
  TabBarNavigation: { screen: ({ navigation }) => <TabBarNavigation screenProps={{ rootNavigation: navigation }} /> },
  NewObservationView: { screen: NewObservationView },
  CameraViewDrawerNavigation: { screen: CameraViewDrawerNavigation },
  MapViewDrawerNavigation: { screen: MapViewDrawerNavigation },
};
const stackConfiguration = {
  initialRouteName: 'MapViewDrawerNavigation',
  headerMode: 'none',
};

const MainStack = StackNavigator(routeConfiguration, stackConfiguration);

class MainStackNavigation extends React.Component {
  render() {
    return (
      <MainStack />
    );
  }
}

export default MainStackNavigation;