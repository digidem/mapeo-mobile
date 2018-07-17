import React from 'react';

const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));

export class RNCamera extends React.Component {
  static Constants = {
    Aspect: {},
    BarCodeType: {},
    Type: { back: 'back', front: 'front' },
    CaptureMode: {},
    CaptureTarget: {},
    CaptureQuality: {},
    Orientation: {},
    FlashMode: {},
    TorchMode: {}
  };

  takePictureAsync = async () => {
    await timeout(2000);
    return {
      base64: 'base64string'
    };
  };

  render() {
    return null;
  }
}

export default RNCamera;
