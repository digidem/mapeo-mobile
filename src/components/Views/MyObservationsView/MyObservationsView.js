// @flow
import React from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';
import { map } from 'lodash';
import type { Observation } from '@types/observation';
import ObservationCell from './ObservationCell';

// type State = {};

export type StateProps = {
  observations: {
    [id: string]: Observation,
  },
};

type Props = {
  closeRightDrawer: Function;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    paddingVertical: 20,
    fontWeight: '700',
    color: 'black',
  },
});

const MyObservationsView = (props: StateProps & Props) => (
  <View style={styles.container}>
    <Text style={styles.header}>My Observations</Text>
    <View style={{ flex: 1, flexDirection: 'column' }}>
      {map(props.observations, observation => (
        <ObservationCell observation={observation} key={observation.id} />
      ))}
    </View>
    <Button onPress={props.closeRightDrawer} title="close" />
  </View>
);

export default MyObservationsView;
