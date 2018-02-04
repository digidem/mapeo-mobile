// @flow
import React from 'react';
import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native';

const styles = StyleSheet.create({
});

class CameraView extends React.Component {
  
  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={{flex: 1, flexDirection: 'row'}}>
        <Text>Camera View</Text>
      </View>
    );
  }
}

export default CameraView;