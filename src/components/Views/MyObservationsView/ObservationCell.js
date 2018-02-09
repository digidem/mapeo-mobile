// @flow
import React from 'react';
import moment from 'moment';
import { View, Text, StyleSheet } from 'react-native';
import type { Observation } from '@types/observation';

type Props = {
  observation: Observation;
};

const styles = StyleSheet.create({
  container: {
    height: 80,
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    paddingVertical: 20,
    fontWeight: '700',
    color: 'black',
  },
  text: {
    width: 200,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});

const ObservationCell = (props: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.text}>
        <Text>{props.observation.name}</Text>
        <Text>{moment(props.observation.created).format('dddd, ha')}</Text>
      </View>
    </View>
  );
};

export default ObservationCell;
