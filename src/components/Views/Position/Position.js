// @flow
import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { NavigationActions, withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { DARK_GREY, LIGHT_GREY, MANGO } from '@lib/styles';

type Props = {
  navigation: NavigationActions
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: DARK_GREY
  },
  forward: {
    backgroundColor: MANGO,
    height: 50
  },
  header: {
    flexDirection: 'row',
    height: 100
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: LIGHT_GREY
  }
});

const Position = (props: Props) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <TouchableHighlight onPress={() => props.navigation.goBack()}>
        <Icon color="gray" name="close" size={25} />
      </TouchableHighlight>
      <Text style={styles.title}>Position</Text>
      <TouchableHighlight
        onPress={() => props.navigation.navigate('Categories')}
        style={styles.forward}
      >
        <Icon color="white" name="arrow-forward" size={25} />
      </TouchableHighlight>
    </View>
  </View>
  );

export default withNavigation(Position);
