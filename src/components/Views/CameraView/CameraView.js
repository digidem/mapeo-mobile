// @flow
import React from 'react';
import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { DrawerNavigator } from 'react-navigation';

import MyObservationsView from '@src/components/Views/MyObservationsView/MyObservationsView';
import PreferencesView from '@src/components/Views/PreferencesView/PreferencesView';

const styles = StyleSheet.create({
  myObservationsIcon: {
    alignSelf: 'flex-end',
  },
  profileIcon: {
    alignSelf: 'flex-start',
  },
});

const CameraNavView = ({navigation}) => (
  <View style={{flex: 1, flexDirection: 'row'}}>
    <TouchableHighlight
      onPress={() => navigation.navigate('DrawerOpen')}
      underlayColor='antiquewhite'
    >
      <Image source={require('../../../images/profile.png')} style={styles.profileIcon} />
    </TouchableHighlight>
    <TouchableHighlight
      onPress={() => navigation.navigate('DrawerOpen')}
      underlayColor='antiquewhite'
    >
      <Image source={require('../../../images/collections.png')} style={styles.myObservationsIcon}/>
    </TouchableHighlight>
  </View>
);


const myObservationsDrawerRouteConfiguration = {
  CameraNavView: { screen: CameraNavView },
};
const myObservationsDrawerNavigatorConfiguration = {
  contentComponent: MyObservationsView,
  drawerPosition: 'right',
};

const MyObservationsDrawer = DrawerNavigator(myObservationsDrawerRouteConfiguration, myObservationsDrawerNavigatorConfiguration);
const CameraView = DrawerNavigator({
  Child: {
    screen: MyObservationsDrawer,
  }
}, {
  contentComponent: PreferencesView,
});

export default CameraView;