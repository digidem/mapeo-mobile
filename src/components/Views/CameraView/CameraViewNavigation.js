import React from 'react';
import { Image } from 'react-native';
import CameraView from '@src/components/Views/CameraView/CameraView';

class CameraViewNavigation extends React.Component {
  constructor(props) {
    super(props);
  }
  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Image source={require('../../../images/photo-camera.png')} />
    ),
  };

  render() {
    return (
      <CameraView />
    );
  }
}

export default CameraViewNavigation;