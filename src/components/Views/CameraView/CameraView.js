// @flow
import React from 'react';
import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { DrawerNavigator } from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CameraNavView = ({ navigation }) => (
  <View style={{flex: 1, alignItems: 'flex-end'}}>
    <Text>CameraView</Text>
    <TouchableHighlight
      onPress={() => navigation.navigate('DrawerOpen')}
      underlayColor='antiquewhite'
    >
      <Image source={require('../../../images/collections.png')} />
    </TouchableHighlight>
  </View>  
);


const MyObservationsView = ({ navigation }) => (
  <CameraNavView navigation={navigation} />
);

MyObservationsView.navigationOptions = {
  drawerLabel: 'My Observations',
};


const drawerRouteConfiguration = {
  MyObservationsView: { screen: MyObservationsView },
};
const drawerNavigatorConfiguration = {
  drawerOpenRoute: 'DrawerOpen',
  drawerPosition: 'right',
};

const CameraView = DrawerNavigator(drawerRouteConfiguration, drawerNavigatorConfiguration);

export default CameraView;