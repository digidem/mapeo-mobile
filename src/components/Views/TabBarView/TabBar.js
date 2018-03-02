// @flow
import React from 'react';
import { TabNavigator, TabBarTop } from 'react-navigation';
import MapView from '@src/components/Views/MapView';
import MyObservationsView from '@src/components/Views/MyObservationsView';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { DARK_GREY, MAPEO_BLUE, WHITE } from '@lib/styles';

const routeConfiguration = {
  MapView: {
    screen: MapView,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => (
        <Icon
          color={tintColor}
          name="near-me"
          size={30}
          style={{ marginLeft: -3 }}
        />
      ),
    },
  },
  MyObservationsView: {
    screen: MyObservationsView,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => (
        <Icon
          color={tintColor}
          name="collections"
          size={30}
          style={{ marginLeft: -3 }}
        />
      ),
    },
  },
};

const tabConfiguration = {
  swipeEnabled: false,
  tabBarComponent: props => (
    <TabBarTop {...props} indicatorStyle={{ borderBottomColor: 'white', borderBottomWidth: 10 }} />
  ),
  tabBarPosition: 'bottom',
  tabBarOptions: {
    activeTintColor: MAPEO_BLUE,
    inactiveTintColor: DARK_GREY,
    showIcon: true,
    showLabel: false,
    style: {
      backgroundColor: WHITE,
      borderTopWidth: 0
    }
  },
};

const TabBar = TabNavigator(routeConfiguration, tabConfiguration);

export default TabBar;
