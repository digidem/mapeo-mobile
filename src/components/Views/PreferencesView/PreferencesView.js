// @flow
import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import LeftChevron from 'react-native-vector-icons/Entypo';
import { LIGHT_GREY, WHITE } from '@lib/styles';

type Props = {
  closeLeftDrawer: Function
};

const styles = StyleSheet.create({
  closeDrawerButton: {
    backgroundColor: '#333333',
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15,
    width: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    borderBottomColor: LIGHT_GREY,
    borderBottomWidth: 1,
  },
  leftChevron: {
    alignSelf: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: 'black'
  }
});

const PreferencesView = (props: Props) => (
  <View style={{ flex: 1, flexDirection: 'row', backgroundColor: WHITE }}>
    <View style={styles.container}>
      <Text style={styles.title}>Prefences &amp; Settings</Text>
    </View>
    <View style={{ flexDirection: 'row' }}>
      <TouchableHighlight
        onPress={props.closeLeftDrawer}
        style={styles.closeDrawerButton}
      >
        <LeftChevron color="white" name="chevron-left" size={30} />
      </TouchableHighlight>
    </View>
  </View>
);

export default PreferencesView;
