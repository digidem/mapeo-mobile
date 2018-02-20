// @flow
import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import LeftChevron from 'react-native-vector-icons/Entypo';

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
  leftChevron: {
    alignSelf: 'center',
    justifyContent: 'center'
  }
});

const PreferencesView = (props: Props) => (
  <View style={{ flex: 1, flexDirection: 'row' }}>
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Text>Prefences &amp; Settings</Text>
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
