// @flow
import React from 'react';
import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import LeftChevron from '../../../images/left-chevron.png';

type Props = {
  closeLeftDrawer: Function;
}

const styles = StyleSheet.create({
  closeDrawerButton: {
    backgroundColor: '#333333',
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15,
    width: 40,
  },
});

const PreferencesView = (props: Props) => (
  <View style={{ flex: 1, flexDirection: 'row' }}>
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Text>Prefences &amp; Settings</Text>
    </View>
    <View style={{ flexDirection: 'row' }}>
      <TouchableHighlight onPress={props.closeLeftDrawer} style={styles.closeDrawerButton}>
        <Image source={LeftChevron} style={{ justifyContent: 'center' }} />
      </TouchableHighlight>
    </View>
  </View>
);

export default PreferencesView;
