// @flow
import React from 'react';
import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native';

const styles = StyleSheet.create({
  myObservationsIcon: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  profileIcon: {
    position: 'absolute',
    left: 20,
    top: 20,
  },
});

class CameraView extends React.Component {
  render() {
    return (
      <View style={{flex: 1, flexDirection: 'row'}}>
        <TouchableHighlight
          onPress={() => this.props.navigation.navigate('DrawerClose')}
          style={styles.profileIcon}
          underlayColor='antiquewhite'
        >
          <Image source={require('../../../images/profile.png')} />
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => this.props.navigation.navigate('RightDrawerOpen')}
          style={styles.myObservationsIcon}
          underlayColor='antiquewhite'
        >
          <Image source={require('../../../images/collections.png')} />
        </TouchableHighlight>
      </View>
    );
  }
}

export default CameraView;