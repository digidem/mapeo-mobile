// @flow
import React from 'react';
import { StackNavigator } from 'react-navigation';

import MainDrawerNavigation from '@src/components/MainNavigation/MainDrawerNavigation';
import NewObservationView from '@src/components/Views/NewObservationView/NewObservationView';

const routeConfiguration = {
  MainDrawerNavigation: { screen: MainDrawerNavigation },
  NewObservationView: { screen: NewObservationView },
};
const stackConfiguration = {
  initialRouteName: 'MainDrawerNavigation',
  headerMode: 'none',
};

const MainStackNavigation = StackNavigator(routeConfiguration, stackConfiguration);

export default MainStackNavigation;
