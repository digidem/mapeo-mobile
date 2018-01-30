// @flow
import React from 'react';
import { StackNavigator } from 'react-navigation';
import MapView from '@src/components/Views/MapView';
import NewObservationView from '@src/components/Views/NewObservationView/NewObservationView';

const routeConfiguration = {
  MapView: {
    screen: MapView,
  },
  NewObservationView: {
    screen: NewObservationView,
  }
};
const stackConfiguration = {
  headerMode: 'none',
};

const MapViewStackNavigation = StackNavigator(routeConfiguration, stackConfiguration);

export default MapViewStackNavigation;