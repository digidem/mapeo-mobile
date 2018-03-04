// @flow
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LIGHT_GREY } from '../../../lib/styles';

type Props = {
  title: string
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomColor: LIGHT_GREY,
    borderBottomWidth: 1,
    width: Dimensions.get('window').width - 30,
    paddingHorizontal: 30
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 23,
    color: 'black'
  }
});

const ObservationHeader = (props: Props) => (
  <View style={styles.container}>
    <Text style={styles.title}>{props.title}</Text>
  </View>
);

export default ObservationHeader;
