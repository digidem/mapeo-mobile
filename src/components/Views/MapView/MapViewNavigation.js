import React from 'react';
import { Image } from 'react-native';
import MapView from '@src/components/Views/MapView';

class MapViewNavigation extends React.Component {
  constructor(props) {
    super(props);
  }
  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('../../../images/location-arrow.png')}
        style={{ color: tintColor }}
      />
    ),
  };

  render() {
    return (
      <MapView />
    );
  }
}

export default MapViewNavigation;