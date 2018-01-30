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
    const { navigate } = this.props.navigation;

    return (
      <View style={{flex: 1, flexDirection: 'row'}}>
        <TouchableHighlight
          onPress={() => navigate('DrawerOpen')}
          style={styles.profileIcon}
          underlayColor='antiquewhite'
        >
          <Image source={require('../../../images/profile.png')} />
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => navigate('RightDrawerOpen')}
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