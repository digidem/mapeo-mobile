import React from 'react';
import { Image } from 'react-native';
import MapView from '@src/components/Views/MapView';

class MapViewNavigation extends React.Component {
  
  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Image source={require('../../../images/location-arrow.png')} />
    ),
  };

  render() {
    return (
      <MapView />
    );
  }
}

export default MapViewNavigation;