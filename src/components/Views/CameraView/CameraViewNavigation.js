import React from 'react';
import { Image } from 'react-native';
import CameraViewDrawerNavigation from '@src/components/Views/CameraView/CameraViewDrawerNavigation';

class CameraViewNavigation extends React.Component {
  
  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Image source={require('../../../images/photo-camera.png')} />
    ),
  };

  render() {
    return (
      <CameraViewDrawerNavigation />
    );
  }
}

export default CameraViewNavigation;